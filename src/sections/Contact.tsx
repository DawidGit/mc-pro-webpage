import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Clock, Send, AlertCircle } from 'lucide-react';
import { contactConfig } from '../config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!contactConfig.titleRegular) return null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
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

      // Content animation
      const contactItems = contentRef.current?.querySelectorAll('.contact-item');
      if (contactItems && contactItems.length > 0) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 78%',
          onEnter: () => {
            gsap.fromTo(
              contactItems,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.1,
              }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - in production, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    setFormState({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      message: '',
    });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full py-24 md:py-32 bg-forest-dark"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          {contactConfig.subtitle && (
            <p className="text-white/60 text-sm font-body uppercase tracking-widest mb-4">
              {contactConfig.subtitle}
            </p>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight leading-tight">
            {contactConfig.titleRegular}{' '}
            <span className="font-serif italic font-normal text-white/75">
              {contactConfig.titleItalic}
            </span>
          </h2>
          {contactConfig.description && (
            <p className="mt-6 text-white/70 font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {contactConfig.description}
            </p>
          )}
        </div>

        {/* Content Grid */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="flex flex-col gap-6">
              <div className="contact-item bg-forest-mid/45 p-6 rounded-lg shadow-sm border border-white/10 opacity-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white/75" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-body text-white/55 uppercase tracking-wider mb-1">
                      {contactConfig.phoneLabel}
                    </p>
                    <a 
                      href={`tel:${contactConfig.phone.replace(/\D/g, '')}`}
                      className="text-lg font-sans font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      {contactConfig.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-item bg-forest-mid/45 p-6 rounded-lg shadow-sm border border-white/10 opacity-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white/75" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-body text-white/55 uppercase tracking-wider mb-1">
                      {contactConfig.emailLabel}
                    </p>
                    <a 
                      href={`mailto:${contactConfig.email}`}
                      className="text-lg font-sans font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      {contactConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-item bg-forest-mid/45 p-6 rounded-lg shadow-sm border border-white/10 opacity-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white/75" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-body text-white/55 uppercase tracking-wider mb-1">
                      {contactConfig.addressLabel}
                    </p>
                    <p className="text-base font-body text-white/85 whitespace-pre-line">
                      {contactConfig.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-item bg-forest-mid/45 p-6 rounded-lg shadow-sm border border-white/10 opacity-0">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white/75" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-body text-white/55 uppercase tracking-wider mb-1">
                      {contactConfig.hoursLabel}
                    </p>
                    <p className="text-base font-body text-white/85 whitespace-pre-line">
                      {contactConfig.hours}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-item bg-forest-mid/45 rounded-lg shadow-sm border border-white/10 overflow-hidden opacity-0">
              <div className="aspect-video w-full">
                <iframe
                  src={contactConfig.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Summit Commercial Construction Office Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="contact-item bg-forest-mid/45 p-8 md:p-10 rounded-lg shadow-sm border border-white/10 opacity-0">
            <h3 className="text-2xl font-sans font-bold text-white mb-2">
              {contactConfig.formTitle}
            </h3>
            <p className="text-white/70 font-body mb-8">
              {contactConfig.formDescription}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-body text-white/70">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="bg-forest-dark/60 border-white/15 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-body text-white/70">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                    className="bg-forest-dark/60 border-white/15 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-body text-white/70">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formState.phone}
                    onChange={handleInputChange}
                    placeholder="(630) 555-0147"
                    className="bg-forest-dark/60 border-white/15 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-body text-white/70">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formState.company}
                    onChange={handleInputChange}
                    placeholder="Your Company LLC"
                    className="bg-forest-dark/60 border-white/15 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-sm font-body text-white/70">
                  Project Type
                </Label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formState.projectType}
                  onChange={handleInputChange}
                  className="w-full h-10 px-3 rounded-md bg-forest-dark/60 border border-white/15 text-white text-sm focus:border-white/35 focus:ring-1 focus:ring-white/20 focus:outline-none"
                >
                  <option value="">Select a project type</option>
                  <option value="retail">Retail Buildout</option>
                  <option value="office">Office Renovation</option>
                  <option value="industrial">Industrial/Warehouse</option>
                  <option value="medical">Medical Facility</option>
                  <option value="restaurant">Restaurant/Food Service</option>
                  <option value="other">Other Commercial Project</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-body text-white/70">
                  Project Details <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formState.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your project timeline, budget range, and any specific requirements..."
                  rows={5}
                  className="bg-forest-dark/60 border-white/15 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20 resize-none"
                />
              </div>

              {/* CAPTCHA Placeholder - In production, integrate with Google reCAPTCHA or hCaptcha */}
              <div className="p-4 bg-forest-dark/50 rounded-lg border border-dashed border-white/20">
                <div className="flex items-center gap-3 text-white/55">
                  <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm font-body">
                    CAPTCHA verification will appear here in production
                  </span>
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-300/25 rounded-lg">
                  <p className="text-green-100/90 font-body text-sm">
                    Thank you! Your message has been sent successfully. We'll respond within 24 business hours.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-300/25 rounded-lg">
                  <p className="text-red-100/90 font-body text-sm">
                    Something went wrong. Please try again or call us directly.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white/10 border border-white/20 hover:bg-white/15 text-white font-sans font-semibold py-6 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
