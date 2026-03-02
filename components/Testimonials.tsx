"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { testimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/testimonials";

/* ─── helpers ─── */
function getCompanyName(t: Testimonial) {
  return t.company || t.author;
}

function getDomain(link: string) {
  try {
    return new URL(link).hostname.replace("www.", "");
  } catch {
    return link;
  }
}

/* ═══════════════════════════════════════════════════════════════
   Modal
   ═══════════════════════════════════════════════════════════════ */
function TestimonialModal({
  t,
  onClose,
}: {
  t: Testimonial;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  /* Update progress bar + time via DOM refs — zero re-renders */
  const updateProgress = () => {
    const video = videoRef.current;
    if (video) {
      const dur = video.duration || 0;
      durationRef.current = dur;
      const pct = dur > 0 ? (video.currentTime / dur) * 100 : 0;
      if (progressBarRef.current) progressBarRef.current.style.width = `${pct}%`;
      if (timeDisplayRef.current)
        timeDisplayRef.current.textContent = `${formatTime(video.currentTime)} / ${formatTime(dur)}`;
    }
    rafRef.current = requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !durationRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    video.currentTime = pct * durationRef.current;
  };

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const nav = document.getElementById("main-navigation");

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (nav) nav.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
      if (nav) nav.style.paddingRight = "0px";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start sm:items-center justify-center p-4 py-8 sm:py-12">
        <div
          className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors shadow-sm"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Media area */}
          <div className="relative rounded-t-2xl overflow-hidden bg-neutral-100 select-none">
            {/* Logo chip overlay */}
            <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md">
              <Image
                src={t.logo}
                alt={getCompanyName(t)}
                width={80}
                height={20}
                className="h-5 w-auto object-contain"
              />
            </div>

            {t.video ? (
              <div className="relative flex flex-col items-center justify-center min-h-[300px] max-h-[440px] bg-neutral-900">
                <video
                  ref={videoRef}
                  src={t.video}
                  className="h-full max-h-[400px] w-auto object-contain bg-neutral-900"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onClick={togglePlayPause}
                />
                {/* Controls bar */}
                <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center gap-2 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
                  <button
                    onClick={togglePlayPause}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-neutral-800 transition-all flex-shrink-0"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <div
                    className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden"
                    onClick={handleProgressClick}
                    role="progressbar"
                  >
                    <div
                      ref={progressBarRef}
                      className="h-full bg-white rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                  <span
                    ref={timeDisplayRef}
                    className="text-white/90 text-xs tabular-nums flex-shrink-0 min-w-[2.5rem] text-right"
                  >
                    0:00 / 0:00
                  </span>
                  <button
                    onClick={toggleMute}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-neutral-800 transition-all flex-shrink-0"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ) : t.image ? (
              <div className="relative h-[260px] sm:h-[400px] bg-neutral-900 border-b border-neutral-200">
                <Image
                  src={t.image ? cloudinaryUrl(t.image, { w: 1200, h: 800, c: "fit" }) : ""}
                  alt={getCompanyName(t)}
                  fill
                  className="object-cover opacity-95"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[260px] bg-gradient-to-br from-neutral-50 to-neutral-100">
                <Image
                  src={t.logo}
                  alt={getCompanyName(t)}
                  width={220}
                  height={110}
                  className="max-w-[220px] max-h-[110px] object-contain"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Author */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h3 className="text-xl font-bold text-blue-600">{t.author},</h3>
              {t.role && (
                <span className="text-neutral-500 text-base">
                  {t.role}
                  {t.company ? `, ${t.company}` : ""}
                </span>
              )}
            </div>

            {/* Quote */}
            <p className="mt-5 text-neutral-700 leading-relaxed text-[15px] sm:text-base">
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* About */}
            {t.description && (
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <p className="text-blue-500 text-sm font-medium mb-1.5">
                  About {getCompanyName(t)}
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {t.description}
                </p>
              </div>
            )}

            {/* Visit link */}
            {t.link && (
              <div className="mt-4">
                <a
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-500 text-sm font-medium hover:text-blue-700 hover:underline transition-colors"
                >
                  Visit {getDomain(t.link)}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Card (light theme — matches website)
   ═══════════════════════════════════════════════════════════════ */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-lg overflow-hidden h-full flex flex-col cursor-pointer group/card hover:shadow-xl hover:border-neutral-300 transition-all duration-300">
      {/* Logo chip */}
      <div className="p-5 pb-0">
        <div className="inline-flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-full px-3 py-1.5">
          <Image
            src={t.logo}
            alt={getCompanyName(t)}
            width={110}
            height={20}
            className="h-5 w-auto object-contain max-w-[110px]"
          />
        </div>
      </div>

      {/* Image area — company logo on subtle bg */}
      <div className="relative h-[180px] sm:h-auto sm:flex-1 mx-5 mt-4 rounded-xl bg-neutral-50 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover/card:scale-[1.01]">
        <Image
          src={t.image ? cloudinaryUrl(t.image, { w: 600, h: 400, c: "fill" }) : t.logo}
          alt={getCompanyName(t)}
          fill={!!t.image}
          width={!t.image ? 150 : undefined}
          height={!t.image ? 100 : undefined}
          loading="lazy"
          className={
            t.image
              ? "object-cover"
              : "object-contain opacity-80 w-[50%] max-h-[100px]"
          }
        />
        {/* Play icon hint for video cards */}
        {t.video && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/80 shadow-md flex items-center justify-center text-neutral-600 group-hover/card:scale-110 transition-transform">
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 pt-4">
        <h3 className="text-neutral-900 font-bold text-base sm:text-lg leading-snug">
          {t.author}
        </h3>
        {t.role && (
          <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
            {t.role}
            {t.company ? `, ${t.company}` : ""}
          </p>
        )}
        <p className="text-neutral-500 text-xs sm:text-sm mt-2 sm:mt-3 line-clamp-6 leading-relaxed">
          {t.quote}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Testimonials Section
   ═══════════════════════════════════════════════════════════════ */
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState<number>(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const autoplayRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const isScrolling = useRef<boolean>(false);

  const total = testimonials.length;
  const transitionMs = 600;

  /* ── lifecycle ── */
  useEffect(() => {
    setMounted(true);
    const update = () => setIsDesktop(window.innerWidth >= 1280);
    update();
    const onResize = () => requestAnimationFrame(update);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── carousel helpers ── */
  const normalize = (i: number): number => {
    let idx = i % total;
    if (idx < 0) idx += total;
    return idx;
  };

  const getPosition = (cardIndex: number): number => {
    let diff = cardIndex - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  /* ── autoplay ── */
  function startAutoplay() {
    stopAutoplay();
    autoplayRef.current = window.setInterval(() => {
      if (isScrolling.current) return;
      setCurrentIndex((prev) => normalize(prev + 1));
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }

  useEffect(() => {
    if (modalIndex !== null) {
      stopAutoplay();
      return;
    }
    startAutoplay();
    return stopAutoplay;
  }, [currentIndex, isDesktop, modalIndex]);

  /* ── modal: escape to close (with body scroll lock) ── */
  useEffect(() => {
    if (modalIndex === null) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [modalIndex]);

  /* ── modal handlers ── */
  const openModal = (index: number) => {
    setModalIndex(index);
    stopAutoplay();
  };

  const closeModal = () => {
    setModalIndex(null);
    startAutoplay();
  };

  /* ── scroll helpers ── */
  const scrollToCard = (index: number, smooth = true) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector(
      `[data-index="${index}"]`
    ) as HTMLElement | null;
    if (!card) return;
    isScrolling.current = true;
    const containerWidth = container.offsetWidth;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const scrollLeft = cardLeft - (containerWidth - cardWidth) / 2;
    container.scrollTo({
      left: scrollLeft,
      behavior: smooth ? "smooth" : "auto",
    });
    window.setTimeout(() => {
      isScrolling.current = false;
    }, smooth ? 600 : 0);
  };

  useEffect(() => {
    if (!isDesktop && scrollContainerRef.current && mounted) {
      scrollToCard(currentIndex, true);
    }
  }, [currentIndex, isDesktop, mounted]);

  const snapToCard = (target: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const normalizedTarget = normalize(target);
    setCurrentIndex(normalizedTarget);
    if (!isDesktop && scrollContainerRef.current) {
      scrollToCard(normalizedTarget);
    }
    window.setTimeout(() => setIsAnimating(false), transitionMs);
  };

  /* ── click handlers ── */
  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      openModal(index);
      return;
    }
    snapToCard(index);
    stopAutoplay();
    startAutoplay();
  };

  const handleMobileCardClick = (index: number) => {
    if (index === currentIndex) {
      openModal(index);
    }
  };

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modalIndex !== null) return;
      if (e.key === "ArrowRight") {
        snapToCard(currentIndex + 1);
        stopAutoplay();
        startAutoplay();
      }
      if (e.key === "ArrowLeft") {
        snapToCard(currentIndex - 1);
        stopAutoplay();
        startAutoplay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, isAnimating, modalIndex]);

  /* ── mobile scroll detection ── */
  useEffect(() => {
    if (isDesktop || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    let scrollTimeout: number | null = null;

    const handleScroll = () => {
      if (isScrolling.current) return;
      stopAutoplay();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const innerFlex = container.children[0] as HTMLElement;
        const firstCard = innerFlex.querySelector(
          '[data-index="0"]'
        ) as HTMLElement | null;
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth;
        const gap = window.innerWidth >= 640 ? 24 : 16;
        const card0Left = firstCard.offsetLeft;
        const centerOffset = (containerWidth - cardWidth) / 2;
        const zeroScroll = card0Left - centerOffset;
        const calculatedIndex = Math.round(
          (scrollLeft - zeroScroll) / (cardWidth + gap)
        );
        const newIndex = Math.max(0, Math.min(calculatedIndex, total - 1));
        if (newIndex !== currentIndex) setCurrentIndex(newIndex);
        startAutoplay();
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isDesktop, currentIndex]);

  /* ── touch swipe (mobile) ── */
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isDesktop) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = null;
      isDragging.current = false;
      stopAutoplay();
    };
    const onTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
      if (
        touchStartX.current !== null &&
        touchEndX.current !== null &&
        Math.abs(touchEndX.current - touchStartX.current) > 10
      )
        isDragging.current = true;
    };
    const onTouchEnd = () => {
      touchStartX.current = touchEndX.current = null;
      isDragging.current = false;
      startAutoplay();
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, isDesktop]);

  /* ── desktop card positioning (larger cards: 700×460) ── */
  function cardStyleForDesktop(
    position: number
  ): CSSProperties & { zIndex: number; opacity: number } {
    const abs = Math.abs(position);
    const baseTranslate = position * 380;
    if (abs === 0) {
      return {
        transform: `translateX(${baseTranslate}px) scale(1)`,
        filter: "blur(0px)",
        opacity: 1,
        zIndex: 50,
        pointerEvents: "auto" as const,
      };
    } else if (abs === 1) {
      return {
        transform: `translateX(${baseTranslate}px) scale(0.92)`,
        filter: "blur(4px)",
        opacity: 1,
        zIndex: 40,
        pointerEvents: "auto" as const,
      };
    } else {
      const off = position > 0 ? 900 : -900;
      return {
        transform: `translateX(${off}px) scale(0.72)`,
        filter: "blur(10px)",
        opacity: 0,
        zIndex: 10,
        pointerEvents: "none" as const,
      };
    }
  }

  const isActiveIndicator = (i: number) =>
    normalize(i) === normalize(currentIndex);

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <>
      <section className="testimonials-section bg-white w-full flex flex-col items-center justify-start py-8 sm:py-10 lg:py-14 overflow-hidden relative">
        {/* decorative blobs */}
        <div className="absolute left-[-400px] top-[100px] w-[800px] h-[400px] opacity-20 mix-blend-multiply pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-blue-400/10 to-transparent blur-2xl" />
        </div>
        <div className="absolute right-[-400px] bottom-[100px] w-[800px] h-[400px] opacity-15 mix-blend-multiply pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/15 via-cyan-400/8 to-transparent blur-2xl" />
        </div>

        <div className="max-w-[1681px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-[70px] w-full relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-black font-semibold leading-tight text-center tracking-[-1.2px] mb-4 sm:mb-5 lg:mb-6">
            Trusted by companies
          </h2>

          {/* ─── Mobile / Tablet ─── */}
          {!mounted || !isDesktop ? (
            <div className="w-full">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-4 sm:gap-6 px-[7%] sm:px-[15%] md:px-[20%] pb-2">
                  {testimonials.map((t, idx) => (
                    <div
                      key={idx}
                      data-index={idx}
                      className="snap-center shrink-0 w-[86%] sm:w-[70%] md:w-[60%] h-[460px] sm:h-[480px] transition-opacity duration-500 cursor-pointer"
                      style={{ opacity: currentIndex === idx ? 1 : 0.7 }}
                      onClick={() => handleMobileCardClick(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleMobileCardClick(idx);
                      }}
                    >
                      <TestimonialCard t={t} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ─── Desktop Carousel ─── */
            <div
              className="relative w-full h-[460px] flex items-center justify-center overflow-visible px-4"
              ref={containerRef}
              onMouseEnter={() => stopAutoplay()}
              onMouseLeave={() => {
                if (modalIndex === null) startAutoplay();
              }}
            >
              <div className="relative w-full max-w-[2200px] h-full flex items-center justify-center">
                {testimonials.map((t, idx) => {
                  const pos = getPosition(idx);
                  const style = cardStyleForDesktop(pos);

                  return (
                    <div
                      key={idx}
                      role="button"
                      aria-label={`testimonial ${idx + 1} - click to expand`}
                      tabIndex={0}
                      onClick={() => handleCardClick(idx)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleCardClick(idx);
                      }}
                      className="testimonial-card absolute top-1/2 left-1/2 cursor-pointer"
                      style={{
                        width: 700,
                        height: 460,
                        marginLeft: -350,
                        marginTop: -230,
                        transformOrigin: "center center",
                        transition: `transform ${transitionMs}ms cubic-bezier(.33,1,.68,1), filter ${transitionMs}ms cubic-bezier(.33,1,.68,1), opacity ${transitionMs}ms cubic-bezier(.33,1,.68,1)`,
                        ...style,
                      }}
                    >
                      <TestimonialCard t={t} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  snapToCard(i);
                  stopAutoplay();
                  startAutoplay();
                }}
                className={`h-2 rounded-full transition-all duration-300 ${isActiveIndicator(i)
                  ? "bg-black w-8 sm:w-10"
                  : "bg-neutral-300 w-2"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Modal (outside section to avoid overflow clipping) ─── */}
      {modalIndex !== null && (
        <TestimonialModal
          t={testimonials[modalIndex]}
          onClose={closeModal}
        />
      )}
    </>
  );
}
