import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { heroConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const overlayTextRef = useRef<HTMLDivElement>(null);
  const isConstructionHero = heroConfig.heroImage.endsWith('/hero-construction2.png');
  const isBuildWithUsText = heroConfig.backgroundText === 'Build with us';
  const isTrustedContractorText = heroConfig.overlayText === 'Illinois Trusted General Contractor Since 2008';
  const navLogoSrc = `${import.meta.env.BASE_URL}mc-pro-logo.png`;
  const hasHeroContent = Boolean(heroConfig.backgroundText) || Boolean(heroConfig.heroImage) || heroConfig.navLinks.length > 0;

  useEffect(() => {
    if (!hasHeroContent) return;

    const ctx = gsap.context(() => {
      // Store ScrollTrigger instances for cleanup
      const triggers: ScrollTrigger[] = [];

      // Parallax effect for main text
      const textTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (textRef.current) {
            gsap.set(textRef.current, { yPercent: self.progress * 110 });
          }
        },
      });
      triggers.push(textTrigger);

      // Parallax effect for model (slower movement = appears closer)
      const modelTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          if (modelRef.current) {
            gsap.set(modelRef.current, { yPercent: self.progress * 20 });
          }
        },
      });
      triggers.push(modelTrigger);

      // Fade out overlay text faster
      const overlayTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '30% top',
        scrub: 1,
        onUpdate: (self) => {
          if (overlayTextRef.current) {
            gsap.set(overlayTextRef.current, { opacity: 1 - self.progress });
          }
        },
      });
      triggers.push(overlayTrigger);

      // Cleanup function
      return () => {
        triggers.forEach((trigger) => trigger.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [hasHeroContent]);

  if (!hasHeroContent) return null;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-forest-dark"
      style={isConstructionHero ? { backgroundColor: 'rgb(203 204 199)' } : undefined}
    >
      {/* Layer 2: Big Text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-start justify-center pt-20 md:pt-24 lg:pt-28 z-[4] will-change-transform"
      >
        <h1
          className="px-4 text-center text-[11vw] md:text-[9vw] lg:text-[8vw] font-sans font-extrabold text-white/35 tracking-tighter leading-none select-none"
          style={isBuildWithUsText ? { color: 'rgb(13 19 16 / 0.85)' } : undefined}
        >
          {heroConfig.backgroundText}
        </h1>
      </div>

      {/* Layer 3: Full-bleed hero image */}
      {heroConfig.heroImage && (
        <div
          ref={modelRef}
          className="absolute inset-0 z-[8] will-change-transform"
        >
          <img
            src={heroConfig.heroImage}
            alt={heroConfig.heroImageAlt}
            className="w-full h-full object-cover object-[center_40%]"
            loading="eager"
          />
        </div>
      )}

      {/* Layer 4: Clean readability overlay */}
      <div className="absolute inset-0 z-[12] bg-gradient-to-b from-forest-dark/35 via-transparent to-forest-dark/70" />

      {/* Layer 5: Overlay Text */}
      {heroConfig.overlayText && (
        <div
          ref={overlayTextRef}
          className="absolute bottom-[24%] left-1/2 -translate-x-1/2 z-30 will-change-transform px-4"
        >
          <p
            className={
              isTrustedContractorText
                ? 'text-center font-sans text-sm md:text-base uppercase text-white/95 tracking-[0.14em] font-semibold'
                : 'text-center font-serif italic text-lg md:text-2xl text-white/95 tracking-wide'
            }
          >
            {heroConfig.overlayText}
          </p>
        </div>
      )}

      {/* Layer 6: Hero CTA buttons */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row items-center gap-4 px-4">
        <a
          href="#projects"
          className="px-7 py-3 bg-white text-forest-dark font-semibold rounded-full shadow-lg hover:bg-white/90 transition-colors duration-300"
        >
          View our work
        </a>
        <a
          href="#contact"
          className="px-7 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-forest-dark transition-colors duration-300"
        >
          Talk to an expert
        </a>
      </div>

      {/* Navigation hint */}
      <nav className="absolute top-0 left-0 right-0 z-40 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={navLogoSrc}
            alt={heroConfig.brandName || 'Company logo'}
            className="h-14 md:h-16 w-auto object-contain"
            loading="eager"
          />
        </div>
        {heroConfig.navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-body">
            {heroConfig.navLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors duration-300">{link.label}</a>
            ))}
          </div>
        )}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </section>
  );
}
