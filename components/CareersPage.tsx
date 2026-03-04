"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import JobCard from "./JobCard";

import { TEAM_IMAGE_BASE, cloudinaryUrl } from "@/lib/cloudinary";
import { PreloadImage } from "./PreloadImage";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Image assets
const iconCheck = "/images/21d929d3882a56f4a14a488dee787d233888e288.svg";
const life = "/images/compressed_2a10271a41c28441412779781963630458378940.webp";

// Reason cards: optimized for caching and fast paint
const img1 = cloudinaryUrl("v1770654380/IMG_0552_gshpuk.heic", { w: 800, h: 600, c: "fill" });
const img2 = cloudinaryUrl("v1770654372/IMG_0484_kofvre.jpg", { w: 800, h: 600, c: "fill" });
const img3 = cloudinaryUrl("v1770654369/IMG_4983_vmhgas.jpg", { w: 800, h: 600, c: "fill" });

const careers1 = "https://res.cloudinary.com/dejb29i0k/image/upload/v1772440167/careers1_u6prsi.webp"
const careers2 = "https://res.cloudinary.com/dejb29i0k/image/upload/v1772440166/careers2_jlp4k1.webp"
const careers3 = "/images/careers3.webp"

// Preload first visible images so they don’t pop in 1–2s later
const PRELOAD_REASON_IMAGE = img1;
const PRELOAD_TEAM_IMAGE = cloudinaryUrl(`${TEAM_IMAGE_BASE}/akshay_ydanyj.png`, { w: 200, h: 200, c: "fill" });



interface GalleryImage {
  path: string;
  alt: string;
  rotate: number;
}

const DraggablePhoto = ({ image, index, openLightbox }: { image: GalleryImage; index: number; openLightbox: (index: number) => void }) => {
  const isDragging = useRef(false);
  const [isDraggable, setIsDraggable] = useState(false);

  useEffect(() => {
    const checkDraggable = () => setIsDraggable(window.innerWidth >= 1024);
    checkDraggable();
    window.addEventListener('resize', checkDraggable);
    return () => window.removeEventListener('resize', checkDraggable);
  }, []);

  return (
    <motion.div
      className="break-inside-avoid mb-12 lg:cursor-grab lg:active:cursor-grabbing group relative"
      style={{ rotate: image.rotate }}
      drag={isDraggable}
      dragMomentum={false}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      onDragStart={() => {
        isDragging.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDragging.current = false;
        }, 150);
      }}
      onClick={(e) => {
        // If we were dragging, prevent the click
        if (isDragging.current) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        openLightbox(index);
      }}
    >
      <div className="relative overflow-hidden rounded-[12px] sm:rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] transition-shadow duration-300">
        <Image
          src={image.path.startsWith('http') ? image.path : cloudinaryUrl(image.path, { w: 600 })}
          alt={image.alt}
          width={600}
          height={800} // Placeholder height for Next.js, h-auto will override
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none rounded-[12px] sm:rounded-[16px]"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>
    </motion.div>
  );
};

interface Job {
  _id: string;
  title: string;
  heading?: string;
  slug: string;
  location?: string;
  employmentType?: string;
}

interface CareersPageProps {
  jobs: Job[];
}

