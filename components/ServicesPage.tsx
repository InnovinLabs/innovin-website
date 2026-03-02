"use client";

import { useContactModal } from "./ContactModal";
import { AnimatedButton } from "./AnimatedButton";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { PreloadImage } from "./PreloadImage";
import Image from "next/image";

const imgLogoDark = "/images/logo.png";
const imgEllipse2 = "/images/blue_gradient.svg";
// Service images: container up to 550×400 — request 1100×800 at fetch (2x)
const imgProductDev = cloudinaryUrl("v1770996488/1p_dhnwny.png", { w: 1100, h: 800, c: "fill" });
const imgDesign = cloudinaryUrl("v1770996488/2p_bjbzt1.png", { w: 1100, h: 800, c: "fill" });
const imgConsulting = cloudinaryUrl("v1770996489/3p_tvalko.png", { w: 1100, h: 800, c: "fill" });
const imgAIConsulting = cloudinaryUrl("v1770996488/4p_mp3wui.png", { w: 1100, h: 800, c: "fill" });

export default function ServicesPage() {
  const { openModal } = useContactModal();

  const services = [
    {
      title: "Smart product development",
      description: "We're not just software consultants – we're your Trusted Tech Innovation Partner and efficiency architects. We leverage the power of existing tools and technology to streamline your operations, slash costs, and build a smarter, faster, and future-proof solution for your business needs.",
      bullets: [
        "Boost your coding superpowers with AI-simplify complexity, code naturally, and enhance reliability and speed!",
        "AI handles entry-level coding, allowing developers to focus on complex tasks, integration, and strategic innovation.",
      ],
      image: imgProductDev,
      imageLeft: false,
    },
    {
      title: "AI-enhanced design and prototyping",
      description: "We blend creativity with intelligence to transform ideas into intuitive, data-driven designs. By harnessing AI-powered insights and rapid prototyping tools, we help you visualize, validate, and refine products faster ensuring every design decision is backed by precision, performance, and user delight.",
      bullets: [
        "We develop innovative design options and generate multiple solutions based on AI-driven algorithms and constraints.",
        "We simulate user journeys and anticipate potential bottlenecks using AI-based modeling, informing design iterations and optimization.",
      ],
      image: imgDesign,
      imageLeft: true,
    },
    {
      title: "Strategic technology consulting",
      description: "We're not just software consultants – we're your Trusted Tech Innovation Partner and efficiency architects. We leverage the power of existing tools and technology to streamline your operations, slash costs, and build a smarter, faster, and future-proof solution for your business needs.",
      bullets: [
        "Craft Custom Plans: We tailor a technology roadmap that leverages existing tools to automate tasks, improve data flow, and enhance collaboration.",
        "Offer Smart Solutions: We use powerful off-the-shelf tools, like AI-powered data analysis, to fit your specific needs and budget.",
        "Capacity Building:",
      ],
      image: imgConsulting,
      imageLeft: false,
    },
    {
      title: "Strategic AI consulting",
      description: "We empower you with intelligent solutions, leveraging AI tools to solve specific business problems and achieve strategic goals.",
      bullets: [
        "Tailored intelligence that crafts solutions optimized for your unique industry challenges, for maximum impact.",
        "Combine expert-driven AI tools with deep industry knowledge, ensuring solutions that seamlessly integrate with your existing operations.",
        "Outcome-focused AI strategies designed to deliver measurable value, scalability, and long-term business advantage."
      ],
      image: imgAIConsulting,
      imageLeft: true,
    },
  ];

  return (
    <main id="main-content" className="bg-white flex flex-col items-start px-0 py-5 sm:py-6 lg:py-[20px] relative min-h-screen w-full pt-24 sm:pt-28 lg:pt-32">
      <PreloadImage href={imgProductDev} />
      {/* Hero Section */}
      <div className="w-full px-4 sm:px-6 md:px-8 xl:px-[70px] py-5 sm:py-6 lg:py-[20px]">
        <div className="flex flex-col gap-[60px] sm:gap-[100px] xl:gap-[80px] items-start relative w-full max-w-[1681px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col items-center px-4 sm:px-5 lg:px-[20px] py-0 relative w-full">
            <div className="flex items-start pl-0 pr-4 sm:pr-5 lg:pr-[20px] relative w-full">
              <div className="flex flex-col items-center justify-center relative w-full">
                {/* Blur Banner Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-[#66c2e2]/15 blur-[60px] rounded-full -z-10 pointer-events-none mix-blend-multiply" />

                <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#232323] font-semibold leading-tight tracking-tight mb-4 sm:mb-5 lg:mb-6 w-full text-center">
                  Our services
                </h1>
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-[#5a5a5a] leading-relaxed max-w-[600px] mx-auto w-full text-center">
              We infuse AI into all aspects of technology and development, delivering smarter outcomes and smoother experiences.
            </p>
          </div>

          {/* Services List */}
          <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 xl:gap-24 items-start relative w-full">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col xl:flex-row gap-8 sm:gap-10 xl:gap-16 items-center xl:items-start relative w-full ${service.imageLeft ? "xl:flex-row-reverse" : ""
                  }`}
              >
                {/* Content */}
                <div className="flex-1 flex flex-col gap-4 sm:gap-6 items-start relative text-[#232323] w-full xl:w-auto order-2 xl:order-none">
                  <div className="flex flex-col gap-3 sm:gap-4 items-start relative w-full">
                    <h2 className="font-semibold leading-[1.2] sm:leading-[1.3] relative text-3xl sm:text-4xl lg:text-5xl w-full tracking-[-1.2px] text-center xl:text-left">
                      {service.title}
                    </h2>
                    <p className="font-normal leading-relaxed relative text-base sm:text-lg text-gray-700 w-full mt-2 text-center xl:text-left">
                      {service.description}
                    </p>
                  </div>
                  <ul className="block font-normal leading-relaxed relative text-base sm:text-lg text-gray-700 w-full space-y-2 mt-2">
                    {service.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="ms-6 list-disc pl-2">
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image */}
                <div className="relative shrink-0 w-full max-w-[340px] md:max-w-[450px] xl:max-w-none xl:w-[550px] aspect-[4/3] order-1 xl:order-none flex items-center justify-center mx-auto xl:mx-0">
                  <div className="relative w-full h-full transition-transform duration-500 transform scale-[0.7] xl:scale-[0.9]">
                    <Image
                      alt={service.title}
                      src={service.image}
                      width={550}
                      height={400}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : undefined}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

