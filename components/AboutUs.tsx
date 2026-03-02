"use client";
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { X, Linkedin } from "lucide-react";
import Footer from "./Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PreloadImage } from "./PreloadImage";

gsap.registerPlugin(ScrollTrigger);

// Image assets
const imgHeroBackground =
  "https://res.cloudinary.com/dejb29i0k/image/upload/f_auto,q_auto/v1772396765/group_gbpsac.webp";

import Image from "next/image";

const teamPhotos = [
  "/images/compressed_573ac6c833b631241442f52f9339c8f43a7bcb76.webp",
  "/images/compressed_d7fbbc268730dca1329c17ec05aad7e281134f4f.webp",
  "/images/compressed_af0d73906f117e3a32a5cb2964335364aff6973e.webp",
  "/images/compressed_efdf1ab711ffad6d48b3163655ede5890772aaf2.webp",
];

import { leadershipTeam } from "@/lib/leadership";

const coreValues = [
  { title: "Be customer obsessed", icon: "/images/c1.png" },
  { title: "Excellence", icon: "/images/c2.png" },
  { title: "Honesty and integrity", icon: "/images/c3.png" },
  { title: "Entrepreneurial mindset", icon: "/images/c4.png" },
  { title: "Give more than you take", icon: "/images/c5.png" },
  { title: "Make progress over perfection", icon: "/images/c6.png" },
];

const journeyContent = `We understand the startup journey firsthand. We know how critical it is to have a trusted technology partner—one who truly understands the challenges, uncertainty, and ambition that come with building something from the ground up.

Innovin Labs wasn’t always a tech partner for startups. We were once innovators ourselves, working to solve social health challenges for the elderly. Building for this demographic presented unique hurdles that demanded adaptability, empathy, and resilience. Those experiences shaped who we are today and gave rise to our mission: empowering startups to overcome their technical barriers and turn bold ideas into successful products.

That’s why Innovin Labs exists. We provide tailored technology solutions and expert guidance, allowing you to stay focused on your vision while we handle the complexity. Our team works closely with you, collaborating at every step to transform ideas into reality using cutting-edge technology and flexible, startup-friendly approaches.

Our story is not just about technology—it’s about shared experience, understanding, and a deep commitment to your success. Don’t let technical challenges slow your momentum. Partner with Innovin Labs, and let us help power your startup journey forward.`;

const missionContent =
  "Revolutionize the tech industry by combining cutting-edge technology employing AI capabilities. Revolutionize the tech industry by combining cutting-edge technology employing AI capabilities. Revolutionize the tech industry by combining cutting-edge technology employing AI capabilities.";

const visionContent =
  "We envision a world where every startup, regardless of size, has access to world-class engineering talent and product thinking \u2014 enabling ideas to move from concept to reality faster than ever before. Revolutionize the tech industry by combining cutting-edge technology employing AI capabilities.";


/* ───────── Reusable sub-components ───────── */

function CoreValueCard({
  icon,
  title,
  delay = 0,
}: {
  icon: string;
  title: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -200px 0px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col items-center transition-all duration-700 ease-out w-[200px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-[200px] h-[165px] mb-[13px] text-[80px] flex items-center justify-center flex-shrink-0 relative">
        <Image src={icon} alt="" fill className="object-cover" />
      </div>
      <h3 className="text-[25px] text-white leading-[1.4] tracking-[-0.375px] text-center break-words font-normal">
        {title}
      </h3>
    </div>
  );
}

function CoreValueCardMobile({
  icon,
  title,
  delay = 0,
}: {
  icon: string;
  title: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`flex flex-col items-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] mb-3 sm:mb-4 text-[50px] sm:text-[60px] md:text-[70px] flex items-center justify-center relative">
        <Image src={icon} alt="" fill className="object-cover" />
      </div>
      <h3 className="text-[15px] sm:text-[17px] md:text-[20px] text-white leading-[1.5] sm:leading-[1.6] text-center font-normal">
        {title}
      </h3>
    </div>
  );
}

function LeadershipCard({
  name,
  role,
  image,
  description,
  linkedin,
}: {
  name: string;
  role: string;
  image: string;
  description?: string;
  linkedin?: string;
}) {
  return (
    <div className="flex flex-col gap-[24px] group">
      <div className="w-full h-[450px] rounded-[10px] overflow-hidden relative">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#005c89]/90 via-[#005c89]/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out delay-75 flex flex-col gap-4">
          <p className="text-white text-[16px] font-medium leading-[1.5]">
            {description || "A key leader driving innovation and excellence."}
          </p>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn profile for ${name}`}
              className="inline-flex items-center gap-2 text-white hover:text-[#66c2e2] transition-colors w-fit"
            >
              <Linkedin size={24} />
            </a>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-[9px]">
        <h3 className="text-[24px] sm:text-[28px] md:text-[30px] lg:text-[32px] text-[#232323] font-bold leading-[1.3] sm:leading-[1.4]">
          {name}
        </h3>
        <p className="text-[16px] sm:text-[18px] text-[#4a5568] leading-[1.5]">
          {role}
        </p>
      </div>
    </div>
  );
}

