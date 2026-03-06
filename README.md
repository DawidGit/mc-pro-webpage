# Summit Commercial Construction Website

A modern, production-ready corporate website for an Illinois-based general contractor company. Built with React, TypeScript, Vite, and Tailwind CSS. Deployed using Docker and Nginx.

## Features

- **Modern Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **SEO Optimized**: Meta tags, JSON-LD schema, semantic HTML
- **Performance**: Lazy loading, code splitting, optimized assets
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Responsive**: Mobile-first design, works on all devices
- **Animations**: GSAP ScrollTrigger, smooth scroll with Lenis
- **Security**: Security headers, CSP, rate limiting
- **Dockerized**: Multi-stage build, production-ready Nginx

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Docker (for production deployment)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd gc-illinois-site

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker compose up -d --build

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

## Project Structure

```
gc-illinois-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── public/                     # Static assets
│   ├── *.jpg                   # Project images
│   ├── *.png                   # Hero and feature images
│   └── favicon.svg             # Site favicon
├── src/
│   ├── sections/               # Page sections
│   │   ├── Hero.tsx            # Hero with parallax
│   │   ├── IntroGrid.tsx       # Trust/Proof section
│   │   ├── Services.tsx        # Services grid
│   │   ├── WhyChooseMe.tsx     # Stats and features
│   │   ├── FeaturedProjects.tsx # Project showcase
│   │   ├── Testimonials.tsx    # Client testimonials
│   │   ├── FAQ.tsx             # FAQ accordion
│   │   ├── Contact.tsx         # Contact form
│   │   └── Footer.tsx          # Site footer
│   ├── components/ui/          # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── config.ts               # Site configuration
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Docker Compose config
├── nginx.conf                  # Nginx main config
├── nginx-site.conf             # Nginx site config
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

## Configuration

All site content is configured in `src/config.ts`. Edit this file to customize:

- Company information
- Navigation links
- Project details
- Services offered
- Testimonials
- FAQ items
- Contact information

## SEO Features

- **Meta Tags**: Title, description, keywords, Open Graph, Twitter Cards
- **JSON-LD Schema**: LocalBusiness and GeneralContractor structured data
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Accessibility**: Alt text, ARIA labels, keyboard navigation
- **Performance**: Lazy loading, optimized images, code splitting

## Security Features

- **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Rate Limiting**: Configured in Nginx for API endpoints
- **Docker Security**: Non-root user, minimal base image
- **Input Validation**: Form validation on contact page

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Ubuntu VPS

1. Set up VPS with Docker and Docker Compose
2. Upload project files
3. Run `docker compose up -d --build`
4. Configure SSL with Let's Encrypt

### GitHub Actions CI/CD

The included workflow automatically deploys on push to main branch:

1. Build and test
2. Security scan
3. Deploy to VPS via SSH
4. Run smoke tests

Required secrets:
- `VPS_HOST`: Your VPS IP or domain
- `VPS_USER`: SSH username
- `VPS_SSH_KEY`: Private SSH key

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Proprietary - Summit Commercial Construction

## Support

For technical support or questions about this website, contact the development team.