export default function CareersPage({ jobs }: CareersPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentReasonIndex, setCurrentReasonIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const reasonToChooseRef = useRef<HTMLDivElement>(null);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const starLeftRef = useRef<HTMLDivElement>(null);
  const starRightRef = useRef<HTMLDivElement>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null); // NEW: Track active timeline
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null); // NEW: Track autoplay timer
  const backCardRef = useRef<HTMLDivElement>(null);

  // Gallery: path only; thumb 800×600, lightbox 1600×1200 at render
  const galleryImages = [
    { path: "v1772429931/_DSC1389_ic37xh.webp", alt: "Team event 1", rotate: -3 },
    { path: "v1772429931/_DSC1214_cy6qaj.webp", alt: "Team event 2", rotate: 2 },
    { path: "v1772429931/_DSC1299_j2tmsh.webp", alt: "Team event 3", rotate: -1.5 },
    { path: "v1772429920/_DSC0717_yswj7i.webp", alt: "Team event 4", rotate: 3 },
    { path: "v1772429920/_DSC0756_f8ja1h.webp", alt: "Team event 5", rotate: 1.5 },
    { path: "v1772429920/_DSC1046_xdohub.webp", alt: "Team event 6", rotate: -2.5 },
    { path: "v1772429920/_DSC0828_x7nex0.webp", alt: "Team event 7", rotate: 2 },
    { path: "v1772429920/_DSC0913_plsy10.webp", alt: "Team event 8", rotate: -1 },
    { path: "v1772429919/_DSC0548_hkqppn.webp", alt: "Team event 9", rotate: 1 },
    { path: "v1772429919/_DSC0707_yxsvbq.webp", alt: "Team event 10", rotate: -3.5 },
    { path: "v1772429919/_DSC0710_sze707.webp", alt: "Team event 12", rotate: -1.5 },
    { path: "v1772440168/af0d73906f117e3a32a5cb2964335364aff6973e_zkltrc.jpg", alt: "Team event 13", rotate: 2 },
    { path: "v1772440167/careers1_u6prsi.webp", alt: "Team event 14", rotate: -1.5 },
    { path: "v1772440166/573ac6c833b631241442f52f9339c8f43a7bcb76_dirdfx.jpg", alt: "Team event 15", rotate: -2.5 },
    { path: "v1772440166/careers2_jlp4k1.webp", alt: "Team event 16", rotate: 1 },
    { path: "v1770654379/IMG_3420_wt9qlf.jpg", alt: "Team event 17", rotate: -3.5 },
    { path: "v1770654371/IMG_2189_crwvtj.heic", alt: "Team event 19", rotate: -1.5 },
  ];

  const images = [careers1, careers2, careers3];
  const reasonsToChoose = [
    {
      title: "Education",
      description: "We offer you the opportunity to elevate your expertise and stay ahead in the tech-driven landscape.",
      image: img1,
    },
    {
      title: "Experience",
      description: "Embark on a transformative journey with us, gaining valuable experience in diverse areas for personal and professional growth.",
      image: img2,
    },
    {
      title: "Exposure",
      description: "Gain unparalleled exposure to diverse fields and cutting-edge technologies as you collaborate with us.",
      image: img3,
    },
  ];

  // FIXED: Update Reasons to Choose Us with proper animation management
  useEffect(() => {
    const container = reasonToChooseRef.current;
    if (!container || isTransitioning) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>(".reason-item"));
    if (!items.length) return;

    // Kill any existing timeline
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }

    // Set transition lock
    setIsTransitioning(true);

    // Create a fresh timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
        activeTimelineRef.current = null;
      }
    });

    activeTimelineRef.current = tl;

    // Find outgoing items (all except current)
    const outgoingItems = items.filter((_, index) => index !== currentReasonIndex);
    const incomingItem = items[currentReasonIndex];

    // First: fade out and slide out all outgoing items
    if (outgoingItems.length > 0) {
      tl.to(outgoingItems, {
        opacity: 0,
        x: -100,
        duration: 0.5,
        ease: "power2.in",
      });
    }

    // Then: fade in and slide in the new item
    if (incomingItem) {
      // Set initial state for incoming item
      gsap.set(incomingItem, { opacity: 0, x: 100 });

      // Add to timeline - starts after previous animation ends
      tl.to(incomingItem, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [currentReasonIndex]);

  // FIXED: Auto-rotate with proper cleanup and reset
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only auto-rotate on desktop (xl breakpoint and above)
    const isDesktop = window.innerWidth >= 1280;
    if (!isDesktop) return;

    // Clear any existing timer
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    // Set new timer
    autoplayTimerRef.current = setInterval(() => {
      // Only advance if not currently transitioning
      if (!isTransitioning) {
        setCurrentReasonIndex((prev) => (prev + 1) % reasonsToChoose.length);
      }
    }, 5000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [reasonsToChoose.length, isTransitioning]);

  // Scroll animation for front card items - responsive
  useLayoutEffect(() => {
    const frontCard = frontCardRef.current;
    const backCard = backCardRef.current;
    if (!frontCard || typeof window === 'undefined') return;

    const items = Array.from(frontCard.querySelectorAll<HTMLElement>(".talent-item"));
    if (!items.length) return;

    // Set initial states
    gsap.set(items, { opacity: 0, x: -60 });
    gsap.set([frontCard, backCard], { opacity: 0, y: 40 });

    const leftStar = starLeftRef.current;
    const rightStar = starRightRef.current;
    if (leftStar && rightStar) {
      gsap.set([leftStar, rightStar], { scale: 0, opacity: 0 });
    }

    // Create scroll trigger animation - earlier start position
    const isMobile = window.innerWidth < 768;
    const startPosition = isMobile ? "top 95%" : "top 90%";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: frontCard,
        start: startPosition,
        toggleActions: "play none none none",
        once: true,
        invalidateOnRefresh: true,
      },
    });

    // 1. Stars and Cards (Stacks) zoom/fade in
    if (leftStar && rightStar) {
      tl.to([leftStar, rightStar], {
        scale: 1,
        opacity: 0.3,
        duration: 1.2,
        ease: "elastic.out(1, 0.6)", // Bounce effect
        stagger: 0.2
      }, 0);
    }

    tl.to([frontCard, backCard], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }, 0.2);

    // 2. Stagger in the talent items simultaneously with card fade-in
    tl.to(items, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.15,
    }, 0.2);

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  // FIXED: Handle reason click with transition lock and timer reset
  const handleReasonClick = (index: number) => {
    if (isTransitioning || index === currentReasonIndex) return;

    // Clear and restart autoplay timer
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    setCurrentReasonIndex(index);

    // Restart autoplay after manual selection
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      autoplayTimerRef.current = setInterval(() => {
        if (!isTransitioning) {
          setCurrentReasonIndex((prev) => (prev + 1) % reasonsToChoose.length);
        }
      }, 5000);
    }
  };

  const handleNextReason = () => {
    if (isTransitioning) return;

    // Clear and restart timer
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);

    setCurrentReasonIndex((prev) => (prev + 1) % reasonsToChoose.length);

    // Restart timer
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      autoplayTimerRef.current = setInterval(() => {
        if (!isTransitioning) {
          setCurrentReasonIndex((prev) => (prev + 1) % reasonsToChoose.length);
        }
      }, 5000);
    }
  };

  const handlePrevReason = () => {
    if (isTransitioning) return;

    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);

    setCurrentReasonIndex((prev) => (prev - 1 + reasonsToChoose.length) % reasonsToChoose.length);

    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      autoplayTimerRef.current = setInterval(() => {
        if (!isTransitioning) {
          setCurrentReasonIndex((prev) => (prev + 1) % reasonsToChoose.length);
        }
      }, 5000);
    }
  };

  const jobOpenings = jobs.map((job) => ({
    id: job._id,
    title: job.title,
    slug: job.slug,
    description: job.heading || `Join us as a ${job.title}. We're looking for talented individuals to join our team.`,
    location: job.location,
    employmentType: job.employmentType,
  }));

  const talentApproach = [
    {
      title: "Small Teams, Big Impact",
      description: "Work in tight-knit pods where your contributions genuinely move the product forward.",
    },
    {
      title: "Honest, Continuous Feedback",
      description: "Grow faster through transparent conversations and clear, constructive guidance.",
    },
    {
      title: "Mindful Workload Culture",
      description: "Stay productive without burnout through balanced, thoughtful planning.",
    },
    {
      title: "Celebrate Every Milestone",
      description: "Ring achievements, track wins, and celebrate progress together—big or small.",
    },
    {
      title: "A Community That Cares",
      description: "Join a supportive team that values people as much as the products they build.",
    },
  ];

  // Team member polaroid images
  const teamPhotos = [
    // Left side
    { name: "Akshay", img: `${TEAM_IMAGE_BASE}/akshay_ydanyj.png`, style: { top: "5%", left: "3%" }, rotate: "-8deg" },
    { name: "Ashwanth", img: `${TEAM_IMAGE_BASE}/ashwanth_uam0je.png`, style: { top: "15%", left: "14%" }, rotate: "10deg" },
    { name: "Ananth", img: `${TEAM_IMAGE_BASE}/ananth_wicnv5.png`, style: { top: "32%", left: "4%" }, rotate: "-5deg" },
    { name: "Rajath", img: `${TEAM_IMAGE_BASE}/rajath_mmlovq.png`, style: { top: "52%", left: "2%" }, rotate: "-10deg" },
    // Bottom left
    { name: "Alias", img: `${TEAM_IMAGE_BASE}/alias_ajo9j2.png`, style: { bottom: "8%", left: "10%" }, rotate: "6deg" },
    { name: "Amit", img: `${TEAM_IMAGE_BASE}/amit_zwqnfl.png`, style: { bottom: "5%", left: "22%" }, rotate: "-4deg" },
    // Bottom center
    { name: "Rishikesh", img: `https://res.cloudinary.com/dejb29i0k/image/upload/v1771237410/DOC-20260216-WA0004_2__kbchzo.png`, style: { bottom: "12%", left: "35%" }, rotate: "3deg" },
    { name: "Sayooj", img: `${TEAM_IMAGE_BASE}/sayooj_ynbezz.png`, style: { bottom: "5%", left: "47%" }, rotate: "-5deg" },
    { name: "Dias", img: `${TEAM_IMAGE_BASE}/dias_otwvqu.png`, style: { bottom: "8%", right: "35%" }, rotate: "7deg" },
    // Bottom right
    { name: "Hinan", img: `${TEAM_IMAGE_BASE}/hinan_fjy71v.png`, style: { bottom: "5%", right: "22%" }, rotate: "-2deg" },
    { name: "Niranjan", img: `${TEAM_IMAGE_BASE}/niranjan_vetpkx.png`, style: { bottom: "10%", right: "8%" }, rotate: "5deg" },
    // Right side
    { name: "Arjun", img: `${TEAM_IMAGE_BASE}/arjun_icynux.png`, style: { top: "5%", right: "14%" }, rotate: "-6deg" },
    { name: "Gautham", img: `${TEAM_IMAGE_BASE}/gautham_sj5wbz.png`, style: { top: "8%", right: "2%" }, rotate: "8deg" },
    { name: "Niranjana", img: `${TEAM_IMAGE_BASE}/niranjana_aszqzx.png`, style: { top: "28%", right: "10%" }, rotate: "5deg" },
    { name: "Vishnu", img: `${TEAM_IMAGE_BASE}/vishnu_w5qv17.png`, style: { top: "32%", right: "0%" }, rotate: "10deg" },
    { name: "Aswin", img: `${TEAM_IMAGE_BASE}/aswin_lvyolg.png`, style: { top: "52%", right: "3%" }, rotate: "6deg" },
  ];

  return (
    <main id="main-content" className="bg-white w-full pt-[100px] sm:pt-[120px] lg:pt-[146px] pb-[50px] sm:pb-[70px] lg:pb-[90px] px-4 sm:px-6 md:px-8 xl:px-[70px]">
      <PreloadImage href={PRELOAD_REASON_IMAGE} />
      <PreloadImage href={PRELOAD_TEAM_IMAGE} />
      <div className="max-w-[1681px] mx-auto">
        {/* Hero Section with CSS Dotted Background */}
        <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] xl:min-h-[600px] mb-[40px] sm:mb-[60px] xl:mb-[80px] hero-dotted-bg">

          {/* Polaroid Team Photos - Desktop Only */}
          <div className="hidden lg:block">
            {teamPhotos.map((member, idx) => (
              <div
                key={idx}
                className="absolute z-10"
                style={{
                  ...member.style,
                  transform: `rotate(${member.rotate})`,
                }}
              >
                <div className="bg-white p-2 pb-6 rounded-md shadow-lg" style={{ width: '100px' }}>
                  <div className="w-full aspect-square overflow-hidden rounded-sm bg-gray-200">
                    <Image
                      src={cloudinaryUrl(member.img, { w: 200, h: 200, c: "fill" })}
                      alt=""
                      width={100}
                      height={100}
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        // Fallback to placeholder
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${member.name}&size=200&background=f3f4f6&color=374151`;
                      }}
                    />
                  </div>
                  <p className="text-center mt-2 text-gray-700 text-sm" style={{ fontFamily: "'Caveat', cursive" }}>
                    {member.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 sm:px-12 md:px-20 lg:px-32 z-20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-[#232323] font-semibold leading-tight mb-4 sm:mb-5 lg:mb-6">
              Ignite your <span className="text-[#005c89]">career with us</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-[#5a5a5a] leading-relaxed max-w-[700px]">
              Join a team of product champions powering innovation at global scale.
            </p>
          </div>
        </div>



        {/* Reason to Choose Us */}
        <div className="mb-[40px] sm:mb-[60px] lg:mb-[80px]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#232323] font-semibold leading-tight mb-6 sm:mb-8 lg:mb-10 tracking-[-1.2px]">
            Reason to choose us
          </h2>

          {/* Desktop: Horizontal carousel with dot indicators */}
          <div className="hidden xl:block">
            <div ref={reasonToChooseRef} className="relative h-[347px] overflow-hidden">
              {reasonsToChoose.map((reason, index) => (
                <div
                  key={index}
                  className="reason-item absolute inset-0 flex gap-[74px] items-center"
                  style={{ opacity: 0 }}
                >
                  <div className="w-[450px] h-[347px] rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={reason.image}
                      alt=""
                      width={450}
                      height={347}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : undefined}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[40px] text-black font-semibold leading-[60px] mb-[10px]">
                      {reason.title}
                    </h3>
                    <p className="text-[20px] text-black leading-[44px]">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation and Indicators */}
            <div className="flex items-center justify-center gap-8 mt-6">
              {/* Prev Button */}
              <button
                onClick={handlePrevReason}
                disabled={isTransitioning}
                aria-label="Previous reason"
                className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="flex justify-center gap-3">
                {reasonsToChoose.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleReasonClick(index)}
                    disabled={isTransitioning}
                    className={`h-2 rounded-full transition-all ${index === currentReasonIndex ? 'bg-black w-10' : 'bg-neutral-300 w-2'
                      } ${isTransitioning ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-neutral-400'}`}
                    aria-label={`Go to ${reasonsToChoose[index].title}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextReason}
                disabled={isTransitioning}
                aria-label="Next reason"
                className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet: Vertical stacked cards */}
          <div className="xl:hidden flex flex-col gap-6 sm:gap-8">
            {reasonsToChoose.map((reason, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm"
              >
                <div className="w-full sm:w-[200px] md:w-[300px] h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={reason.image}
                    alt=""
                    width={300}
                    height={300}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : undefined}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[24px] sm:text-[28px] md:text-[32px] text-black font-semibold leading-[1.2] mb-2 sm:mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-[16px] sm:text-[18px] md:text-[20px] text-black leading-[1.6] sm:leading-[1.8]">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Approach Section — content-sized on mobile/tablet, fixed height on xl desktop */}
        <div className="relative min-h-0 md:min-h-0 xl:min-h-[1214px] xl:h-[1214px] pb-10 sm:pb-12 lg:pb-16">
          {/* Star decorations */}
          <div ref={starLeftRef} className="hidden xl:block absolute left-1/2 -ml-[580px] top-[300px] w-[100px] h-[100px] opacity-30">
            <svg viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#FFD700" />
            </svg>
          </div>
          <div ref={starRightRef} className="hidden xl:block absolute left-1/2 ml-[480px] bottom-[100px] w-[100px] h-[100px] opacity-30">
            <svg viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#FFD700" />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#232323] font-semibold leading-tight mb-4 sm:mb-5 lg:mb-6 tracking-[-1.2px]">
              Talent approach
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed max-w-full lg:max-w-[1472px]">
              We nurture diverse talent by empowering individuals, encouraging creativity, and valuing every contribution. Through small, focused teams, honest feedback, and a supportive culture, we promote growth, recognize achievements, and maintain healthy workloads—creating an environment where collaboration and talent thrive.
            </p>
          </div>

          <div className="relative mt-6 sm:mt-8 md:mt-10 xl:mt-0 xl:absolute xl:left-1/2 xl:top-[234px] xl:-translate-x-1/2 w-full xl:w-[890px] mx-auto">
            {/* Back card */}
            <div ref={backCardRef} className="hidden xl:block absolute top-0 left-0 right-0 flex items-center justify-center z-10">
              <div className="bg-white rounded-[20px] shadow-[0px_0px_9px_0px_rgba(0,0,0,0.25)] w-[834px] h-[834px]" style={{ transform: 'rotate(4deg)' }}>
              </div>
            </div>

            {/* Front card */}
            <div className="relative xl:absolute xl:top-0 xl:-left-[20px] xl:right-0 flex items-center justify-center z-20">
              <div
                ref={frontCardRef}
                className="bg-white rounded-[20px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)] w-full max-w-[834px] h-auto xl:w-[834px] xl:h-[834px] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-[74px] front-card-rotate"
              >
                <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 xl:gap-[30px]">
                  {talentApproach.map((item, index) => (
                    <div key={index} className="talent-item flex gap-4 sm:gap-5 md:gap-6 xl:gap-[44px] items-center">
                      <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] lg:w-[94px] lg:h-[94px] shrink-0 flex items-center justify-center bg-primary/10 rounded-full">
                        <svg className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] lg:w-[50px] lg:h-[50px]" viewBox="0 0 50 50" fill="#005c89">
                          <path d="M25 5 L30 20 L45 25 L30 30 L25 45 L20 30 L5 25 L20 20 Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] text-black font-medium leading-[1.3] sm:leading-[1.4] lg:leading-[34px] mb-1 sm:mb-2 lg:mb-[6px]">
                          {item.title}
                        </h3>
                        <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-black leading-[1.5] sm:leading-[1.6] lg:leading-[34px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience life inside our home */}
        <div className="mb-8 sm:mb-12 lg:mb-[69px]">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#232323] font-semibold leading-tight mb-4 sm:mb-5 lg:mb-6 tracking-[-1.2px]">
            Experience life inside our home
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed">
            A place where smart people collaborate, celebrate wins, and support one another. Happiness and well-being aren't perks they're part of how we work.
          </p>
        </div>

        {/* Masonry Photo Gallery */}
        <div className="mb-[50px] sm:mb-[70px] xl:mb-[100px]">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-10">
            {galleryImages.map((image, index) => (
              <DraggablePhoto
                key={index}
                image={image}
                index={index}
                openLightbox={openLightbox}
              />
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-gray-300 transition z-50"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-4 transition z-50"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Image */}
            <div
              className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={cloudinaryUrl(galleryImages[lightboxIndex].path, { w: 1600, h: 1200, c: "fit" })}
                alt={galleryImages[lightboxIndex].alt}
                width={1600}
                height={1200}
                className="max-w-full max-h-[85vh] object-contain rounded-lg w-auto h-auto"
              />
            </div>

            {/* Next button */}
            <button
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-4 transition z-50"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white text-sm sm:text-base">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>
        )}

        {/* Recent Job Openings */}
        <div id="recent-job-openings">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] xl:text-[40px] text-black font-semibold leading-[1.3] sm:leading-[1.4] xl:leading-[60px] mb-6 sm:mb-8 lg:mb-10 tracking-[-1.2px]">
            <span className="font-normal">Recent</span> job openings
          </h2>

          {jobOpenings.length > 0 ? (
            <div className="flex flex-col gap-6 sm:gap-8 xl:gap-8">
              {/* Desktop: Grid layout — 4 cols when 4+ jobs, 3 cols otherwise */}
              <div className={`hidden xl:grid gap-6 xl:gap-8 ${jobOpenings.length >= 4 ? "grid-cols-4" : "grid-cols-3"
                }`}>
                {(jobOpenings.length >= 4 ? jobOpenings.slice(0, 4) : jobOpenings).map((job) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    variant={jobOpenings.length >= 4 ? "compact" : "default"}
                  />
                ))}
              </div>

              {/* Mobile/Tablet: Vertical stacked cards */}
              <div className="xl:hidden flex flex-col gap-4 sm:gap-5">
                {jobOpenings.map((job) => (
                  <JobCard key={job.id} {...job} variant="compact" />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <p className="text-[18px] sm:text-[20px] lg:text-[24px] text-gray-500">No job openings at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}