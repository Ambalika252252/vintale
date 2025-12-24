"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Montagu_Slab } from "next/font/google";
import { DM_Sans } from "next/font/google";

const montaguSlab = Montagu_Slab({ subsets: ["latin"], weight: ["600"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["600"] });

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍷</span>
          <span className="text-xl font-semibold">Vintale</span>
        </div>
        <nav className="hidden gap-8 text-sm font-medium text-zinc-700 md:flex">
          <a href="#collections" className="hover:text-black">Collections</a>
          <a href="#story" className="hover:text-black">Our Story</a>
          <a href="#journal" className="hover:text-black">Journal</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="h-9 w-9 rounded-full bg-zinc-900 text-white">🛒</button>
          <button className="h-9 w-9 rounded-full bg-zinc-900 text-white">👤</button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const bottleWrapRef = useRef<HTMLDivElement | null>(null);
  const bottleRef = useRef<HTMLImageElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const circleOuterRef = useRef<HTMLDivElement | null>(null);
  const ringOuterRef = useRef<HTMLDivElement | null>(null);
  const hasLoggedFullRef = useRef<boolean>(false);
  const badgeBurstRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  // #region agent log
  type AgentPayload = {
    hypothesisId: string;
    location: string;
    message: string;
    data?: unknown;
    runId?: string;
    sessionId?: string;
    timestamp?: number;
  };
  const agentLog = (payload: AgentPayload) =>
    fetch("http://127.0.0.1:7242/ingest/7bb29de4-8ddb-41c7-9301-e135e6c89488", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        timestamp: Date.now(),
        ...payload,
      }),
    }).catch(() => { });
  // #endregion

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // #region agent log
    agentLog({
      hypothesisId: "H1",
      location: "app/(public)/page.tsx:effect",
      message: "Effect mounted and ScrollTrigger registered",
      data: { width: typeof window !== "undefined" ? window.innerWidth : null },
    });
    // #endregion

    // #region agent log
    if (titleRef.current) {
      const computed = window.getComputedStyle(titleRef.current);
      agentLog({
        hypothesisId: "H4",
        location: "app/(public)/page.tsx:title",
        message: "Title computed styles",
        data: { fontFamily: computed.fontFamily, fontWeight: computed.fontWeight },
      });
    }
    // #endregion

    const ctx = gsap.context(() => {
      gsap.from(".fade-in", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: "power2.out",
      });

      const mm = gsap.matchMedia();

      // Keyboard navigation: Right/Left arrows jump between sections in document order
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

      // New behavior: fade out badge + CTA as hero scrolls (they should disappear with the headline)
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
        // #region agent log
        agentLog({
          hypothesisId: "H2",
          location: "app/(public)/page.tsx:matchMedia",
          message: "Desktop media query matched; creating timeline",
          data: {},
        });
        // #endregion
        // Build an 11-point star (22-vertex polygon) for the badge via clip-path
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
          // rotate only the background burst continuously
          gsap.to(badgeBurstRef.current, {
            rotate: 360,
            duration: 12,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }
        
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const baseDiameter = 820; // matches circleOuterRef base size
        const overscan = 1.4; // grow beyond edges to fully cover
        const scaleFull = (Math.max(vw, vh) * overscan) / baseDiameter;

        // #region agent log
        agentLog({
          hypothesisId: "H5",
          location: "app/(public)/page.tsx:scaleCompute",
          message: "Computed scales for full-bleed circle",
          data: { vw, vh, baseDiameter, scaleFull },
        });
        // #endregion

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current!,
            start: "top top",
            end: "+=1200",
            scrub: 1,
            pin: bottleWrapRef.current!,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (!hasLoggedFullRef.current && self.progress > 0.98) {
                const rect = circleRef.current?.getBoundingClientRect();
                agentLog({
                  hypothesisId: "H6",
                  location: "app/(public)/page.tsx:fullBleedCheck",
                  message: "Circle near full-bleed",
                  data: {
                    vw: window.innerWidth,
                    vh: window.innerHeight,
                    circleW: rect?.width ?? null,
                    circleH: rect?.height ?? null,
                    progress: self.progress,
                  },
                });
                hasLoggedFullRef.current = true;
              }
            },
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
          // As the fill circle enlarges to full-screen, scale the ring layers slightly less
          // so the visible border appears to move inward relative to the growing fill.
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
        // #region agent log
        agentLog({
          hypothesisId: "H5",
          location: "app/(public)/page.tsx:circleTimeline",
          message: "Circle/bottle timeline configured",
          data: { scaleFull, vw, vh },
        });
        // #endregion
        // #region agent log
        agentLog({
          hypothesisId: "H2",
          location: "app/(public)/page.tsx:timeline",
          message: "Timeline created for bottle and badge",
          data: {},
        });
        // #endregion
      });
    }, rootRef);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", handleKeyNav as any);
    };
  }, []);

  const products = [
    { id: 1, name: "Golden Chard", color: "#F4B35F", price: 129, img: "/assets/Gold.svg" },
    { id: 2, name: "Scarlet Merlot", color: "#E65164", price: 149, img: "/assets/Red.svg" },
    { id: 3, name: "Blossom Rosé", color: "#FF5DA8", price: 179, img: "/assets/Rose.svg" },
    { id: 4, name: "Verdant Grove", color: "#32D282", price: 189, img: "/assets/Green.svg" },
    { id: 5, name: "Purple Malbec", color: "#7056FF", price: 149, img: "/assets/Purple.svg" },
  ];

  // #region agent log
  const onProductLoad = (name: string, src: string) => () =>
    agentLog({
      hypothesisId: "H3",
      location: "app/(public)/page.tsx:productImage",
      message: "Product image loaded",
      data: { name, src },
    });
  const onProductError = (name: string, src: string) => () =>
    agentLog({
      hypothesisId: "H3",
      location: "app/(public)/page.tsx:productImage",
      message: "Product image failed",
      data: { name, src },
    });
  // #endregion

  return (
    <div ref={rootRef} className="bg-white text-zinc-950">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl items-center px-6">
          <div className="relative z-0">
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
              className="pointer-events-none absolute left-1/2 top-[55%] h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full "
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #EB235C 0%, #EB235C 85%, rgba(255,93,168,0.0) 100%)",
              }}
            />
            <div
              ref={circleRef}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 58%, #FF2E8D 0%, #F2397A 28%, #EB235C 55%, rgba(235,35,92,0.25) 70%, rgba(235,35,92,0) 80%)",
              }}
            />
            {/* Thin ring outlines */}
            <div
              ref={ringOuterRef}
              className="pointer-events-none absolute left-1/2 top-[55%] h-[840px] w-[840px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                boxSizing: "content-box",
                border: "2px solid #EB235C",
                background: "transparent",
                zIndex: 0,
                padding: "20px" /* gap between fill circle (820) and this ring (840) */,
              }}
            />
            {/* Bottle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                ref={bottleRef}
                src="/assets/Rose.png"
                alt="Blossom Rosé bottle"
                width={1600}
                height={1619}
                priority
                className="drop-shadow-2xl z-1"
                onLoad={() =>
                  agentLog({
                    hypothesisId: "H3",
                    location: "app/(public)/page.tsx:heroBottle",
                    message: "Hero bottle loaded",
                    data: { src: "/assets/Rose.png" },
                  })
                }
                onError={() =>
                  agentLog({
                    hypothesisId: "H3",
                    location: "app/(public)/page.tsx:heroBottle",
                    message: "Hero bottle failed",
                    data: { src: "/assets/Rose.png" },
                  })
                }
              />
            </div>

            {/* Badge */}
            <div
              ref={badgeRef}
              className="absolute hidden items-center justify-center text-center text-zinc-900 lg:flex"
              style={{
                width: "175px",
                height: "175px",
                right: "80px",
                opacity: 1,
              }}
            >
              <div
                ref={badgeBurstRef}
                className="absolute inset-0"
                style={{ backgroundColor: "#F6C343" }}
              />
              <div className="relative z-10 leading-none text-center">
                <div className="font-extrabold text-[44px] tracking-tight">25%</div>
                <div className="mt-1 font-extrabold text-[26px] tracking-tight">OFF</div>
              </div>
            </div>

            {/* Copy + CTA */}
            <div className="w-[368px] h-[104px] mt-[60px]">
            <p className={`${dmSans.className} mt-6 text-[20px] leading-[1.3] font-semibold tracking-normal`}>
              Discover artisanal wines curated from vineyards around the world. Every bottle tells a story that is smooth, bold and timeless.
            </p>

            </div>
            <div ref={ctaRef} className="absolute right-6 bottom-6 z-20 opacity-100">
              <a
                href="#collections"
                className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-3 text-white shadow-lg transition-colors hover:bg-zinc-800"
              >
                Shop Now ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-BACKGROUND REVEAL (second section shown after hero ends) */}
      <section id="full-background-reveal" className="relative overflow-hidden min-h-screen bg-gradient-to-br from-pink-500 to-rose-600 text-white">
        <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-extrabold tracking-tight">Timeless Craft</h2>
            <p className="mt-5 max-w-md text-zinc-100/90">
              From sun-soaked vineyards to your table, our journey begins with a deep-rooted passion for craftsmanship and
              authenticity. We collaborate with small-batch winemakers who carry generations of wisdom, honoring time-tested
              traditions passed down through families and regions. Their process is slow, intentional, and guided by the
              rhythms of the land — from hand-picking grapes at peak ripeness to aging in seasoned oak barrels that add depth
              and complexity.
            </p>
          </div>

          {/* Center bottle column */}
          <div className="hidden items-center justify-center lg:flex lg:col-span-1">
            <Image
              src="/assets/Rose.png"
              alt="Bottle"
              width={300}
              height={620}
              className="drop-shadow-[0_50px_60px_rgba(0,0,0,0.35)]"
            />
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-4xl font-extrabold tracking-tight">About Vintale</h2>
            <p className="mt-5 max-w-md text-zinc-100/90">
              Vintale began with a belief that wine should offer more than taste. Founded by friends with a passion for
              tradition and storytelling, we curate wines that reflect the craft and care of the people who make them. From
              small family-run vineyards to quiet cellars, our selections are rooted in heritage and chosen for their
              character. It’s not just wine, it’s what brings people together. Every bottle invites a story. Every sip
              celebrates a moment.
            </p>
            <div className="mt-8">
              <a
                href="#collections"
                className="inline-flex items-center rounded-full bg-zinc-900 px-6 py-3 text-white transition-colors hover:bg-zinc-800"
              >
                Shop Now ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STORY / CRAFT (removed - content lives in full-background-reveal section) */}

      {/* FEATURES */}
      <section className="relative bg-white">
        <div className="mx-auto -mt-16 max-w-6xl rounded-t-[80px] bg-white px-6 pb-16 pt-16 shadow-[0_-30px_60px_-20px_rgba(255,93,168,0.25)]">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Quick Delivery", img: "/assets/QuickDelivery.svg" },
              { label: "Easy Returns", img: "/assets/EasyReturns.svg" },
              { label: "Quality Assured", img: "/assets/QualityAssured.svg" },
              { label: "Secure Payment", img: "/assets/SecurePayment.svg" },
              { label: "Eco Friendly", img: "/assets/EcoFriendly.svg" },
            ].map(({ label, img }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-pink-300">
                  <Image src={img} alt={label} width={28} height={28} />
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="bg-white py-20">
        <div className="">
          <h3 className="text-center text-4xl font-extrabold tracking-tight">The Vintale Vault</h3>

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
                    onLoad={onProductLoad(p.name, p.img)}
                    onError={onProductError(p.name, p.img)}
                  />
                </div>
                <div className="mt-4 text-pink-600 text-xl font-extrabold">${p.price}</div>
                <div className="mt-1 font-semibold">{p.name}</div>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 w-max rounded-full bg-pink-50 px-4 py-2 text-sm text-pink-700">
            Each bottle contains 750ml of carefully crafted wine
          </p>
        </div>
      </section>

      <footer id="contact" className="border-t bg-white py-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍷</span>
            <span className="font-semibold">Vintale</span>
          </div>
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} Vintale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}