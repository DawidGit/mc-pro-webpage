import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { testimonialsConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasTestimonialsContent =
    Boolean(testimonialsConfig.titleRegular) || testimonialsConfig.testimonials.length > 0;

  useEffect(() => {
    if (!hasTestimonialsContent) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
          );
        },
        once: true,
      });

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(
            gridRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
          );
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasTestimonialsContent]);

  if (!hasTestimonialsContent) return null;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-20">
        <div ref={headerRef} className="text-center opacity-0">
          {testimonialsConfig.subtitle && (
            <p className="text-softblack/50 text-sm font-body uppercase tracking-widest mb-4">
              {testimonialsConfig.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-softblack tracking-tight">
            {testimonialsConfig.titleRegular}{' '}
            <span className="font-serif italic font-normal text-softblack/70">
              {testimonialsConfig.titleItalic}
            </span>
          </h2>
        </div>
      </div>

      <div ref={gridRef} className="max-w-7xl mx-auto px-6 md:px-12 opacity-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonialsConfig.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group bg-offwhite rounded-lg p-8 md:p-10 h-full transition-all duration-500 hover:bg-forest-dark hover:text-white"
            >
              <Quote
                className="w-10 h-10 text-softblack/10 group-hover:text-white/20 mb-6 transition-colors duration-500"
                strokeWidth={1}
              />

              <p className="text-softblack/80 group-hover:text-white/90 font-body text-base md:text-lg leading-relaxed mb-8 transition-colors duration-500">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="font-sans font-semibold text-softblack group-hover:text-white transition-colors duration-500">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-softblack/50 group-hover:text-white/60 font-body transition-colors duration-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="h-px bg-gradient-to-r from-transparent via-softblack/10 to-transparent" />
      </div>
    </section>
  );
}
