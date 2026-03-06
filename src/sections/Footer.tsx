import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Twitter, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { footerConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
  Instagram,
  Twitter,
  Linkedin,
  Mail,
};

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerLogoSrc = `${import.meta.env.BASE_URL}mc-pro-logo-footer.png`;
  const hasFooterContent = Boolean(footerConfig.email) || footerConfig.navLinks.length > 0;

  useEffect(() => {
    if (!hasFooterContent) return;

    const ctx = gsap.context(() => {
      // Content — fade up
      ScrollTrigger.create({
        trigger: contentRef.current,
        start: 'top 88%',
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
          );
        },
        once: true,
      });
    }, footerRef);

    return () => ctx.revert();
  }, [hasFooterContent]);

  if (!hasFooterContent) return null;

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative w-full bg-white pt-24 md:pt-32 pb-8 overflow-hidden"
      style={{ color: 'rgb(26 26 26)' }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Footer Content */}
        <div ref={contentRef} className="opacity-0">
          <div className="mb-6 md:mb-8 grid md:grid-cols-3">
            <img
              src={footerLogoSrc}
              alt="MC Pro, Inc. logo"
              className="h-20 md:h-24 w-auto object-contain mx-auto md:mx-0 md:col-start-2"
              loading="lazy"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-16">
            {/* Contact Info */}
            <div>
              {footerConfig.contactLabel && (
                <p className="text-[rgb(26_26_26)] text-sm font-body uppercase tracking-widest mb-4">
                  {footerConfig.contactLabel}
                </p>
              )}
              {footerConfig.email && (
                <a
                  href={`mailto:${footerConfig.email}`}
                  className="text-base md:text-lg font-sans font-semibold text-[rgb(26_26_26)] hover:text-[rgb(26_26_26)] transition-colors duration-300"
                >
                  {footerConfig.email}
                </a>
              )}
              {footerConfig.locationText && (
                <p className="mt-4 text-[rgb(26_26_26)] font-body text-sm whitespace-pre-line">
                  {footerConfig.locationText}
                </p>
              )}
            </div>

            {/* Navigation */}
            {footerConfig.navLinks.length > 0 && (
              <div>
                {footerConfig.navigationLabel && (
                  <p className="text-[rgb(26_26_26)] text-sm font-body uppercase tracking-widest mb-4">
                    {footerConfig.navigationLabel}
                  </p>
                )}
                <nav className="space-y-3">
                  {footerConfig.navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-[rgb(26_26_26)] hover:text-[rgb(26_26_26)] font-body transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Social Links */}
            <div>
              {footerConfig.socialLabel && (
                <p className="text-[rgb(26_26_26)] text-sm font-body uppercase tracking-widest mb-4">
                  {footerConfig.socialLabel}
                </p>
              )}
              {footerConfig.socialLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {footerConfig.socialLinks.map((social) => {
                    const Icon = iconMap[social.iconName] || Mail;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        aria-label={social.label}
                        className="w-10 h-10 rounded-full bg-offwhite flex items-center justify-center text-[rgb(26_26_26)] hover:bg-forest-dark hover:text-white transition-all duration-300"
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </a>
                    );
                  })}
                </div>
              )}
              {footerConfig.tagline && (
                <p className="mt-6 text-[rgb(26_26_26)] font-body text-sm whitespace-pre-line">
                  {footerConfig.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-softblack/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[rgb(26_26_26)] font-body text-sm">
              {footerConfig.copyright || `\u00A9 ${new Date().getFullYear()} All rights reserved.`}
            </p>
            {footerConfig.bottomLinks.length > 0 && (
              <div className="flex items-center gap-6 text-[rgb(26_26_26)] font-body text-sm">
                {footerConfig.bottomLinks.map((link) => (
                  <a key={link.label} href={link.href} className="hover:text-[rgb(26_26_26)] transition-colors duration-300">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-offwhite to-transparent pointer-events-none" />
    </footer>
  );
}
