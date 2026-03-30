import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2,
  Camera,
  ClipboardList,
  Diamond,
  Home,
  PenLine,
  Sparkles,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { servicesConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Camera,
  ClipboardList,
  Diamond,
  Home,
  PenLine,
  Sparkles,
  Users,
  Wrench,
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasServicesContent =
    Boolean(servicesConfig.titleLine1 || servicesConfig.titleLine2Italic) ||
    servicesConfig.services.length > 0;

  useEffect(() => {
    if (!hasServicesContent) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headingRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headingRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      const cards = gridRef.current?.querySelectorAll('.service-card');
      if (cards) {
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: 'top 78%',
          onEnter: () => {
            gsap.fromTo(
              cards,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.12,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hasServicesContent]);

  if (!hasServicesContent) return null;

  const serviceCount = servicesConfig.services.length;
  const gridFillTwoCol = serviceCount % 2 === 0 ? 0 : 1;
  const gridFillThreeCol = (3 - (serviceCount % 3)) % 3;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full py-24 md:py-32 bg-forest-dark scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div ref={headingRef} className="opacity-0 mb-12 md:mb-16 lg:mb-20">
          {servicesConfig.subtitle && (
            <p className="text-white/50 text-sm font-body uppercase tracking-widest mb-4">
              {servicesConfig.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight max-w-4xl">
            {servicesConfig.titleLine1 && (
              <span className="font-sans font-bold text-white tracking-tight">
                {servicesConfig.titleLine1}
              </span>
            )}
            {servicesConfig.titleLine1 && servicesConfig.titleLine2Italic ? ' ' : null}
            {servicesConfig.titleLine2Italic && (
              <span className="font-serif italic font-normal text-white/80">
                {servicesConfig.titleLine2Italic}
              </span>
            )}
          </h2>
          {servicesConfig.description && (
            <p className="mt-6 text-white/60 font-body text-base md:text-lg max-w-3xl leading-relaxed">
              {servicesConfig.description}
            </p>
          )}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-white/10 w-full"
        >
          {servicesConfig.services.map((service, index) => {
            const Icon = iconMap[service.iconName] || Camera;
            return (
              <div
                key={index}
                className="service-card group bg-forest-dark p-6 md:p-8 opacity-0 transition-all duration-500 hover:bg-forest-mid cursor-pointer h-full"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-white/70 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-sans font-semibold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-white/50 font-body leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                  {service.description}
                </p>
                {service.bullets && service.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2 text-sm text-white/45 font-body leading-snug group-hover:text-white/65 transition-colors duration-300 list-disc pl-4 marker:text-white/35">
                    {service.bullets.map((item, bulletIndex) => (
                      <li key={`${index}-${bulletIndex}`}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
          {Array.from({ length: gridFillTwoCol }).map((_, i) => (
            <div
              key={`grid-pad-2-${i}`}
              className="hidden sm:block xl:hidden bg-forest-dark"
              aria-hidden
            />
          ))}
          {Array.from({ length: gridFillThreeCol }).map((_, i) => (
            <div
              key={`grid-pad-3-${i}`}
              className="hidden xl:block bg-forest-dark"
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
