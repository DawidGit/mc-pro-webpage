// Site Configuration
// General Contractor Website - Illinois Commercial Construction

export interface SiteConfig {
  language: string;
  siteTitle: string;
  siteDescription: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
  siteTitle: "Summit Commercial Construction | Illinois General Contractor",
  siteDescription: "Premier commercial construction and general contracting services in Illinois. Specializing in retail buildouts, office renovations, and industrial facilities. Licensed, bonded, and committed to excellence.",
};

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

// Hero Section
export interface HeroConfig {
  backgroundText: string;
  heroImage: string;
  heroImageAlt: string;
  overlayText: string;
  brandName: string;
  navLinks: { label: string; href: string }[];
}

export const heroConfig: HeroConfig = {
  backgroundText: "Build with us",
  heroImage: assetPath("/hero-construction2.png"),
  heroImageAlt: "High-rise commercial construction with cranes and reinforced concrete structure",
  overlayText: "Illinois Trusted General Contractor Since 2008",
  brandName: "SUMMIT",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
};

// Intro Grid Section - Trust & Proof
export interface PortfolioImage {
  src: string;
  alt: string;
}

export interface IntroGridConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  portfolioImages: PortfolioImage[];
  accentText: string;
}

export const introGridConfig: IntroGridConfig = {
  titleLine1: "Building Excellence",
  titleLine2: "Across Illinois",
  description: "From Chicago to Springfield, we deliver commercial construction projects that stand the test of time. Our commitment to quality craftsmanship, on-time delivery, and transparent communication has made us the preferred general contractor for corporations, retail chains, and property management companies throughout the Midwest.",
  portfolioImages: [
    { src: assetPath("/project-retail-1.jpg"), alt: "Modern retail storefront construction completed in Naperville, Illinois" },
    { src: assetPath("/project-office-1.jpg"), alt: "Corporate office interior renovation in downtown Chicago" },
    { src: assetPath("/project-industrial-1.jpg"), alt: "Industrial warehouse facility construction in Rockford" },
    { src: assetPath("/project-medical-1.jpg"), alt: "Medical office buildout with modern finishes" },
    { src: assetPath("/project-restaurant-1.jpg"), alt: "Restaurant renovation project with custom fixtures" },
  ],
  accentText: "Licensed in Illinois • Fully Insured • OSHA Compliant",
};

// Featured Projects Section
export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  galleryImages: string[];
  highlights: string[];
}

export interface FeaturedProjectsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  viewAllText: string;
  viewAllHref: string;
  viewProjectText: string;
  projects: Project[];
}

export const featuredProjectsConfig: FeaturedProjectsConfig = {
  subtitle: "Featured Work",
  titleRegular: "Recent",
  titleItalic: "Projects",
  viewAllText: "View All Projects",
  viewAllHref: "#projects",
  viewProjectText: "View Project Details",
  projects: [
    {
      id: 1,
      title: "Westfield Retail Center",
      category: "Retail Construction",
      year: "2024",
      image: assetPath("/featured-retail-center.jpg"),
      description: "A 45,000 sq ft retail plaza featuring three anchor tenants, modern facades, and energy-efficient systems. Completed on schedule and under budget for a national property developer.",
      galleryImages: [
        assetPath("/featured-retail-center.jpg"),
        assetPath("/project-retail-1.jpg"),
        assetPath("/project-restaurant-1.jpg"),
      ],
      highlights: [
        "45,000 sq ft multi-tenant retail plaza",
        "Delivered ahead of schedule with active site coordination",
        "Energy-efficient systems integrated across core spaces",
      ],
    },
    {
      id: 2,
      title: "Meridian Office Complex",
      category: "Commercial Renovation",
      year: "2023",
      image: assetPath("/featured-office-complex.jpg"),
      description: "Complete interior renovation of a 12-story office building in Chicago's Loop. Included lobby modernization, tenant improvements, and HVAC upgrades serving 50+ corporate clients.",
      galleryImages: [
        assetPath("/featured-office-complex.jpg"),
        assetPath("/project-office-1.jpg"),
        assetPath("/project-medical-1.jpg"),
      ],
      highlights: [
        "12-story renovation in occupied commercial environment",
        "Phased execution to minimize tenant disruption",
        "Modernized lobby, HVAC systems, and shared amenities",
      ],
    },
    {
      id: 3,
      title: "Prairie Industrial Park",
      category: "Industrial Facility",
      year: "2023",
      image: assetPath("/featured-industrial.jpg"),
      description: "New construction of a 200,000 sq ft distribution facility with loading docks, climate-controlled storage, and state-of-the-art fire suppression systems for a logistics leader.",
      galleryImages: [
        assetPath("/featured-industrial.jpg"),
        assetPath("/project-industrial-1.jpg"),
        assetPath("/team-wide.jpg"),
      ],
      highlights: [
        "200,000 sq ft logistics-ready industrial facility",
        "Integrated loading, storage, and circulation zones",
        "Advanced fire safety and climate-control infrastructure",
      ],
    },
  ],
};

