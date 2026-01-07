"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Montagu_Slab } from "next/font/google";
import { DM_Sans } from "next/font/google";
import Badge from "../src/components/badge";

// Util to create a spiky star polygon path identical to the hero badge
function makeStarPolygonStatic(
  spikes: number,
  innerRadiusPct: number,
  outerRadiusPct: number,
  rotationDeg = -90
) {
  const coords: string[] = [];
  const step = Math.PI / spikes;
  const rot = (rotationDeg * Math.PI) / 180;
  const fmt = (n: number) =>
    Number.isInteger(n) ? `${n}` : n.toFixed(4).replace(/\.?0+$/, "");
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerRadiusPct : innerRadiusPct;
    const angle = rot + i * step;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    coords.push(`${fmt(x)}% ${fmt(y)}%`);
  }
  return `polygon(${coords.join(", ")})`;
}

const montaguSlab = Montagu_Slab({ subsets: ["latin"], weight: ["600"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["500", "600"] });

function Navbar() {
  return (
    <header className="relative z-50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Vintale" width={130} height={28} />
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-zinc-700 md:flex">
          <a href="#collections" className="hover:text-black">Collections</a>
          <a href="#story" className="hover:text-black">Our Story</a>
          <a href="#journal" className="hover:text-black">Journal</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <Image src="/cart.png" alt="Cart" width={36} height={36} />
          <Image src="/profile.png" alt="Profile" width={36} height={36} />
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const featuresRef = useRef<HTMLElement | null>(null);
  const collectionsRef = useRef<HTMLElement | null>(null);
  const bottleContainerRef = useRef<HTMLDivElement | null>(null);
  const roseSvgRef = useRef<HTMLDivElement | null>(null);
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const bottleRef = useRef<HTMLImageElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const circleOuterRef = useRef<HTMLDivElement | null>(null);
  const ringOuterRef = useRef<HTMLDivElement | null>(null);
  const badgeBurstRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const lastBottleWrapRef = useRef<HTMLDivElement | null>(null);
  const lastBottleImgRef = useRef<HTMLImageElement | null>(null);
  const lastBadgeBurstRef = useRef<HTMLDivElement | null>(null);
  const featureAnglesDeg = [165, 120, 90, 60, 15];
  const getEllipsePoint = (angleDeg: number, radiusX: number, radiusY: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: radiusX * Math.cos(rad),
      y: radiusY * Math.sin(rad),
    };
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const resizeHandlers: Array<() => void> = [];
    
    const handleKeyNav = (evt: KeyboardEvent) => { 
        if (evt.key !== "ArrowRight" && evt.key !== "ArrowLeft") return;
        const sections = Array.from(document.querySelectorAll("section")) as HTMLElement[];
        if (sections.length === 0) return;
        const currentY = window.scrollY;
        const nextByDirection = (dir: 1 | -1) => {
          const tops = sections
            .map((el) => ({ el, top: el.offsetTop }))
            .sort((a, b) => a.top - b.top);
          if (dir === 1) {
            const next = tops.find((t) => t.top > currentY + 10);
            return next?.top ?? tops[tops.length - 1].top;
          } else {
            const prev = [...tops].reverse().find((t) => t.top < currentY - 10);
            return prev?.top ?? tops[0].top;
          }
        };
        const targetTop =
          evt.key === "ArrowRight" ? nextByDirection(1) : nextByDirection(-1);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      };
    window.addEventListener("keydown", handleKeyNav);

    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
      });

      const mm = gsap.matchMedia();

      if (badgeRef.current || ctaRef.current) {
        gsap.fromTo(
          [badgeRef.current, ctaRef.current],
          { autoAlpha: 1 },
          {
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current!,
              start: "top top",
              end: "30% top",
              scrub: true,
            },
          }
        );
      }

      mm.add("(min-width: 1024px)", () => {
        const getStoryScale = () => {
          const vw = window.innerWidth;
          if (vw < 640) return 0.18;
          if (vw < 1024) return 0.22;
          return 0.28;
        };
        const setInitialPosition = () => {
          if (!bottleContainerRef.current || !roseSvgRef.current) return;
          const containerRect = bottleContainerRef.current.getBoundingClientRect();
          const centerX = containerRect.left + containerRect.width / 2;
          const centerY = containerRect.top + containerRect.height / 2;
          
          gsap.set(roseSvgRef.current, {
            x: centerX,
            y: centerY,
            xPercent: -50,
            yPercent: -50,
            scale: 0.75,
            rotate: -14,
            opacity: 1,
          });
        };
        const handleResize = () => {
          setInitialPosition();
          const newStoryScale = getStoryScale();
          if (roseSvgRef.current && storyRef.current) {
            const storyRect = storyRef.current.getBoundingClientRect();
            const isInStorySection =
              storyRect.top <= window.innerHeight / 2 &&
              storyRect.bottom >= window.innerHeight / 2;
            if (isInStorySection) {
              gsap.set(roseSvgRef.current, {
                scale: newStoryScale,
                rotate: 0,
              });
            }
          }
          ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);
        resizeHandlers.push(() => window.removeEventListener("resize", handleResize));

        const calculateProgress = () => {
          const heroTop = heroRef.current?.offsetTop ?? 0;
          const heroHeight = heroRef.current?.offsetHeight ?? 0;
          const storyTop = storyRef.current?.offsetTop || 0;
          const storyHeight = storyRef.current?.offsetHeight || 0;
          const featuresTop = featuresRef.current?.offsetTop || 0;
          const featuresHeight = featuresRef.current?.offsetHeight || 0;
          const collectionsTop = collectionsRef.current?.offsetTop ?? 0;
          const collectionsHeight = collectionsRef.current?.offsetHeight ?? 0;
          const totalScroll = collectionsTop + collectionsHeight - heroTop;
          return {
            heroEnd: heroHeight / (totalScroll || 1),
            storyStart: (storyTop - heroTop) / (totalScroll || 1),
            storyEnd: (storyTop + storyHeight - heroTop) / (totalScroll || 1),
            featuresStart: (featuresTop - heroTop) / (totalScroll || 1),
            featuresEnd: (featuresTop + featuresHeight - heroTop) / (totalScroll || 1),
            collectionsStart: (collectionsTop - heroTop) / (totalScroll || 1),
          };
        };
        calculateProgress();

        // Main Rose SVG ScrollTrigger animation - spans from hero to collections
        if (roseSvgRef.current && heroRef.current && bottleContainerRef.current && collectionsRef.current) {
          // Wait for layout, then calculate initial position
          requestAnimationFrame(() => {
            requestAnimationFrame(setInitialPosition);
          });

          // Calculate section positions for progress mapping
          const progress = (() => {
            const heroTop = heroRef.current!.offsetTop;
            const heroHeight = heroRef.current!.offsetHeight;
            const storyTop = storyRef.current?.offsetTop || 0;
            const storyHeight = storyRef.current?.offsetHeight || 0;
            const featuresTop = featuresRef.current?.offsetTop || 0;
            const featuresHeight = featuresRef.current?.offsetHeight || 0;
            const collectionsTop = collectionsRef.current!.offsetTop;
            const collectionsHeight = collectionsRef.current!.offsetHeight;
            const totalScroll = collectionsTop + collectionsHeight - heroTop;
            return {
              heroEnd: heroHeight / totalScroll,
              storyStart: (storyTop - heroTop) / totalScroll,
              storyEnd: (storyTop + storyHeight - heroTop) / totalScroll,
              featuresStart: (featuresTop - heroTop) / totalScroll,
              featuresEnd: (featuresTop + featuresHeight - heroTop) / totalScroll,
              collectionsStart: (collectionsTop - heroTop) / totalScroll,
              collectionsEnd: (collectionsTop + collectionsHeight - heroTop) / totalScroll,
            };
          })();

          // Create master timeline for rose SVG that spans entire scroll
          const roseTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: () => {
                const heroTop = heroRef.current!.offsetTop;
                const collectionsTop = collectionsRef.current!.offsetTop;
                const collectionsHeight = collectionsRef.current!.offsetHeight;
                return `${collectionsTop + collectionsHeight - heroTop}px top`;
              },
              scrub: 1,
              pin: false,
              invalidateOnRefresh: true,
            },
          });

          roseTl.to(
            roseSvgRef.current,
            {
              scale: 0.8,
              rotate: 0,
              ease: "none",
            },
            0
          );

          const storyScale = getStoryScale();
          roseTl.fromTo(
            roseSvgRef.current,
            {
              scale: 1,
            },
            {
              scale: storyScale,
              rotate: 0,
              x: "50vw",
              y: "50vh",
              xPercent: -50,
              yPercent: -50,
              ease: "power1.out",
            },
            progress.storyStart
          );

          roseTl.to(
            roseSvgRef.current,
            {
              scale: 0.6,
              rotate: 0,
              x: "50vw",
              y: "50vh",
              xPercent: -50,
              yPercent: -50,
              opacity: 1,
            },
            progress.storyEnd
          );

          roseTl.to(
            roseSvgRef.current,
            {
              scale: 1,
              x: "50vw",
              y: "-120vh",
              xPercent: -50,
              yPercent: -50,
              rotate: 0,
            },
            progress.featuresEnd
          );

          roseTl.to(
            roseSvgRef.current,
            {
              scale: 0.2,
              x: "50vw",
              y: "46vh",
              xPercent: -50,
              yPercent: -50,
              opacity: 1,
            },
            progress.collectionsStart
          );

        }
        
        const makeStarPolygon = (
          spikes: number,
          innerRadiusPct: number,
          outerRadiusPct: number,
          rotationDeg = -90
        ) => {
          const coords: string[] = [];
          const step = Math.PI / spikes;
          const rot = (rotationDeg * Math.PI) / 180;
          for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerRadiusPct : innerRadiusPct;
            const angle = rot + i * step;
            const x = 50 + r * Math.cos(angle);
            const y = 50 + r * Math.sin(angle);
            coords.push(`${x}% ${y}%`);
          }
          return `polygon(${coords.join(",")})`;
        };
        if (badgeBurstRef.current) {
          badgeBurstRef.current.style.clipPath = makeStarPolygon(11, 34, 50, -90);
          gsap.to(badgeBurstRef.current, {
            rotate: 360,
            duration: 12,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }
        if (lastBadgeBurstRef.current) {
          gsap.set(lastBadgeBurstRef.current, { rotate: 0, transformOrigin: "50% 50%" });
          gsap.to(lastBadgeBurstRef.current, {
            rotate: 360,
            duration: 12,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }
        
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const baseDiameter = 820; 
        const overscan = 1.4;
        const scaleFull = (Math.max(vw, vh) * overscan) / baseDiameter;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current!,
            start: "top top",
            end: "+=1200",
            scrub: 1,
            pin: bottleWrapRef.current!,
            anticipatePin: 1,
          },
        });

        tl
          .fromTo(
            bottleRef.current,
            { y: 60, rotate: -14, scale: 0.95 },
            { y: 0, rotate: 0, scale: 1, ease: "none" },
            0
          )
          .fromTo(
            circleRef.current,
            { scale: 0.65 },
            { scale: scaleFull, ease: "none", transformOrigin: "50% 50%" },
            0
          )
          .fromTo(
            [circleOuterRef.current, ringOuterRef.current],
            { scale: 0.85 },
            { scale: scaleFull * 0.98, ease: "none", transformOrigin: "50% 50%" },
            0
          )
          .fromTo(
            badgeRef.current,
            { scale: 0.9 },
            { scale: 1.06, ease: "none" },
            "<"
          );
      });
    }, rootRef);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", handleKeyNav);
      resizeHandlers.forEach((cleanup) => {
        try {
          cleanup();
        } catch {}
      });
    };
  }, []);

  useEffect(() => {
    // Simple IntersectionObserver to hide GSAP bottle in last section
    if (!roseSvgRef.current || !collectionsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (roseSvgRef.current) {
            if (entry.isIntersecting) {
              // Last section is visible - hide GSAP bottle
              roseSvgRef.current.style.visibility = 'hidden';
            } else {
              // Last section not visible - show GSAP bottle
              roseSvgRef.current.style.visibility = 'visible';
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(collectionsRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const products = [
    { id: 1, name: "Golden Chard", color: "#F4B35F", price: 129, img: "/assets/Gold.svg" },
    { id: 2, name: "Scarlet Merlot", color: "#E65164", price: 149, img: "/assets/Red.svg" },
    { id: 3, name: "Blossom Rosé", color: "#FF5DA8", price: 179, img: "/assets/Rose.svg" },
    { id: 4, name: "Verdant Grove", color: "#32D282", price: 189, img: "/assets/Green.svg" },
    { id: 5, name: "Purple Malbec", color: "#7056FF", price: 149, img: "/assets/Purple.svg" },
  ];

  return (
    <div ref={rootRef} className="bg-white text-zinc-950">
      <Navbar />

      {/* Single Rose SVG - positioned absolutely, animated via ScrollTrigger */}
      <div
        ref={roseSvgRef}
        className="pointer-events-none fixed z-30"
        style={{ willChange: "transform, opacity", opacity: 0 }}
      >
        <Image
          src="/assets/Rose.svg"
          alt="Blossom Rosé bottle"
          width={1600}
          height={1619}
          priority
          className="drop-shadow-2xl"
        />
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl items-center px-6">
          <div className="relative z-1">
            <h1
              ref={titleRef}
              className={`fade-in ${montaguSlab.className} text-center font-semibold leading-[0.8] tracking-[-0.03em] text-[72px] sm:text-[120px] lg:text-[230px]`}
            >
              Taste Heritage
            </h1>
          </div>

          {/* Bottle + badge (pinned on desktop) */}
          <div ref={bottleWrapRef} className="relative h-[520px] lg:h-[680px]">
            {/* subtle background tint */}
            <div
              aria-hidden
              className="absolute -left-20 bottom-0 right-0 top-20 rounded-[999px] bg-[radial-gradient(closest-side,_rgba(255,93,168,0.35),_transparent_70%)]"
            />

            {/* Animated circles */}
            <div
              ref={circleOuterRef}
              className="pointer-events-none absolute left-1/2 top-[55%] h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full z-1"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #EB235C 0%, #EB235C 85%, rgba(255,93,168,0.0) 100%)",
              }}
            />
            <div
              ref={circleRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full z-1"
              style={{
                background:
                  "radial-gradient(circle at 50% 58%, #FF2E8D 0%, #F2397A 28%, #EB235C 55%, rgba(235,35,92,0.25) 70%, rgba(235,35,92,0) 80%)",
              }}
            />
            <div
              ref={ringOuterRef}
              className="pointer-events-none absolute left-1/2 top-[55%] h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                boxSizing: "content-box",
                border: "2px solid #EB235C",
                background: "transparent",
                zIndex: 0,
                padding: "20px" 
              }}
            />
            {/* Bottle container for positioning context */}
            <div ref={bottleContainerRef} className="absolute inset-0 flex items-center justify-center">
            </div>

            <Badge
              containerRef={badgeRef}
              burstRef={badgeBurstRef}
              className="absolute hidden items-center justify-center lg:flex right-20"
              size={175}
              useDefaultStar={false}
            />

            {/* Copy + CTA */}
            <div className="w-[368px] h-[104px] mt-[60px]">
            <p className={`${dmSans.className} mt-6 text-[20px] leading-[1.3] font-semibold tracking-normal`}>
              Discover artisanal wines curated from vineyards around the world. Every bottle tells a story that is smooth, bold and timeless.
            </p>

            </div>
            <div ref={ctaRef} className="absolute right-6 bottom-6 z-20 opacity-100">
              <a href="#collections" className="btn-3 relative inline-flex items-center px-8 py-3 font-semibold overflow-hidden">
                <span className="btn-3-bg absolute inset-0"></span>
                <span className="btn-3-text relative z-10 flex items-center gap-2 text-white">
                  <span className="label">Shop Now</span>
                  <span className="arrow">↗</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={storyRef} id="story" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-pink-500 to-rose-600 text-white z-1">
        <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className={`${montaguSlab.className} text-[48px] leading-[0.8] font-semibold tracking-[-0.03em]`}>Timeless Craft</h2>
            <p className={`${dmSans.className} mt-5 max-w-md text-zinc-100/90 text-[22px] leading-[1.5] font-medium tracking-normal`}>
              From sun-soaked vineyards to your table, our journey begins with a deep-rooted passion for craftsmanship and
              authenticity. We collaborate with small-batch winemakers who carry generations of wisdom, honoring time-tested
              traditions passed down through families and regions. Their process is slow, intentional, and guided by the
              rhythms of the land — from hand-picking grapes at peak ripeness to aging in seasoned oak barrels that add depth
              and complexity.
            </p>
          </div>

          <div className="hidden items-center justify-center lg:flex lg:col-span-1" />

          <div className="lg:col-span-1">
            <h2 className={`${montaguSlab.className} text-[48px] leading-[0.8] font-semibold tracking-[-0.03em]`}>About Vintale</h2>
            <p className={`${dmSans.className} mt-5 max-w-md text-zinc-100/90 text-[22px] leading-[1.5] font-medium tracking-normal`}>
              Vintale began with a belief that wine should offer more than taste. Founded by friends with a passion for
              tradition and storytelling, we curate wines that reflect the craft and care of the people who make them. From
              small family-run vineyards to quiet cellars, our selections are rooted in heritage and chosen for their
              character. It’s not just wine, it’s what brings people together. Every bottle invites a story. Every sip
              celebrates a moment.
            </p>
            <div className="mt-8">
            <a href="#collections" className="btn-3 relative inline-flex items-center px-8 py-3 font-semibold overflow-hidden">
              <span className="btn-3-bg absolute inset-0"></span>
              <span className="btn-3-text relative z-10 flex items-center gap-2 text-white">
                <span className="label">Shop Now</span>
                <span className="arrow">↗</span>
              </span>
            </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="relative overflow-hidden bg-white min-h-screen">
        {/* Top pink arc (shrunk circle) */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-0 -translate-x-1/2 rounded-full"
          style={{
            borderRadius: "50%",
            width: 1862,
            height: 1862,
            overflow: "hidden",
            top: "-180%",
            background:
              "radial-gradient(circle at 50% 58%, #FF2E8D 0%, #F2397A 28%, #EB235C 55%, rgb(235 35 92) 70%, rgba(235, 35, 92, 0) 100%)",
          }}
        />
        {/* Soft floor shadow under arc */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[80px] z-0 h-[140px] w-[820px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0) 70%)",
            filter: "blur(8px)",
            opacity: 0.6,
          }}
        />
        {/* Desktop: icons placed along the arc */}
        <div
          className="hidden lg:block absolute left-1/2 top-[-120px] z-10"
          style={{ width: 1545, height: 946, transform: "translateX(-50%)" }}
        >
          {[
            { label: "Quick Delivery", img: "/assets/QuickDelivery.svg" },
            { label: "Easy Returns", img: "/assets/EasyReturns.svg" },
            { label: "Quality Assured", img: "/assets/QualityAssured.svg" },
            { label: "Secure Payment", img: "/assets/SecurePayment.svg" },
            { label: "Eco Friendly", img: "/assets/EcoFriendly.svg" },
          ].map(({ label, img }, idx) => {
            const a = 1545 / 2;
            const b = 997 / 2;
            const { x, y } = getEllipsePoint(featureAnglesDeg[idx], a * 0.78, b * 0.64);
            return (
              <div
                key={label}
                className="absolute flex flex-col items-center"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                }}
              >
                <div className="flex items-center justify-center rounded-[75px] w-[150px] h-[150px] bg-white">
                  <Image src={img} alt={label} width={150} height={150} />
                </div>
                <div className="mt-3 text-sm font-semibold text-zinc-800 text-center leading-tight">
                  {label.split(" ").map((w, i) => (
                    <div key={i}>{w}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {/* Mobile/tablet fallback grid at the bottom */}
        <div className="absolute bottom-[2%] lg:hidden" style={{justifySelf: 'center'}}
        >
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Quick Delivery", img: "/assets/QuickDelivery.svg" },
              { label: "Easy Returns", img: "/assets/EasyReturns.svg" },
              { label: "Quality Assured", img: "/assets/QualityAssured.svg" },
              { label: "Secure Payment", img: "/assets/SecurePayment.svg" },
              { label: "Eco Friendly", img: "/assets/EcoFriendly.svg" },
            ].map(({ label, img }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center rounded-[75px] border border-pink-300 w-[150px] h-[150px] p-[35px] gap-[10px] opacity-100">
                  <Image src={img} alt={label} width={80} height={80} />
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="collections-grid" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12 justify-items-center">
            {products.map((p) => (
              <div key={p.id} className="text-center">
                <div className="relative h-[400px] w-[360px]">
                  <div
                    className="absolute -inset-6 -z-10 rounded-full opacity-30 blur-2xl"
                    style={{ background: `radial-gradient(closest-side, ${p.color}, transparent 70%)` }}
                  />
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="(min-width:1024px) 18vw, (min-width:640px) 30vw, 45vw"
                    className="object-contain object-bottom"
                  />
                </div>
                <div className={`${montaguSlab.className} mt-4 text-pink-600 text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-center`}>${p.price}</div>
                <div className={`${montaguSlab.className} mt-1 text-[20px] leading-[1.1] font-semibold tracking-[-0.03em] text-center`}>{p.name}</div>
              </div>
            ))}
          </div>

          <p className={`${montaguSlab.className} mx-auto mt-10 w-max rounded-full bg-pink-50 px-4 py-2 text-pink-700 text-center text-[20px] leading-[1.1] font-semibold tracking-[-0.03em]`}>
            Each bottle contains 750ml of carefully crafted wine
          </p>

        </div>
      </section>

      <section ref={collectionsRef} id="collections" className="relative overflow-hidden bg-white min-h-screen">
        <div className="mx-auto max-w-7xl px-6">
          <div className="absolute bg-white/80 top-[16%]">
            <div className="mx-auto flex max-w-7xl flex-col px-6 py-4">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Vintale" width={130} height={28} />
              </div>
              <nav className="hidden gap-8 text-sm font-medium text-zinc-700 md:flex mt-4">
                <a href="#collections" className={`${dmSans.className} font-semibold text-[18px] leading-[1] tracking-normal hover:text-black`}>Collections</a>
                <a href="#story" className={`${dmSans.className} font-semibold text-[18px] leading-[1] tracking-normal hover:text-black`}>Our Story</a>
                <a href="#collections-grid" className={`${dmSans.className} font-semibold text-[18px] leading-[1] tracking-normal hover:text-black`}>Journal</a>
                <a href="#contact" className={`${dmSans.className} font-semibold text-[18px] leading-[1] tracking-normal hover:text-black`}>Contact</a>
              </nav>
            </div>
          </div>
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Left copy */}
            <div className="absolute z-10" style={{top: '30%'}}>
              <h1 className={`${montaguSlab.className} leading-[0.9] tracking-[-0.03em] text-[56px] sm:text-[80px] lg:text-[190px] text-zinc-900`}>
                Let the
              </h1>
              <h1 className={`${montaguSlab.className} leading-[0.9] tracking-[-0.03em] text-[56px] sm:text-[80px] lg:text-[190px] text-pink-600`}>
                Moments
              </h1>
              <h1 className={`${montaguSlab.className} leading-[0.9] tracking-[-0.03em] text-[56px] sm:text-[80px] lg:text-[190px] text-zinc-900`}>
                Pour.
              </h1>
              <div className="mt-8">
                <a href="#collections-grid" className="btn-3 relative inline-flex items-center px-8 py-3 font-semibold overflow-hidden">
                  <span className="btn-3-bg absolute inset-0"></span>
                  <span className="btn-3-text relative z-10 flex items-center gap-2 text-white">
                    <span className="label">Shop Now</span>
                    <span className="arrow">↗</span>
                  </span>
                </a>

              <Badge
                className="absolute right-6 top-12 hidden items-center justify-center lg:flex top-[80%]"
                size={175}
                useDefaultStar={false}
                burstClipPath={makeStarPolygonStatic(11, 34, 50, -90)}
                burstRef={lastBadgeBurstRef}
              />

              </div>
            </div>
            <div ref={lastBottleWrapRef} className="relative h-[900px] w-[900px] lg:h-[1100px] lg:w-[1100px] left-[100%]">
              <Image
                ref={lastBottleImgRef}
                src="/assets/Rose.svg"
                alt="Blossom Rosé"
                width={1600}
                height={1619}
                className="object-contain"
                priority
                style={{
                  position: "absolute",
                  top: -360,
                  left: '50%',
                  transform: "rotate(-23deg) scale(1.8)",
                  transformOrigin: "143% 40%",
                  opacity: 1,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}