"use client";

import { useLayoutEffect, useRef } from "react";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { PreloadImage } from "./PreloadImage";
import Image from "next/image";

// Card container up to 1100×700 — resize at fetch
// Card container — using 800px width for initial load to speed up page paint. 
// Cloudinary handles the resize.
const img1 = cloudinaryUrl("v1770654379/20260209_160659.jpg_cbpvzb.jpg", { w: 800, h: 512, c: "fill" });
const img2 = cloudinaryUrl("v1770654378/20260209_160612.jpg_gc3qk1.jpg", { w: 800, h: 512, c: "fill" });
const img3 = cloudinaryUrl("v1770654373/20260209_160751.jpg_ceunj0.jpg", { w: 800, h: 512, c: "fill" });

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileSectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const cardImagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const cardOverlaysRef = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTitleOurRef = useRef<HTMLDivElement>(null);
  const desktopTitleServicesRef = useRef<HTMLDivElement>(null);
  const desktopSubtitleRef = useRef<HTMLParagraphElement>(null);

  const mobileTitleOurRef = useRef<HTMLDivElement>(null);
  const mobileTitleServicesRef = useRef<HTMLDivElement>(null);
  const mobileSubtitleRef = useRef<HTMLParagraphElement>(null);

  const mobileCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const services = [
    { title: "Smart Product Development", description: "We're not just software consultants – we're your Trusted Tech Innovation Partner and efficiency architects.", image: img1 },
    { title: "Strategic Technology Consulting", description: "We're not just software consultants – we're your Trusted Tech Innovation Partner and efficiency architects.", image: img2 },
    { title: "Strategic AI Consulting", description: "We empower you with intelligent solutions, leveraging AI tools to solve specific business problems and achieve strategic goals.", image: img3 },
  ];

  function splitText(element: HTMLElement | null): NodeListOf<HTMLElement> | [] {
    if (!element) return [] as unknown as NodeListOf<HTMLElement>;
    const text = element.innerText;
    element.innerHTML = text
      .split("")
      .map((l: string) => `<span class='letter inline-block'>${l}</span>`)
      .join("");
    return element.querySelectorAll(".letter");
  }

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    let isComponentMounted = true;

    const isDesktop = window.innerWidth >= 1430;
    const section = isDesktop ? sectionRef.current : mobileSectionRef.current;

    // Safety check
    if (!section) return;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]).then(([{ gsap }, { ScrollTrigger }]) => {
      // Check if component is still mounted after async imports
      if (!isComponentMounted) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      // Clean up existing triggers
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === section || trigger.trigger === section) {
          trigger.kill();
        }
      });

      const allElements = [
        ...cardsRef.current.filter(Boolean),
        ...cardImagesRef.current.filter(Boolean),
        ...cardOverlaysRef.current.filter(Boolean),
        ...mobileCardsRef.current.filter(Boolean),
        desktopTitleOurRef.current,
        desktopTitleServicesRef.current,
        desktopSubtitleRef.current,
        mobileTitleOurRef.current,
        mobileTitleServicesRef.current,
        mobileSubtitleRef.current,
      ];
      gsap.set(allElements, { clearProps: "all" });

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          if (section) {
            void section.offsetHeight;
          }

          if (isDesktop) {
            const ourH2 = desktopTitleOurRef.current?.querySelector("h2");
            const servicesH2 = desktopTitleServicesRef.current?.querySelector("h2");
            const subtitle = desktopSubtitleRef.current;
            const cards = cardsRef.current.filter(Boolean) as HTMLAnchorElement[];
            const cardImages = cardImagesRef.current.filter(Boolean) as HTMLImageElement[];
            const cardOverlays = cardOverlaysRef.current.filter(Boolean) as HTMLDivElement[];

            if (!ourH2 || !servicesH2 || !subtitle || cards.length < 3) return;

            const ourLetters = splitText(ourH2);
            const servicesLetters = splitText(servicesH2);

            // Initial states
            gsap.set([...ourLetters, ...servicesLetters], {
              y: 80,
              opacity: 0,
              force3D: true
            });
            gsap.set(subtitle, {
              opacity: 0,
              force3D: true
            });

            // Card 1: Visible and centered
            gsap.set(cards[0], {
              y: "-50%",
              scale: 1,
              opacity: 1,
              force3D: true
            });
            gsap.set(cardImages[0], {
              opacity: 1,
              force3D: true
            });
            gsap.set(cardOverlays[0], {
              opacity: 0.4,
              force3D: true
            });

            // Cards 2 and 3: Hidden below but at full opacity
            gsap.set(cards.slice(1), {
              y: "100vh",
              scale: 0.9,
              opacity: 1,
              force3D: true
            });
            gsap.set(cardImages.slice(1), {
              opacity: 1,
              force3D: true
            });
            gsap.set(cardOverlays.slice(1), {
              opacity: 0.4,
              force3D: true
            });

            // Preload animations
            const preloadTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top bottom-=500",
                end: "top bottom",
                scrub: false,
                once: true,
                invalidateOnRefresh: true,
              },
            });

            preloadTl.to(ourLetters, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 1.2,
              ease: "power3.out",
              force3D: true
            }, 0);
            preloadTl.to(servicesLetters, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 1.2,
              ease: "power3.out",
              force3D: true
            }, 0.2);
            preloadTl.to(subtitle, {
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              force3D: true
            }, 0.8);

            // Increased scroll distance for slower animation (~2000px)
            const scrollDistance = 2000;

            const pinnedTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: `+=${scrollDistance}`,
                scrub: true,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true,
                refreshPriority: -1,
              },
            });

            // Transition 1: Card 1 shrinks & fades out + Card 2 slides up
            pinnedTl.to(cards[0], { scale: 0.85, opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);
            pinnedTl.to(cardImages[0], { opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);
            pinnedTl.to(cardOverlays[0], { opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);
            pinnedTl.to(cards[1], { y: "-50%", scale: 1, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);
            pinnedTl.to(cardImages[1], { opacity: 1, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);
            pinnedTl.to(cardOverlays[1], { opacity: 0.4, duration: 0.4, ease: "power3.inOut", force3D: true }, 0);

            // Tiny gap (0.4 → 0.5)
            pinnedTl.to({}, { duration: 0.1 }, 0.4);

            // Transition 2: Card 2 shrinks & fades out + Card 3 slides up
            pinnedTl.to(cards[1], { scale: 0.85, opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);
            pinnedTl.to(cardImages[1], { opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);
            pinnedTl.to(cardOverlays[1], { opacity: 0, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);
            pinnedTl.to(cards[2], { y: "-50%", scale: 1, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);
            pinnedTl.to(cardImages[2], { opacity: 1, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);
            pinnedTl.to(cardOverlays[2], { opacity: 0.4, duration: 0.4, ease: "power3.inOut", force3D: true }, 0.5);

            // Brief hold so last card stays before unpin (0.9 → 1.0)
            pinnedTl.to({}, { duration: 0.1 }, 0.9);

          } else {
            // Mobile animations
            const ourH2 = mobileTitleOurRef.current?.querySelector("h2");
            const servicesH2 = mobileTitleServicesRef.current?.querySelector("h2");
            const subtitle = mobileSubtitleRef.current;
            const mobileCards = mobileCardsRef.current.filter(Boolean) as HTMLAnchorElement[];

            if (!ourH2 || !servicesH2 || !subtitle || mobileCards.length === 0) return;

            const ourLetters = splitText(ourH2);
            const servicesLetters = splitText(servicesH2);

            gsap.set([...ourLetters, ...servicesLetters], {
              y: 80,
              opacity: 0,
              force3D: true
            });
            gsap.set(subtitle, {
              opacity: 0,
              force3D: true
            });
            gsap.set(mobileCards, {
              opacity: 0,
              y: 60,
              force3D: true
            });

            // Animate titles earlier: trigger when top of section hits 80% or 90% of viewport
            const preloadTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 90%", // Start much earlier
                end: "top 60%",
                scrub: false,
                once: true,
                invalidateOnRefresh: true,
              },
            });

            preloadTl.to(ourLetters, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.8,
              ease: "power3.out",
              force3D: true
            }, 0);
            preloadTl.to(servicesLetters, {
              y: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.8,
              ease: "power3.out",
              force3D: true
            }, 0.1);
            preloadTl.to(subtitle, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              force3D: true
            }, 0.4);

            // Cards follow after
            mobileCards.forEach((card, index) => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 95%", // Start cards earlier too
                  end: "top 70%",
                  once: true,
                },
                delay: 0.2 + (index * 0.1), // Reduced delay
              });
            });
          }

          let resizeTimeout: NodeJS.Timeout | undefined;
          const handleResize = () => {
            if (resizeTimeout) {
              clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
              ScrollTrigger.refresh();
            }, 250);
          };

          window.addEventListener("resize", handleResize);

          const initTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 300);
          }, 100);

          return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(initTimeout);
          };
        });
      }, section);

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars?.trigger === section || trigger.trigger === section) {
            trigger.kill();
          }
        });
        ctx.revert();
      };
    });

    // Return cleanup function
    return () => {
      isComponentMounted = false;
    };
  }, []);

  return (
    <>
      <PreloadImage href={img1} />
      {/* Desktop Version */}
      <section ref={sectionRef} id="services" className="hidden xxl:block bg-black relative h-screen overflow-hidden" style={{ willChange: 'transform' }}>
        {/* Titles */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none pl-8 2xl:pl-20">
          <div ref={desktopTitleOurRef} className="overflow-hidden">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-[1.1] tracking-[-1.2px] inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              Our
            </h2>
          </div>
          <div ref={desktopTitleServicesRef} className="overflow-hidden mb-4 sm:mb-5 lg:mb-6">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-[1.1] tracking-[-1.2px] inline-block"
              style={{ willChange: 'transform, opacity' }}
            >
              services
            </h2>
          </div>
          <p
            ref={desktopSubtitleRef}
            className="text-[21px] text-neutral-500 leading-[30px] tracking-[0.325px] w-[272px]"
            style={{ willChange: 'opacity' }}
          >
            Explore the range of services offered by our tech and consulting company.
          </p>
        </div>

        {/* Cards */}
        <div className="absolute left-[60%] top-1/2 -translate-x-1/2 w-[900px] h-[580px] max-h-[75vh]">
          {services.map((service, index) => (
            <a
              key={index}
              href="/services"
              ref={(el) => { cardsRef.current[index] = el; }}
              className="absolute left-1/2 -translate-x-1/2 w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                zIndex: 30 + index,
                willChange: 'transform, opacity'
              }}
            >
              <div className="absolute inset-0">
                <Image
                  ref={(el: HTMLImageElement | null) => { cardImagesRef.current[index] = el; }}
                  src={service.image}
                  alt={service.title}
                  width={800}
                  height={512}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                  style={{ willChange: 'opacity' }}
                />
                <div
                  ref={(el) => { cardOverlaysRef.current[index] = el; }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"
                  style={{ willChange: 'opacity' }}
                />
              </div>
              <div className="relative h-full flex flex-col justify-end p-8 xxl:p-12">
                {/* Bottom Fade Gradient for Text Readability */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/2 z-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  }}
                />

                <h3 className="relative z-10 text-3xl xxl:text-4xl text-white font-semibold mb-4 leading-tight">{service.title}</h3>
                <p className="relative z-10 text-lg xxl:text-xl text-neutral-300 leading-relaxed max-w-[600px]">{service.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section >

      {/* Mobile/Tablet Version */}
      < section ref={mobileSectionRef} id="services-mobile" className="xxl:hidden bg-black relative py-16 sm:py-20 md:py-24 px-6 sm:px-8 md:px-10" >
        <div className="max-w-[800px] mx-auto">
          {/* Titles */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <div ref={mobileTitleOurRef} className="overflow-hidden">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-[1.1] tracking-[-1.2px] inline-block"
                style={{ willChange: 'transform, opacity' }}
              >
                Our
              </h2>
            </div>
            <div ref={mobileTitleServicesRef} className="overflow-hidden">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-white font-semibold leading-[1.1] tracking-[-1.2px] inline-block"
                style={{ willChange: 'transform, opacity' }}
              >
                services
              </h2>
            </div>
            <p
              ref={mobileSubtitleRef}
              className="text-base sm:text-lg lg:text-xl text-neutral-500 leading-relaxed max-w-[400px] mt-4 sm:mt-5 lg:mt-6"
              style={{ willChange: 'opacity' }}
            >
              Explore the range of services offered by our tech and consulting company.
            </p>
          </div>

          {/* Cards - Vertical Stack */}
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12">
            {services.map((service, index) => (

              <a
                key={index}
                href="/services"
                ref={(el) => { mobileCardsRef.current[index] = el; }}
                className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={service.image}
                    width={800}
                    height={512}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-100"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"
                  />
                </div>
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10">
                  <h3 className="text-[26px] sm:text-[30px] md:text-[34px] text-white font-semibold mb-3 sm:mb-4 md:mb-5 leading-tight">{service.title}</h3>
                  <p className="text-[16px] sm:text-[18px] md:text-[20px] text-neutral-300 leading-relaxed">{service.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section >
    </>
  );
}