// Services Section
export interface ServiceItem {
  iconName: string;
  title: string;
  description: string;
}

export interface ServicesConfig {
  subtitle: string;
  titleLine1: string;
  titleLine2Italic: string;
  description: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  subtitle: "What We Offer",
  titleLine1: "Commercial",
  titleLine2Italic: "Construction Services",
  description: "Full-service general contracting for commercial projects of any scale. From initial planning to final walkthrough, we manage every detail with precision and professionalism.",
  services: [
    {
      iconName: "Building2",
      title: "General Contracting",
      description: "Complete project management including permitting, subcontractor coordination, quality control, and on-site supervision for seamless project delivery.",
    },
    {
      iconName: "Store",
      title: "Retail Buildouts",
      description: "Fast-track construction for retail chains, franchise locations, and shopping centers with minimal disruption to surrounding businesses.",
    },
    {
      iconName: "Briefcase",
      title: "Office Renovations",
      description: "Modern workspace transformations including open floor plans, conference facilities, and technology infrastructure for today's hybrid work environments.",
    },
    {
      iconName: "Factory",
      title: "Industrial Construction",
      description: "Warehouses, distribution centers, and manufacturing facilities built to your specifications with attention to workflow efficiency and safety compliance.",
    },
  ],
};

// Why Choose Me Section - Repurposed as Process/About Section
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FeatureCard {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

export interface WhyChooseMeConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  statsLabel: string;
  stats: StatItem[];
  featureCards: FeatureCard[];
  wideImage: string;
  wideImageAlt: string;
  wideTitle: string;
  wideDescription: string;
}

export const whyChooseMeConfig: WhyChooseMeConfig = {
  subtitle: "Why Choose Summit",
  titleRegular: "Proven",
  titleItalic: "Excellence",
  statsLabel: "By The Numbers",
  stats: [
    { value: 16, suffix: "+", label: "Years in Business" },
    { value: 350, suffix: "+", label: "Projects Completed" },
    { value: 98, suffix: "%", label: "On-Time Delivery" },
    { value: 50, suffix: "M+", label: "Sq Ft Built" },
  ],
  featureCards: [
    {
      image: assetPath("/value-safety.jpg"),
      imageAlt: "Construction workers following safety protocols on job site",
      title: "Safety First",
      description: "Zero lost-time accidents in the past 3 years. Our comprehensive safety program protects workers, clients, and the public on every project.",
    },
    {
      image: assetPath("/value-quality.jpg"),
      imageAlt: "Quality craftsmanship detail on finished construction work",
      title: "Uncompromising Quality",
      description: "Rigorous quality control at every phase. We partner with trusted suppliers and skilled tradespeople to deliver lasting results.",
    },
  ],
  wideImage: assetPath("/team-wide.jpg"),
  wideImageAlt: "Summit Construction team meeting at project site",
  wideTitle: "Your Vision, Our Expertise",
  wideDescription: "We believe in building relationships as strong as our structures. From the first consultation to project completion, you'll have a dedicated team focused on your success.",
};

// Testimonials Section
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface TestimonialsConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  testimonials: Testimonial[];
}

export const testimonialsConfig: TestimonialsConfig = {
  subtitle: "Client Stories",
  titleRegular: "Trusted By",
  titleItalic: "Industry Leaders",
  testimonials: [
    {
      id: 1,
      name: "Michael Richardson",
      role: "VP of Development, Westfield Properties",
      image: assetPath("/testimonial-1.jpg"),
      quote: "Summit Commercial delivered our retail center two weeks ahead of schedule. Their communication was exceptional, and the quality exceeded our expectations. They've become our go-to contractor for all Illinois projects.",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Facilities Director, Meridian Corp",
      image: assetPath("/testimonial-2.jpg"),
      quote: "The office renovation was complex with multiple tenants remaining operational. Summit managed the logistics flawlessly and minimized disruption. Professional team from start to finish.",
    },
    {
      id: 3,
      name: "David Martinez",
      role: "COO, Prairie Logistics",
      image: assetPath("/testimonial-3.jpg"),
      quote: "Our distribution facility required specialized loading systems and climate control. Summit understood our operational needs and delivered a facility that improved our efficiency by 30%.",
    },
  ],
};

