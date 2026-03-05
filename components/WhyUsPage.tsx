"use client";

import { useRef, ReactNode } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import Image from "next/image";
import EngagementModelsAnimated from "./EngagementModelsAnimated";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { PreloadImage } from "./PreloadImage";

// First hero image URL — preloaded so it doesn’t appear 1–2s late
const HERO_IMAGE_1 = cloudinaryUrl("v1770793036/IMG_4574_3_qapja9.png", { w: 300, h: 430, c: "fill" });

const Word = ({ children, progress, range, highlight = false }: { children: ReactNode, progress: MotionValue<number>, range: [number, number], highlight?: boolean }) => {
  const opacity = useTransform(progress, range, [0.55, 1]);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.2em] relative inline-block ${highlight ? 'text-[#66c2e2]' : ''}`}>
      {children}
    </motion.span>
  )
}

// Icon assets
const iconNetwork = "/images/network.webp";
const iconTalents = "/images/star.png";
const imgUniqueValueProposition = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop";

export default function WhyUsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headingText = "Unique value proposition";
  const contentText = "Fueling Startups and emerging/growing businesses success – we leverage AI tools and open source programs to deliver faster, cost-effective solutions that unlock their growth potential.";

  const headingWords = headingText.split(" ");
  const contentWords = contentText.split(" ");
  const totalWords = headingWords.length + contentWords.length;



  return (
    <main id="main-content">
      <PreloadImage href={HERO_IMAGE_1} />
      <div className="bg-white w-full pt-[100px] sm:pt-[120px] lg:pt-[146px] overflow-clip relative">
        <div className="max-w-[1681px] mx-auto">
          {/* Header Section */}
          {/* Hero Section */}
          <div className="relative w-full min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)] lg:min-h-[calc(100vh-146px)] flex items-center justify-center overflow-visible">
            {/* Background Gradient & Animated Blur */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#E0F2FE]/40 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-[#66c2e2]/15 blur-[80px] rounded-full -z-10 pointer-events-none mix-blend-multiply"
            />

            {/* Left Image Group - Visible on XL screens */}
            <div className="hidden xl:block absolute left-[6%] top-1/2 -translate-y-1/2 w-[400px] h-[400px]">
              {/* Top Left - Vertical image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="absolute left-0 top-0 w-[150px] h-[215px] rounded-[16px] overflow-hidden shadow-xl z-10 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/v1772431483/_DSC02181_c9ygof.jpg", { w: 300, h: 430, c: "fill" })}
                  alt="Feature showcase 1"
                  width={150}
                  height={215}
                  priority
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Top Right - Horizontal image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
                className="absolute left-[160px] top-[50px] w-[212px] h-[142px] rounded-[16px] overflow-hidden shadow-xl z-20 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/v1770663511/IMG_4985_dwhn4x.webp", { w: 424, h: 284, c: "fill" })}
                  alt="Feature showcase 2"
                  width={212}
                  height={142}
                  priority
                  loading="eager"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom Left - Horizontal image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
                className="absolute left-[60px] top-[230px] w-[195px] h-[146px] rounded-[16px] overflow-hidden shadow-xl z-10 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/v1772622114/_DSC0498_kxeric.webp", { w: 390, h: 292, c: "fill" })}
                  alt="Feature showcase 3"
                  width={390}
                  height={292}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Center Content */}
            <div className="relative z-30 text-center max-w-[800px] px-4 mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl lg:text-7xl text-[#232323] font-semibold leading-tight tracking-tight mb-4 sm:mb-5 lg:mb-6"
              >
                Why us
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg lg:text-xl text-[#5a5a5a] leading-relaxed max-w-[600px] mx-auto"
              >
                Discover the values, expertise, and commitment that set us apart and make us the ideal partner for your journey.
              </motion.p>
            </div>

            {/* Right Image Group - Visible on XL screens */}
            <div className="hidden xl:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[400px] h-[400px]">
              {/* Top Right - Vertical image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
                className="absolute right-0 top-0 w-[150px] h-[215px] rounded-[16px] overflow-hidden shadow-xl z-10 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/v1772431484/_DSC0586_1_sv2xmo.jpg", { w: 300, h: 430, c: "fill" })}
                  alt="Feature showcase 4"
                  width={300}
                  height={430}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Top Left - Horizontal image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 100 }}
                className="absolute right-[160px] top-[50px] w-[212px] h-[142px] rounded-[16px] overflow-hidden shadow-xl z-20 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/f_auto,q_auto/v1770654380/IMG_0552_gshpuk.heic", { w: 424, h: 284, c: "fill" })}
                  alt="Feature showcase 5"
                  width={424}
                  height={284}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom Right - Horizontal image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, type: "spring", stiffness: 100 }}
                className="absolute right-[60px] top-[230px] w-[195px] h-[146px] rounded-[16px] overflow-hidden shadow-xl z-10 border-[3px] border-white"
              >
                <Image
                  src={cloudinaryUrl("https://res.cloudinary.com/dejb29i0k/image/upload/v1770793033/IMG_1527_1_vxgn9s.jpg", { w: 390, h: 292, c: "fill" })}
                  alt="Feature showcase 6"
                  width={390}
                  height={292}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full bg-black"
        style={{ height: '180vh' }}
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 xl:px-[70px] py-20 overflow-hidden">
          <div className="w-full max-w-[1681px] mx-auto flex flex-col gap-[30px] sm:gap-[40px] lg:gap-[50px]">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight tracking-tight text-left flex flex-wrap gap-x-[0.3em] gap-y-2">
              {headingWords.map((word, i) => {
                // Map to 0-0.3 range for heading (first 30% of scroll)
                const start = (i / totalWords) * 0.75 + 0.02;
                const end = start + (0.85 / totalWords);
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </h2>
            <p className="text-xl sm:text-3xl lg:text-5xl text-white font-normal leading-relaxed text-left flex flex-wrap gap-x-[0.3em] gap-y-2">
              {contentWords.map((word, i) => {
                const globalIndex = i + headingWords.length;
                // Map to compressed range
                const start = (globalIndex / totalWords) * 0.8 + 0.02;
                const end = start + (0.95 / totalWords);
                const text = String(word).toLowerCase();
                const isHighlight = text.includes("faster") || text.includes("cost-effective");
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]} highlight={isHighlight}>
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white w-full pb-[50px] sm:pb-[60px] lg:pb-[40px] overflow-clip relative px-4 sm:px-6 md:px-8 xl:px-[70px]">
        {/* Background decorative elements - Moved here */}
        <div className="hidden xl:block absolute left-[1780px] top-0 w-[3888px] h-[2104px] pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-200 via-blue-100 to-transparent blur-3xl" />
        </div>
        <div className="hidden xl:block absolute left-[-4020px] top-0 w-[3888px] h-[2104px] pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-blue-200 via-blue-100 to-transparent blur-3xl" />
        </div>

        <div className="max-w-[1681px] mx-auto">
          {/* Our Expertise */}
          <div className="mb-12 sm:mb-16 lg:mb-[30px] pt-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-semibold leading-tight mb-4 sm:mb-5 lg:mb-6 tracking-[-1.2px]">
              Our expertise
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed mb-8 sm:mb-10 lg:mb-[30px] max-w-4xl">
              We believe in nurturing diverse talent, fostering creativity, and empowering individuals to reach their full potential.
            </p>

            {/* Expertise Cards - Modern Design */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-[20px]">
              {/* Network of Tech SMES Card */}
              <div className="group bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[20px] p-6 sm:p-8 lg:p-[32px] shadow-[0px_4px_20px_rgba(102,194,226,0.15)] hover:shadow-[0px_6px_24px_rgba(102,194,226,0.2)] transition-all duration-300 h-auto lg:h-[448px] relative overflow-hidden hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#66c2e2]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Icon with background */}
                  <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] mb-5 sm:mb-6 lg:mb-[20px] bg-gradient-to-br from-[#66c2e2] to-[#005c89] rounded-2xl p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                    <Image src={iconNetwork} alt="Network icon" fill className="object-contain filter brightness-0 invert p-4" sizes="100px" />
                  </div>

                  <h3 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] text-[#232323] font-bold leading-[1.3] sm:leading-[1.4] lg:leading-[1.4] mb-3 sm:mb-4 lg:mb-[16px]">
                    Network of tech SMEs
                  </h3>

                  <p className="text-[16px] sm:text-[18px] lg:text-[18px] text-[#4a5568] leading-[1.7] sm:leading-[1.75] lg:leading-[1.8]">
                    Our expert network comprises accomplished industry leaders from around the globe, bringing together a wealth of diverse insights and unparalleled expertise to foster collaboration, drive innovation, and offer strategic guidance across various sectors.
                  </p>
                </div>
              </div>

              {/* Top tech talents Card */}
              <div className="group bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[20px] p-6 sm:p-8 lg:p-[32px] shadow-[0px_4px_20px_rgba(102,194,226,0.15)] hover:shadow-[0px_6px_24px_rgba(102,194,226,0.2)] transition-all duration-300 h-auto lg:h-[448px] relative overflow-hidden hover:bg-gradient-to-br hover:from-white hover:to-blue-50">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#66c2e2]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                <div className="relative z-10">
                  {/* Icon with background */}

                  <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] mb-5 sm:mb-6 lg:mb-[20px] bg-gradient-to-br from-[#66c2e2] to-[#005c89] rounded-2xl p-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative">
                    <Image src={iconTalents} alt="Talents icon" fill className="object-contain filter brightness-0 invert p-4" sizes="100px" />
                  </div>

                  <h3 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] text-[#232323] font-bold leading-[1.3] sm:leading-[1.4] lg:leading-[1.4] mb-3 sm:mb-4 lg:mb-[16px]">
                    Top tech talents
                  </h3>

                  <p className="text-[16px] sm:text-[18px] lg:text-[18px] text-[#4a5568] leading-[1.7] sm:leading-[1.75] lg:leading-[1.8]">
                    At the core of our top tech talents lies an unwavering commitment to excellence, cultivated through meticulous hiring practices, hands-on training, and mentorship-led assimilation, ensuring a dynamic and proficient team ready to tackle the most complex technological challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Engagement Models */}
          <div className="mb-8 sm:mb-10 pt-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-semibold leading-tight mb-4 sm:mb-5 lg:mb-6 tracking-[-1.2px]">
              Our engagement models
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed mb-10 sm:mb-12 lg:mb-[50px] max-w-4xl">
              We offer flexible engagement models as per the client requirements.
            </p>

            <EngagementModelsAnimated />
          </div>
        </div>
      </div>
    </main>
  );
}