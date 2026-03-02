"use client";

import React, { useState, useCallback, FormEvent, ChangeEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "../../../components/Footer";
import Navigation from "../../../components/Navigation";
import Turnstile from "../../../components/Turnstile";



function ApplyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("jobId");
  const jobTitle = searchParams.get("title") || "Position";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    whatsapp: "",
    specialization: "",
    cgpa: "",
    college: "",
    yearOfGrad: "",
    yearOfGradOther: "",
    backlogs: "Nil",
    resume: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          resume: "File size must be less than 5MB",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
      if (errors.resume) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.resume;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp contact is required";
    } else {
      // Remove spaces, dashes, and parentheses for validation
      const cleanNumber = formData.whatsapp.replace(/[\s\-()]/g, "");
      // Validate: should contain only digits, 7-15 digits after country code
      if (!/^\d{7,15}$/.test(cleanNumber)) {
        newErrors.whatsapp = "Please enter a valid phone number (7-15 digits)";
      }
    }
    if (!formData.specialization.trim()) newErrors.specialization = "Specialization is required";
    if (!formData.cgpa.trim()) {
      newErrors.cgpa = "CGPA is required";
    } else {
      const cgpaNum = parseFloat(formData.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        newErrors.cgpa = "CGPA must be between 0 and 10";
      }
    }
    if (!formData.college.trim()) newErrors.college = "College is required";
    if (!formData.yearOfGrad) newErrors.yearOfGrad = "Year of graduation is required";
    if (formData.yearOfGrad === "Other" && !formData.yearOfGradOther.trim()) {
      newErrors.yearOfGradOther = "Please specify the year";
    }
    if (!formData.resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!turnstileToken) {
      setErrors((prev) => ({ ...prev, turnstile: "Please complete the CAPTCHA verification" }));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Upload file directly to Cloudflare Function (which uploads to Supabase server-side)
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.resume!);

      const uploadResponse = await fetch("/api/upload-resume", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: "Unknown error" }));
        console.error("Upload error:", errorData);

        let errorMessage = "Failed to upload resume. Please try again.";
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.details) {
          if (typeof errorData.details === 'string') {
            errorMessage = errorData.details;
          } else if (errorData.details.message) {
            errorMessage = errorData.details.message;
          }
        }

        throw new Error(errorMessage);
      }

      const { publicUrl, filePath } = await uploadResponse.json();
      const resumeUrl = publicUrl;

      // Submit application data
      const applicationResponse = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: jobId || "",
          jobTitle: jobTitle || null,
          name: formData.name,
          email: formData.email,
          whatsapp: `${formData.countryCode}${formData.whatsapp.replace(/[\s\-()]/g, "")}`,
          specialization: formData.specialization,
          cgpa: parseFloat(formData.cgpa),
          college: formData.college,
          yearOfGrad: formData.yearOfGrad === "Other" ? formData.yearOfGradOther : formData.yearOfGrad,
          backlogs: formData.backlogs,
          resumeUrl: resumeUrl || filePath,
          turnstileToken,
        }),
      });

      if (!applicationResponse.ok) {
        const errorData = await applicationResponse.json().catch(() => ({ error: "Unknown error" }));
        const errorMessage = errorData.error || errorData.details || "Failed to submit application";
        console.error("Application submission error:", errorMessage, errorData);
        throw new Error(errorMessage);
      }

      setSubmitStatus("success");

      // Track form submission
      const { trackEvent } = await import("@/lib/analytics");
      trackEvent("application_form_submit", "form", jobId || "general");

      // Reset form
      setFormData({
        name: "",
        email: "",
        countryCode: "+91",
        whatsapp: "",
        specialization: "",
        cgpa: "",
        college: "",
        yearOfGrad: "",
        yearOfGradOther: "",
        backlogs: "Nil",
        resume: null,
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/careers");
      }, 3000);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-30 lg:pt-35 lg:pb-24 text-sm sm:text-base">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-black mb-2 leading-tight">
            Apply for {jobTitle}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm">
            Please fill in all the required fields below.
          </p>
        </div>

        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Your application has been submitted successfully! Redirecting to careers page...
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold mb-2">
              There was an error submitting your application.
            </p>
            <p className="text-red-700 text-sm">
              Please check the console for details and try again. If the problem persists, the Edge Function may not be deployed yet.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Name of the Applicant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Full Name"
              />
              {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Email Id <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="abc@example.com"
              />
              {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                WhatsApp Contact <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] bg-white"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                </select>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.whatsapp ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="1234567890"
                />
              </div>
              {errors.whatsapp && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.whatsapp}</p>}
              <p className="mt-1 text-xs text-gray-500">Enter number without country code</p>
            </div>

            {/* Specialization */}
            <div>
              <label htmlFor="specialization" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                BE/BTech Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.specialization ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Eg: Computer Science"
              />
              {errors.specialization && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.specialization}</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label htmlFor="cgpa" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                CGPA <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  (if 2025 pass outs SGPA upto 7th semester)
                </span>
              </label>
              <input
                type="number"
                id="cgpa"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="10"
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.cgpa ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="8.5"
              />
              {errors.cgpa && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.cgpa}</p>}
            </div>

            {/* College */}
            <div>
              <label htmlFor="college" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                College <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.college ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="University Name"
              />
              {errors.college && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.college}</p>}
            </div>

            {/* Year of Graduation */}
            <div>
              <label htmlFor="yearOfGrad" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Year of Graduation <span className="text-red-500">*</span>
              </label>
              <select
                id="yearOfGrad"
                name="yearOfGrad"
                value={formData.yearOfGrad}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.yearOfGrad ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select Year</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="Other">Other</option>
              </select>
              {formData.yearOfGrad === "Other" && (
                <input
                  type="text"
                  name="yearOfGradOther"
                  value={formData.yearOfGradOther}
                  onChange={handleChange}
                  placeholder="Enter year"
                  className={`w-full mt-2 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.yearOfGradOther ? "border-red-500" : "border-gray-300"
                    }`}
                />
              )}
              {errors.yearOfGrad && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.yearOfGrad}</p>
              )}
              {errors.yearOfGradOther && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.yearOfGradOther}</p>
              )}
            </div>

            {/* Backlogs */}
            <div>
              <label htmlFor="backlogs" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                No of Backlogs <span className="text-red-500">*</span>
              </label>
              <select
                id="backlogs"
                name="backlogs"
                value={formData.backlogs}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89]"
              >
                <option value="Nil">Nil</option>
                <option value="<=2">&lt;=2</option>
                <option value=">2">&gt;2</option>
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label htmlFor="resume" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Upload your Latest Resume <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="resume"
              name="resume"
              accept="application/pdf"
              onChange={handleFileChange}
              className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C89] ${errors.resume ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.resume && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.resume}</p>}
            {formData.resume && (
              <p className="mt-2 text-xs sm:text-sm text-gray-600">Selected: {formData.resume.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">PDF only, max 5MB</p>
          </div>

          {/* Turnstile CAPTCHA */}
          <div>
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onVerify={handleTurnstileVerify}
              onExpire={handleTurnstileExpire}
              theme="light"
            />
            {errors.turnstile && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.turnstile}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="flex-1 bg-gradient-to-r from-[#66c2e2] to-[#005c89] text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-600">Loading application form...</p>
        </div>
      </div>
    }>
      <ApplyForm />
    </Suspense>
  );
}