// FAQ Section
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  ctaText: string;
  ctaButtonText: string;
  ctaHref: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  subtitle: "Common Questions",
  titleRegular: "Frequently",
  titleItalic: "Asked Questions",
  ctaText: "Still have questions about your project?",
  ctaButtonText: "Talk to Our Team",
  ctaHref: "#contact",
  faqs: [
    {
      id: "faq-1",
      question: "What types of commercial projects do you handle?",
      answer: "We specialize in retail buildouts, office renovations, industrial facilities, medical offices, restaurants, and multi-tenant commercial properties. Our team has experience with projects ranging from 5,000 to 500,000+ square feet across Illinois.",
    },
    {
      id: "faq-2",
      question: "Are you licensed and insured in Illinois?",
      answer: "Yes, we are fully licensed as a general contractor in Illinois and maintain comprehensive general liability, workers' compensation, and builder's risk insurance. We're happy to provide certificates of insurance upon request.",
    },
    {
      id: "faq-3",
      question: "How do you handle project timelines and budgets?",
      answer: "We provide detailed schedules and transparent pricing before work begins. Our project management team uses industry-leading software to track progress, manage change orders, and keep you informed every step of the way.",
    },
    {
      id: "faq-4",
      question: "Do you offer design-build services?",
      answer: "Yes, we offer design-build services that streamline the construction process by combining design and construction under one contract. This approach often reduces timelines and costs while improving communication.",
    },
    {
      id: "faq-5",
      question: "What areas of Illinois do you serve?",
      answer: "We serve the entire state of Illinois with a focus on the Chicago metropolitan area, Rockford, Peoria, Springfield, and surrounding regions. We're equipped to handle projects anywhere in the Midwest.",
    },
  ],
};

// Footer Section
export interface SocialLink {
  iconName: string;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  logoText: string;
  contactLabel: string;
  email: string;
  locationText: string;
  navigationLabel: string;
  navLinks: FooterLink[];
  socialLabel: string;
  socialLinks: SocialLink[];
  tagline: string;
  copyright: string;
  bottomLinks: FooterLink[];
}

export const footerConfig: FooterConfig = {
  logoText: "SUMMIT",
  contactLabel: "Get in Touch",
  email: "info@summitcommercial-il.com",
  locationText: "2450 Warrenville Road\nSuite 300\nDowners Grove, IL 60515",
  navigationLabel: "Navigation",
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  socialLabel: "Follow Us",
  socialLinks: [
    { iconName: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
    { iconName: "Instagram", href: "https://instagram.com", label: "Instagram" },
    { iconName: "Facebook", href: "https://facebook.com", label: "Facebook" },
  ],
  tagline: "Building Illinois\nOne Project at a Time",
  copyright: "© 2024 Summit Commercial Construction. All rights reserved.",
  bottomLinks: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Licenses", href: "#licenses" },
  ],
};

// Contact Section (New)
export interface ContactConfig {
  subtitle: string;
  titleRegular: string;
  titleItalic: string;
  description: string;
  phone: string;
  phoneLabel: string;
  email: string;
  emailLabel: string;
  address: string;
  addressLabel: string;
  hours: string;
  hoursLabel: string;
  formTitle: string;
  formDescription: string;
  mapEmbedUrl: string;
}

export const contactConfig: ContactConfig = {
  subtitle: "Start Your Project",
  titleRegular: "Let's",
  titleItalic: "Connect",
  description: "Ready to start your commercial construction project? Contact us for a free consultation and estimate. Our team is ready to bring your vision to life.",
  phone: "(630) 555-0147",
  phoneLabel: "Phone",
  email: "info@summitcommercial-il.com",
  emailLabel: "Email",
  address: "2450 Warrenville Road, Suite 300\nDowners Grove, IL 60515",
  addressLabel: "Office",
  hours: "Monday – Friday: 7:00 AM – 5:00 PM\nSaturday: By Appointment",
  hoursLabel: "Hours",
  formTitle: "Request a Consultation",
  formDescription: "Fill out the form below and our team will respond within 24 business hours.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2974.1234567890123!2d-88.0123456!3d41.7890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQ3JzIwLjQiTiA4OMKwMDAnNDQuNSJX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
};
