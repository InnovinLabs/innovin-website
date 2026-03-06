"use client";

import { useState, useEffect, useLayoutEffect, useRef, useCallback, createContext, useContext, ReactNode } from "react";
import { ChevronUp, ArrowRight, X, CheckCircle } from "lucide-react";
import Turnstile from "./Turnstile";

// Context for managing modal state
interface ContactModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <ContactModal />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}

// Form data interface
interface ContactFormData {
  name: string;
  company: string;
  email: string;
  message: string;
}

// Country codes for phone numbers
const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
];

function ContactModal() {
  const { isOpen, closeModal } = useContactModal();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Turnstile is disabled in local dev (NEXT_PUBLIC_ENABLE_TURNSTILE=false)
  const isTurnstileEnabled = process.env.NEXT_PUBLIC_ENABLE_TURNSTILE === 'true';
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setFormData({ name: "", company: "", email: "", message: "" });
      setErrors({});
      setShowSuccess(false);
      setIsSubmitting(false);
      setTurnstileToken(null);
    }
  }, [isOpen]);

  // Focus input on step change
  useEffect(() => {
    if (isOpen && !showSuccess) {
      setTimeout(() => {
        switch (currentStep) {
          case 1:
            nameInputRef.current?.focus();
            break;
          case 2:
            companyInputRef.current?.focus();
            break;
          case 3:
            emailInputRef.current?.focus();
            break;
          case 4:
            messageInputRef.current?.focus();
            break;
        }
      }, 100);
    }
  }, [currentStep, isOpen, showSuccess]);

  // Handle escape key and browser back button
  useEffect(() => {
    if (isOpen) {
      // Push state to browser history when modal opens
      window.history.pushState({ modalOpen: true }, document.title);
    }

    const handlePopState = () => {
      // If user presses back button, close modal
      if (isOpen) {
        closeModal();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        // If closing via escape, we should technically also go back in history if we pushed state
        // But for simplicity, we'll just close and let cleanup handle it or user press back again
        closeModal();
        window.history.back(); // Remove the pushed state
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]); // Only run when isOpen changes to true

  // Ensure we clean up history if modal is closed programmatically (e.g. clicking X or backdrop)
  // This is tricky because we don't want to go back if the close was triggered BY the back button (popstate)
  // We can track if the close was initiated by popstate or not
  const handleClose = () => {
    // If we're closing via UI, go back in history to remove the pushed state
    // But we need to distinguish between UI close and back button close
    // For now, simpler approach: Just close modal on back button. If UI close, user stays on page.
    // The history state will remain until they navigate away or press back again.
    // This is often acceptable behavior for modals.
    // If strict behavior is needed:
    // We would need a ref to track if 'popstate' triggered the close.
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
    closeModal();
  };

  // Enhanced scroll prevention - handles desktop, mobile, and iOS
  // useLayoutEffect prevents a visible "jump to top then back" on close by running cleanup before paint.
  useLayoutEffect(() => {
    if (isOpen) {
      // Store original body styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const scrollY = window.scrollY;

      // Prevent scrolling on desktop
      document.body.style.overflow = "hidden";

      // Prevent scrolling on mobile (especially iOS)
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Prevent touch move on the backdrop
      const preventTouchMove = (e: TouchEvent) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      };

      document.body.addEventListener("touchmove", preventTouchMove, { passive: false });

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;

        // Restore scroll position
        window.scrollTo(0, scrollY);

        // Remove event listener
        document.body.removeEventListener("touchmove", preventTouchMove);
      };
    }
  }, [isOpen]);

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    } else if (step === 2) {
      if (!formData.company.trim()) {
        newErrors.company = "Company name is required";
      } else if (formData.company.trim().length < 2) {
        newErrors.company = "Company name must be at least 2 characters";
      }
    } else if (step === 3) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (step === 4) {
      if (!formData.message.trim()) {
        newErrors.message = "Message is required";
      } else if (formData.message.trim().length < 10) {
        newErrors.message = "Message must be at least 10 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  if (!isOpen) return null;

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleEnter = async () => {
    if (currentStep < 5) {
      handleNext();
    } else {
      if (!validateStep(5)) return;

      if (isTurnstileEnabled && !turnstileToken) {
        setErrors({ submit: "Please complete the CAPTCHA verification" });
        return;
      }

      setIsSubmitting(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(`${apiUrl}/api/contact-messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: `Company: ${formData.company}\n\nMessage: ${formData.message}`,
            turnstileToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          console.error("Contact form submission error:", errorData);

          let errorMessage = "Failed to submit message. Please try again later.";

          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.details) {
            if (typeof errorData.details === 'string') {
              errorMessage = errorData.details;
            } else if (errorData.details.message) {
              errorMessage = errorData.details.message;
            } else if (typeof errorData.details === 'object') {
              errorMessage = errorData.details.message || errorData.details.error || errorMessage;
            }
          }

          setErrors({ submit: errorMessage });
          setIsSubmitting(false);
          return;
        }

        setShowSuccess(true);
        setIsSubmitting(false);

        // Track form submission
        const { trackEvent } = await import("@/lib/analytics");
        trackEvent("contact_form_submit", "form", "contact_modal");

        setTimeout(() => {
          setFormData({ name: "", company: "", email: "", message: "" });
          setCurrentStep(1);
          setShowSuccess(false);
          handleClose();
        }, 3000);
      } catch (error) {
        console.error("Error submitting contact form:", error);
        setErrors({ submit: "Failed to submit message. Please try again." });
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  const NavButton = ({ onClick, disabled, rotate = false }: { onClick: () => void; disabled?: boolean; rotate?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#5e5e5e] flex items-center justify-center p-[4.8px] rounded-[42px] shrink-0 transition-opacity ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        }`}
    >
      <div className={`flex items-center justify-center size-[14.4px] ${rotate ? "rotate-[180deg] scale-y-[-100%]" : ""}`}>
        <ChevronUp className="size-[14.4px] rotate-[270deg] text-white" />
      </div>
    </button>
  );

  const StepIndicator = ({ step }: { step: number }) => (
    <div className="flex gap-2 sm:gap-[12px] h-[28px] sm:h-[32px] items-center shrink-0">
      <p className="font-['Manrope',sans-serif] font-light leading-[1.2] sm:leading-[60px] shrink-0 text-[12px] sm:text-[14px] text-nowrap text-white whitespace-pre">
        Step {step}/5
      </p>
    </div>
  );

  const PleaseEnterButton = ({ onClick }: { onClick: () => void }) => (
    <div
      className="flex gap-2 sm:gap-[10px] items-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
    >
      <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[#ababab] text-[14px] sm:text-[16px] text-nowrap whitespace-pre">
        Please enter
      </p>
      <button
        disabled={isSubmitting}
        className="relative shrink-0 size-[20px] sm:size-[24px] flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Enter"
      >
        <ArrowRight className="size-[18px] sm:size-[20px] text-[#ababab]" />
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 lg:p-6 sm:pt-8 overflow-hidden"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative sm:mt-0 bg-[#131518] rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] w-full max-w-[680px] shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated loading overlay inside modal */}
        {isSubmitting && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#131518]/90 backdrop-blur-sm rounded-[12px] sm:rounded-[16px] lg:rounded-[20px]">
            <div className="flex flex-col items-center gap-5">
              {/* Spinner */}
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-[3px] border-white/10" />
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#66c2e2] animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-[#66c2e2] font-semibold text-base">Sending your message…</p>
                <p className="text-white/40 text-sm mt-1">Just a moment!</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        < div className="bg-[#131518] flex flex-col sm:flex-row gap-2 sm:gap-[361px] min-h-[54px] h-auto sm:h-[54px] items-start sm:items-center px-4 sm:px-[30px] py-3 sm:py-[10px] rounded-tl-[12px] sm:rounded-tl-[16px] lg:rounded-tl-[20px] rounded-tr-[12px] sm:rounded-tr-[16px] lg:rounded-tr-[20px] shrink-0 relative" >
          <div className="flex-1 w-full sm:w-auto">
            {!showSuccess && currentStep === 1 && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-white text-[14px] sm:text-[16px] whitespace-normal">What's your name?</p>}
            {!showSuccess && currentStep === 2 && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-white text-[14px] sm:text-[16px] whitespace-normal">What's your company name</p>}
            {!showSuccess && currentStep === 3 && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-white text-[14px] sm:text-[16px] whitespace-normal">What's your email</p>}
            {!showSuccess && currentStep === 4 && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-white text-[14px] sm:text-[16px] whitespace-normal">What can we help you with</p>}
            {!showSuccess && currentStep === 5 && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-white text-[14px] sm:text-[16px]">Confirm messsage</p>}
            {showSuccess && <p className="font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[#66c2e2] text-[14px] sm:text-[16px]">Thank you!</p>}
          </div>

          {
            !showSuccess && (
              <div className="hidden sm:block">
                <StepIndicator step={currentStep} />
              </div>
            )
          }
        </div >

        {/* Content */}
        < div className="bg-[#131518] border-t border-[#6a6a6a] border-solid flex flex-col gap-[3px] items-start px-4 sm:px-6 lg:px-[30px] py-4 sm:py-6 lg:py-0 rounded-bl-[12px] sm:rounded-bl-[16px] lg:rounded-bl-[20px] rounded-br-[12px] sm:rounded-br-[16px] lg:rounded-br-[20px] shrink-0 w-full overflow-y-auto overscroll-contain touch-pan-y" >
          {
            showSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 gap-4 sm:gap-6 w-full" >
                <CheckCircle className="size-12 sm:size-16 text-[#66c2e2]" />
                <p className="font-['Manrope',sans-serif] font-medium text-white text-center text-lg sm:text-xl lg:text-2xl">
                  We'll reach out to you soon!
                </p>
                <p className="font-['Manrope',sans-serif] font-normal text-[#878787] text-center text-sm sm:text-base">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleEnter)}
                      placeholder="Your name..."
                      className={`font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[18px] sm:text-[20px] lg:text-[24px] text-white w-full bg-transparent border-none outline-none placeholder:text-[#878787] ${errors.name ? "text-red-400" : ""
                        }`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.name}</p>
                    )}
                    <div className="flex items-center justify-between shrink-0 w-full pt-2 sm:pt-0">
                      <div className="flex gap-[5px] items-center shrink-0">
                        <div className="bg-[#5e5e5e] flex items-center justify-center p-[4.8px] rounded-[42px] shrink-0 opacity-50 cursor-not-allowed">
                          <div className="flex items-center justify-center size-[14.4px]">
                            <ChevronUp className="size-[14.4px] rotate-[270deg] text-white" />
                          </div>
                        </div>
                        <NavButton onClick={handleNext} rotate />
                      </div>
                      <PleaseEnterButton onClick={handleEnter} />
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <input
                      ref={companyInputRef}
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleEnter)}
                      placeholder="Your company..."
                      className={`font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[18px] sm:text-[20px] lg:text-[24px] text-white w-full bg-transparent border-none outline-none placeholder:text-[#878787] ${errors.company ? "text-red-400" : ""
                        }`}
                    />
                    {errors.company && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.company}</p>
                    )}
                    <div className="flex items-center justify-between shrink-0 w-full">
                      <div className="flex gap-[5px] items-center shrink-0">
                        <NavButton onClick={handlePrevious} />
                        <NavButton onClick={handleNext} rotate />
                      </div>
                      <PleaseEnterButton onClick={handleEnter} />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleEnter)}
                      placeholder="your.email@example.com"
                      className={`font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[18px] sm:text-[20px] lg:text-[24px] text-white w-full bg-transparent border-none outline-none placeholder:text-[#878787] ${errors.email ? "text-red-400" : ""
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>
                    )}
                    <div className="flex items-center justify-between shrink-0 w-full">
                      <div className="flex gap-[5px] items-center shrink-0">
                        <NavButton onClick={handlePrevious} />
                        <NavButton onClick={handleNext} rotate />
                      </div>
                      <PleaseEnterButton onClick={handleEnter} />
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <textarea
                      ref={messageInputRef}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleEnter();
                        }
                      }}
                      placeholder="Your message..."
                      rows={3}
                      maxLength={500}
                      className={`font-['Manrope',sans-serif] font-medium leading-[1.2] sm:leading-[60px] shrink-0 text-[18px] sm:text-[20px] lg:text-[24px] text-white w-full bg-transparent border-none outline-none placeholder:text-[#878787] resize-none ${errors.message ? "text-red-400" : ""
                        }`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs sm:text-sm mt-1">{errors.message}</p>
                    )}
                    <div className="flex items-center justify-between shrink-0 w-full">
                      <div className="flex gap-[5px] items-center shrink-0">
                        <NavButton onClick={handlePrevious} />
                        <NavButton onClick={handleNext} rotate />
                      </div>
                      <PleaseEnterButton onClick={handleEnter} />
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div className="flex flex-col gap-4 sm:gap-[24px] items-start shrink-0 w-full py-4 sm:py-[20px]">
                      <div className="flex flex-col gap-2 sm:gap-[10px] items-start leading-normal shrink-0 text-[14px] sm:text-[16px] w-full">
                        <p className="font-['Manrope',sans-serif] font-medium shrink-0 text-[#878787] w-full">Name</p>
                        <p className="font-['Manrope',sans-serif] font-normal shrink-0 text-white w-full break-words">{formData.name || "—"}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:gap-[10px] items-start leading-normal shrink-0 text-[14px] sm:text-[16px] w-full">
                        <p className="font-['Manrope',sans-serif] font-medium shrink-0 text-[#878787] w-full">Company</p>
                        <p className="font-['Manrope',sans-serif] font-normal shrink-0 text-white w-full break-words">{formData.company || "—"}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:gap-[10px] items-start leading-normal shrink-0 text-[14px] sm:text-[16px] w-full">
                        <p className="font-['Manrope',sans-serif] font-medium shrink-0 text-[#878787] w-full">Email</p>
                        <p className="font-['Manrope',sans-serif] font-normal shrink-0 text-white w-full break-words">{formData.email || "—"}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:gap-[10px] items-start leading-normal shrink-0 text-[14px] sm:text-[16px] w-full">
                        <p className="font-['Manrope',sans-serif] font-medium shrink-0 text-[#878787] w-full">More info</p>
                        <p className="font-['Manrope',sans-serif] font-normal shrink-0 text-white w-full break-words">{formData.message || "—"}</p>
                      </div>
                    </div>
                    {isTurnstileEnabled && (
                      <div className="w-full pt-2">
                        <Turnstile
                          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                          onVerify={handleTurnstileVerify}
                          onExpire={handleTurnstileExpire}
                          theme="dark"
                        />
                      </div>
                    )}
                    {errors.submit && (
                      <p className="text-red-400 text-xs sm:text-sm mb-2">{errors.submit}</p>
                    )}
                    <div className="flex items-center justify-between shrink-0 w-full pb-4 sm:pb-[20px] pt-2 sm:pt-0">
                      <div className="flex gap-[5px] items-center shrink-0">
                        <NavButton onClick={handlePrevious} />
                        <div className="bg-[#5e5e5e] flex items-center justify-center p-[4.8px] rounded-[42px] shrink-0 opacity-50 cursor-not-allowed">
                          <div className="flex items-center justify-center size-[14.4px] rotate-[180deg] scale-y-[-100%]">
                            <ChevronUp className="size-[14.4px] rotate-[270deg] text-white" />
                          </div>
                        </div>
                      </div>
                      <PleaseEnterButton onClick={handleEnter} />
                    </div>
                  </>
                )}
              </>
            )}
        </div >
      </div >
    </div >
  );
}

export default ContactModal;