/* ───────── Journey letter card ───────── */
function JourneyCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      <div className="relative max-w-3xl mx-auto bg-white border border-neutral-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Date / Origin line */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 flex justify-end">

        </div>

        {/* Title */}
        <div className="px-6 sm:px-10 pt-2 pb-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#005c89] font-bold leading-tight tracking-[-1.2px]">
            Our journey
          </h2>
        </div>

        {/* Letter body */}
        <div className="px-6 sm:px-10 pt-6 pb-12 sm:pb-16 flex flex-col gap-6">
          {journeyContent.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-base sm:text-lg lg:text-xl text-[#232323] leading-[1.6] sm:leading-[1.7] text-left hyphens-auto"
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-4 sm:mt-6 text-sm sm:text-base text-[#5a5a5a] leading-relaxed">
            <p className="italic mb-2">With shared purpose,</p>
            <p className="font-bold text-[#232323] text-lg sm:text-xl">The Innovin Labs Team</p>
          </div>
        </div>

        {/* Scalloped Stamp Design */}
        <div
          className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rotate-[10deg] p-2.5 bg-white shadow-2xl transition-transform hover:scale-110 hover:rotate-[12deg] duration-300 pointer-events-none select-none"
          style={{
            WebkitMaskImage: `
              radial-gradient(12px at 12px 0, #0000 98%, #000) 50% / 24px 100%,
              radial-gradient(12px at 0 12px, #0000 98%, #000) / 100% 24px
            `,
            WebkitMaskComposite: 'destination-in',
            maskImage: `
              radial-gradient(12px at 12px 0, #0000 98%, #000) 50% / 24px 100%,
              radial-gradient(12px at 0 12px, #0000 98%, #000) / 100% 24px
            `,
            maskComposite: 'intersect',
          }}
        >
          <div className="w-full h-full overflow-hidden border border-neutral-100 rounded-sm relative">
            <Image
              src="https://res.cloudinary.com/dejb29i0k/image/upload/v1772429931/_DSC1214_cy6qaj.webp"
              alt=""
              fill
              className="object-cover sepia-[0.3] contrast-[1.1]"
              draggable={false}
              sizes="150px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Timeline section (Mission & Vision) ───────── */
function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    const line = lineRef.current;
    const mission = missionRef.current;
    const vision = visionRef.current;
    if (!section || !line || !mission || !vision) return;

    // Line grows behind the cards
    gsap.to(line, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });

    // Mission fades in
    gsap.to(mission, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: mission,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Vision fades in
    gsap.to(vision, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: vision,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === mission || st.trigger === vision) {
          st.kill(true);
        }
      });
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative max-w-3xl mx-auto py-16 sm:py-20 lg:py-24">
      {/* Center vertical line — runs behind the cards (z-0) */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] z-0">
        <div
          ref={lineRef}
          className="w-full h-full bg-[#005c89]/20"
          style={{ transformOrigin: "top center", transform: 'scaleY(0)' }}
        />
      </div>

      {/* Dot at top of line */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-[#005c89] z-10" />

      {/* Mission — center aligned, card sits on top of line */}
      <div ref={missionRef} className="relative z-10 mb-16 sm:mb-20 lg:mb-24 opacity-0 translate-y-10">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#005c89] font-semibold leading-tight tracking-[-0.8px] mb-3 sm:mb-4">
            Our mission
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-[#232323] leading-relaxed">
            {missionContent}
          </p>
        </div>
      </div>

      {/* Vision — center aligned, card sits on top of line */}
      <div ref={visionRef} className="relative z-10 opacity-0 translate-y-10">
        <div className="bg-white border border-neutral-200 rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#005c89] font-semibold leading-tight tracking-[-0.8px] mb-3 sm:mb-4">
            Our vision
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-[#232323] leading-relaxed">
            {visionContent}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Mobile timeline (no GSAP) ───────── */
function TimelineMobile() {
  return (
    <div className="relative pl-8 sm:pl-10 py-8 sm:py-12">
      {/* Vertical line */}
      <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-[2px] bg-[#005c89]/20" />

      {/* Mission */}
      <div className="relative mb-10 sm:mb-14">
        <div className="absolute -left-[calc(1.25rem+1px)] sm:-left-[calc(1.5rem+1px)] top-1 w-3 h-3 rounded-full bg-[#005c89] z-10" />
        <h3 className="text-2xl sm:text-3xl text-[#005c89] font-semibold leading-tight tracking-[-0.6px] mb-3">
          Our mission
        </h3>
        <p className="text-base sm:text-lg text-[#232323] leading-relaxed">
          {missionContent}
        </p>
      </div>

      {/* Vision */}
      <div className="relative">
        <div className="absolute -left-[calc(1.25rem+1px)] sm:-left-[calc(1.5rem+1px)] top-1 w-3 h-3 rounded-full bg-[#005c89] z-10" />
        <h3 className="text-2xl sm:text-3xl text-[#005c89] font-semibold leading-tight tracking-[-0.6px] mb-3">
          Our vision
        </h3>
        <p className="text-base sm:text-lg text-[#232323] leading-relaxed">
          {visionContent}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════  MAIN COMPONENT  ═══════════════════ */

export default function AboutUs() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  /* Refs */
  const heroRef = useRef<HTMLDivElement>(null);
  const imageSectionRef = useRef<HTMLDivElement>(null);
  const overlayLeftRef = useRef<HTMLDivElement>(null);
  const overlayRightRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLImageElement>(null);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null)
      setSelectedImageIndex(
        (selectedImageIndex - 1 + teamPhotos.length) % teamPhotos.length
      );
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null)
      setSelectedImageIndex((selectedImageIndex + 1) % teamPhotos.length);
  };

  /* ── GSAP: Hero + picture fade in ── */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const hero = heroRef.current;
    const picture = pictureRef.current;
    if (!hero || !picture) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.to(hero, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
    tl.to(picture, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.6");
  }, []);

  /* ── GSAP: Overlay expands (left/right panels shrink, revealing picture) ── */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: imageSectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: true,
        },
      });

      tl.to(overlayLeftRef.current, { width: "0%", ease: "none", duration: 1 }, 0);
      tl.to(overlayRightRef.current, { width: "0%", ease: "none", duration: 1 }, 0);
    });

    mm.add("(max-width: 767px)", () => {
      gsap.set([overlayLeftRef.current, overlayRightRef.current], { width: "0%" });
    });

    return () => mm.revert();
  }, []);

  const lastRowCount = leadershipTeam.length % 3;
  const needsCentering = lastRowCount !== 0;

  return (
    <main id="main-content" className="bg-white w-full">
      <PreloadImage href={imgHeroBackground} />

      {/* ═══════ HERO ═══════ */}
      <section className="relative w-full pt-[100px] sm:pt-[120px] lg:pt-[146px] pb-10 sm:pb-14 lg:pb-16 px-4 sm:px-6 md:px-8 xl:px-[70px] bg-white">
        <div ref={heroRef} className="max-w-[1681px] mx-auto opacity-0 translate-y-5">
          <div className="max-w-[1000px] mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#232323] font-semibold leading-tight tracking-tight mb-4 sm:mb-5 lg:mb-6">
              About us
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-[#5a5a5a] leading-relaxed max-w-[800px] mx-auto">
              Innovin Labs is more than a name — it&apos;s a reflection of how we
              turn raw ideas into purposeful products. Our identity represents the
              seamless blend of imagination and execution, where every stroke
              symbolizes collaboration and continuous evolution. It embodies our
              promise to walk alongside founders, shaping, refining, and building
              products that create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ IMAGE ═══════ */}
      <section
        ref={imageSectionRef}
        className="relative w-full bg-white py-6 sm:py-10 lg:py-14 overflow-hidden px-4 sm:px-6 md:px-8 xl:px-[70px]"
      >
        <div className="relative w-full max-w-[1681px] mx-auto">
          <Image
            ref={pictureRef}
            src={imgHeroBackground}
            alt="Innovin Labs team"
            width={1681}
            height={800}
            priority
            className="w-full h-[350px] sm:h-[450px] lg:h-[600px] xl:h-[800px] object-cover rounded-xl sm:rounded-2xl opacity-0 translate-y-5"
          />
          <div
            ref={overlayLeftRef}
            className="absolute top-0 left-0 bottom-0 bg-white z-10 hidden md:block"
            style={{ width: "25%" }}
          />
          <div
            ref={overlayRightRef}
            className="absolute top-0 right-0 bottom-0 bg-white z-10 hidden md:block"
            style={{ width: "25%" }}
          />
        </div>
      </section>

      {/* ═══════ JOURNEY, MISSION & VISION WRAPPER WITH DOTTED LINES ═══════ */}
      <div className="relative w-full px-4 sm:px-6 md:px-8 xl:px-[70px]">
        <div className="w-full max-w-[1681px] mx-auto relative">
          {/* Thick grey dashed lines at the sides, matching footer margin behavior */}
          <div
            className="absolute left-0 -top-6 sm:-top-10 lg:-top-14 bottom-0 hidden xl:block"
            style={{
              width: "2px",
              backgroundImage: "linear-gradient(to bottom, #d1d5db 65%, transparent 65%)",
              backgroundSize: "4px 40px",
              backgroundRepeat: "repeat-y",
            }}
          />
          <div
            className="absolute right-0 -top-6 sm:-top-10 lg:-top-14 bottom-0 hidden xl:block"
            style={{
              width: "2px",
              backgroundImage: "linear-gradient(to bottom, #d1d5db 65%, transparent 65%)",
              backgroundSize: "4px 40px",
              backgroundRepeat: "repeat-y",
            }}
          />

          <div className="max-w-5xl mx-auto">
            {/* ═══════ OUR JOURNEY — letter card ═══════ */}
            <section className="bg-white py-12 sm:py-16 lg:py-20 px-4">
              <JourneyCard />
            </section>

            {/* ═══════ MISSION & VISION — timeline ═══════ */}
            <section className="bg-white px-4 pb-12 sm:pb-16 lg:pb-20">
              {/* Desktop: center-line timeline with left/right cards */}
              <div className="hidden md:block">
                <TimelineSection />
              </div>
              {/* Mobile: simple vertical left-aligned timeline */}
              <div className="md:hidden">
                <TimelineMobile />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ═══════ CORE VALUES ═══════ */}
      <section className="bg-black pt-12 sm:pt-16 md:pt-20 lg:pt-[60px] pb-16 sm:pb-20 md:pb-24 lg:pb-[126px] overflow-hidden relative px-4 sm:px-6 lg:px-6 xl:px-[70px]">
        <div className="max-w-[1681px] mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.3] sm:leading-[1.4] lg:leading-[1.2] tracking-[-1.2px] mb-12 sm:mb-16 md:mb-24 lg:mb-[100px] px-4 font-semibold">
            The{" "}
            <span className="text-[#66c2e2] text-3xl sm:text-4xl lg:text-5xl font-bold">
              6 core values
            </span>{" "}
            that are embedded in our everyday work practices:
          </h2>

          {/* Desktop: 3x2 Grid */}
          <div className="hidden xl:block w-full">
            <div className="flex justify-between items-start w-full max-w-[1400px] mx-auto">
              {coreValues.slice(0, 3).map((value, index) => (
                <CoreValueCard
                  key={index}
                  icon={value.icon}
                  title={value.title}
                  delay={index * 150}
                />
              ))}
            </div>
            <div className="flex justify-between items-start w-full max-w-[1400px] mx-auto">
              {coreValues.slice(3, 6).map((value, index) => (
                <CoreValueCard
                  key={index + 3}
                  icon={value.icon}
                  title={value.title}
                  delay={(index + 3) * 150}
                />
              ))}
            </div>
          </div>

          {/* Mobile/Tablet: 2 per row */}
          <div className="xl:hidden grid grid-cols-2 gap-x-6 sm:gap-x-10 md:gap-x-16 gap-y-10 sm:gap-y-12 md:gap-y-16 max-w-[700px] mx-auto">
            {coreValues.map((value, index) => (
              <CoreValueCardMobile
                key={index}
                icon={value.icon}
                title={value.title}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LEADERSHIP TEAM ═══════ */}
      <section className="bg-white py-12 sm:py-14 md:py-16 lg:py-[60px] px-4 sm:px-6 lg:px-6 xl:px-[70px]">
        <div className="max-w-[1681px] mx-auto">
          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-[20px]">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-semibold leading-tight tracking-[-1.2px] mb-4 sm:mb-5 lg:mb-6">
              Our leadership team
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed max-w-4xl">
              Visionaries behind our promise to build world-class products
              together.
            </p>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden xl:block">
            <div className="grid grid-cols-3 gap-x-[116px] gap-y-[60px]">
              {leadershipTeam.map((leader, index) => {
                const isInLastRow =
                  index >= leadershipTeam.length - lastRowCount;
                const shouldCenter = needsCentering && isInLastRow;

                return (
                  <div
                    key={index}
                    className={shouldCenter ? "col-start-2" : ""}
                    style={
                      shouldCenter && lastRowCount === 1
                        ? { gridColumn: "2 / 3" }
                        : shouldCenter &&
                          lastRowCount === 2 &&
                          index === leadershipTeam.length - 2
                          ? {
                            gridColumn: "1 / 2",
                            transform: "translateX(calc(50% + 58px))",
                          }
                          : shouldCenter &&
                            lastRowCount === 2 &&
                            index === leadershipTeam.length - 1
                            ? {
                              gridColumn: "2 / 3",
                              transform: "translateX(calc(50% + 58px))",
                            }
                            : {}
                    }
                  >
                    <LeadershipCard
                      name={leader.name}
                      role={leader.role}
                      image={leader.image}
                      description={leader.description}
                      linkedin={leader.linkedin}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile/Tablet: 2 columns */}
          <div className="xl:hidden grid grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-8 sm:gap-y-10 md:gap-y-12 justify-items-center">
            {leadershipTeam.map((leader, index) => {
              const isLastOdd =
                leadershipTeam.length % 2 === 1 &&
                index === leadershipTeam.length - 1;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-4 sm:gap-5 md:gap-6 items-center"
                  style={
                    isLastOdd
                      ? { justifySelf: "center", gridColumn: "1 / -1" }
                      : {}
                  }
                >
                  <div className="w-[130px] sm:w-[160px] md:w-[180px] aspect-[3/4] rounded-[8px] sm:rounded-[10px] overflow-hidden relative group">
                    <Image
                      src={leader.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#005c89]/90 via-[#005c89]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                      {leader.linkedin && (
                        <a
                          href={leader.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn profile for ${leader.name}`}
                          className="text-white bg-white/20 p-2 rounded-full backdrop-blur-sm"
                        >
                          <Linkedin size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-[6px] items-center">
                    <h3 className="text-[16px] sm:text-[18px] md:text-[20px] text-[#232323] font-semibold leading-[1.3] sm:leading-[1.4] text-center">
                      {leader.name}
                    </h3>
                    <p className="text-[14px] sm:text-[16px] md:text-[18px] text-[#4a5568] font-medium leading-[1.4] sm:leading-[1.5] text-center">
                      {leader.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* ═══════ IMAGE MODAL ═══════ */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white hover:text-[#66c2e2] transition-colors z-[110] p-2"
            onClick={() => setSelectedImageIndex(null)}
            aria-label="Close modal"
          >
            <X size={40} />
          </button>
          <button
            className="absolute left-4 sm:left-10 text-white hover:text-[#66c2e2] transition-colors z-[110] p-4 bg-white/10 hover:bg-white/20 rounded-full"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M25 10 L15 20 L25 30"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="absolute right-4 sm:right-10 text-white hover:text-[#66c2e2] transition-colors z-[110] p-4 bg-white/10 hover:bg-white/20 rounded-full"
            onClick={nextImage}
            aria-label="Next image"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M15 10 L25 20 L15 30"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={teamPhotos[selectedImageIndex]}
              alt="Team Photo"
              width={1600}
              height={1200}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300 w-auto h-auto"
            />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-medium bg-black/50 px-6 py-2 rounded-full">
            {selectedImageIndex + 1} / {teamPhotos.length}
          </div>
        </div>
      )}
    </main>
  );
}
