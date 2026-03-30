import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whyChooseMeConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  shouldAnimate: boolean;
}

function Counter({ end, suffix = '', duration = 2, shouldAnimate }: CounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!shouldAnimate) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newCount = Math.floor(easeProgress * end);

      if (newCount !== countRef.current) {
        countRef.current = newCount;
        setCount(newCount);
      }

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration, shouldAnimate]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function WhyChooseMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const wideRef = useRef<HTMLDivElement>(null);
  const [shouldAnimateStats, setShouldAnimateStats] = useState(false);
  /** Desktop: match feature grid height to stats panel */
  const [statsPanelHeightPx, setStatsPanelHeightPx] = useState<number | null>(null);
  const hasWhyChooseMeContent =
    Boolean(whyChooseMeConfig.titleRegular) ||
    whyChooseMeConfig.stats.length > 0 ||
    whyChooseMeConfig.featureCards.length > 0;

  useEffect(() => {
    if (!hasWhyChooseMeContent) return;

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

      const imageCards = cardsRef.current?.querySelectorAll('.feature-card-image');
      if (imageCards) {
        imageCards.forEach((card, i) => {
          const img = card.querySelector('img');

          ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
              gsap.set(card, { opacity: 1 });
              gsap.fromTo(
                card,
                { clipPath: 'inset(100% 0 0 0)' },
                {
                  clipPath: 'inset(0% 0% 0% 0%)',
                  duration: 1.2,
                  ease: 'power4.inOut',
                  delay: i * 0.15,
                }
              );
              if (img) {
                gsap.fromTo(
                  img,
                  { scale: 1.35 },
                  { scale: 1.1, duration: 1.6, ease: 'power3.out', delay: i * 0.15 }
                );
              }
            },
            once: true,
          });

          if (img) {
            gsap.fromTo(
              img,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5,
                },
              }
            );
          }
        });
      }

      const statsCard = cardsRef.current?.querySelector('.feature-card-stats');
      if (statsCard) {
        ScrollTrigger.create({
          trigger: statsCard,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(
              statsCard,
              { y: 80, opacity: 0 },
              { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
            );
          },
          once: true,
        });
      }

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 75%',
        onEnter: () => {
          setShouldAnimateStats(true);
        },
        once: true,
      });

      const wideWrap = wideRef.current;
      const wideImg = wideWrap?.querySelector('img');
      if (wideWrap) {
        ScrollTrigger.create({
          trigger: wideWrap,
          start: 'top 82%',
          onEnter: () => {
            gsap.set(wideWrap, { opacity: 1 });
            gsap.fromTo(
              wideWrap,
              { clipPath: 'inset(15% 5% 15% 5%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 1.4,
                ease: 'power4.inOut',
              }
            );
            if (wideImg) {
              gsap.fromTo(
                wideImg,
                { scale: 1.25 },
                { scale: 1.08, duration: 1.8, ease: 'power3.out' }
              );
            }
          },
          once: true,
        });

        if (wideImg) {
          gsap.fromTo(
            wideImg,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: wideWrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            }
          );
        }
      }

      const wideText = wideWrap?.querySelector('.wide-text-overlay');
      if (wideText) {
        ScrollTrigger.create({
          trigger: wideWrap,
          start: 'top 70%',
          onEnter: () => {
            gsap.fromTo(
              wideText,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6 }
            );
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [hasWhyChooseMeContent]);

  const showFeatureGrid = whyChooseMeConfig.featureCards.length > 0;
  const showStatsBlock = whyChooseMeConfig.stats.length > 0;
  const splitCardsRow = showFeatureGrid && showStatsBlock;

  useLayoutEffect(() => {
    if (!splitCardsRow) {
      setStatsPanelHeightPx(null);
      return;
    }

    const statsEl = statsRef.current;
    if (!statsEl) return;

    const mq = window.matchMedia('(min-width: 1024px)');
    let cancelled = false;

    const readHeight = () => {
      if (!statsEl.isConnected) return 0;
      return statsEl.getBoundingClientRect().height;
    };

    const sync = () => {
      if (cancelled || !mq.matches) {
        if (!cancelled) setStatsPanelHeightPx(null);
        return;
      }
      const h = readHeight();
      if (h > 0) {
        setStatsPanelHeightPx(Math.round(h));
      }
    };

    sync();

    const ro = new ResizeObserver(() => {
      sync();
    });
    ro.observe(statsEl);
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);

    // Fonts swapping metrics often grows the stats panel after first paint → cards looked like they "jump" taller
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      void fontsReady.then(() => {
        if (!cancelled) sync();
      });
    }

    return () => {
      cancelled = true;
      ro.disconnect();
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, [splitCardsRow, whyChooseMeConfig.stats.length]);

  if (!hasWhyChooseMeContent) return null;

  const lockFeatureHeight = splitCardsRow && statsPanelHeightPx != null;
  /** lg: collapse feature column until we know stats height — otherwise aspect-ratio cards inflate the row and skew measurement */
  const collapseFeaturesForMeasure = splitCardsRow && statsPanelHeightPx == null;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full py-24 md:py-32 bg-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={headerRef}
          id="process"
          className="text-center mb-16 md:mb-20 opacity-0 scroll-mt-24"
        >
          {whyChooseMeConfig.subtitle && (
            <p className="text-softblack/50 text-sm font-body uppercase tracking-widest mb-4">
              {whyChooseMeConfig.subtitle}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-softblack tracking-tight">
            {whyChooseMeConfig.titleRegular}{' '}
            <span className="font-serif italic font-normal">{whyChooseMeConfig.titleItalic}</span>
          </h2>
        </div>

        <div
          ref={cardsRef}
          className={`grid w-full grid-cols-1 gap-8 md:gap-10 box-border lg:items-stretch ${
            splitCardsRow
              ? 'lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)] lg:gap-x-8 xl:gap-x-10 lg:gap-y-0'
              : ''
          } ${lockFeatureHeight ? 'lg:grid-rows-[minmax(0,1fr)]' : ''}`}
          style={
            lockFeatureHeight && statsPanelHeightPx != null
              ? { height: statsPanelHeightPx }
              : undefined
          }
        >
          {showFeatureGrid && (
            <div
              className={`w-full min-w-0 lg:min-h-0 ${
                collapseFeaturesForMeasure ? 'lg:max-h-0 lg:overflow-hidden' : ''
              } ${lockFeatureHeight ? 'lg:h-full lg:max-h-full lg:overflow-hidden' : ''}`}
            >
              <div
                className={`grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${
                  lockFeatureHeight ? 'h-full min-h-0 grid-rows-2 auto-rows-fr' : ''
                }`}
              >
                {whyChooseMeConfig.featureCards.map((card, index) => (
                  <div
                    key={index}
                    className={`feature-card-image opacity-0 group min-w-0 ${
                      lockFeatureHeight ? 'h-full min-h-0' : ''
                    }`}
                  >
                    <div
                      className={`relative rounded-lg overflow-hidden bg-forest-dark ${
                        lockFeatureHeight ? 'h-full min-h-0' : 'aspect-[5/6]'
                      }`}
                    >
                      <img
                        src={card.image}
                        alt={card.imageAlt}
                        className={`w-full object-cover will-change-transform ${
                          lockFeatureHeight
                            ? 'absolute inset-0 h-full min-h-0'
                            : 'h-full'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/95 via-forest-dark/35 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 lg:bottom-6 lg:left-6 lg:right-6">
                        <p className="text-white font-sans font-semibold text-sm sm:text-base lg:text-lg mb-1 leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.65),0_2px_12px_rgba(0,0,0,0.45)]">
                          {card.title}
                        </p>
                        <p className="text-white/90 font-body text-xs sm:text-sm lg:text-sm leading-snug line-clamp-4 lg:line-clamp-none [text-shadow:0_1px_2px_rgba(0,0,0,0.6),0_2px_10px_rgba(0,0,0,0.4)]">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showStatsBlock && (
            <div
              ref={statsRef}
              className={`feature-card-stats w-full min-w-0 opacity-0 bg-offwhite rounded-lg p-8 md:p-10 flex flex-col justify-between text-center md:text-left ${
                splitCardsRow ? 'lg:p-5 xl:p-6' : 'lg:p-12'
              } ${lockFeatureHeight ? 'lg:h-full lg:min-h-0 lg:max-h-full' : 'h-full'}`}
            >
              <div className="w-full">
                {whyChooseMeConfig.statsLabel && (
                  <p
                    className={`text-softblack/50 font-body uppercase tracking-widest mb-6 md:mb-8 ${
                      splitCardsRow ? 'text-xs lg:text-[0.65rem] lg:leading-tight lg:tracking-wider' : 'text-sm'
                    }`}
                  >
                    {whyChooseMeConfig.statsLabel}
                  </p>
                )}
                <div
                  className={`grid w-full gap-6 sm:gap-y-8 ${
                    splitCardsRow
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-5'
                      : 'grid-cols-1 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10'
                  }`}
                >
                  {whyChooseMeConfig.stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center md:items-start border-b border-softblack/10 pb-5 last:border-b-0 sm:border-0 sm:pb-0 sm:last:border-0 ${
                        splitCardsRow ? 'lg:border-b lg:border-softblack/10 lg:pb-4 lg:last:border-b-0' : ''
                      }`}
                    >
                      <p
                        className={`font-sans font-bold text-softblack tracking-tight ${
                          splitCardsRow
                            ? 'text-4xl md:text-5xl lg:text-2xl xl:text-3xl'
                            : 'text-4xl md:text-5xl lg:text-5xl'
                        }`}
                      >
                        <Counter
                          end={stat.value}
                          suffix={stat.suffix}
                          shouldAnimate={shouldAnimateStats}
                        />
                      </p>
                      <p
                        className={`text-softblack/60 font-body mt-1 ${
                          splitCardsRow ? 'text-xs lg:text-[0.7rem] lg:leading-snug' : 'text-sm'
                        }`}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {whyChooseMeConfig.wideImage && (
          <div ref={wideRef} className="mt-16 md:mt-24 relative rounded-lg overflow-hidden group opacity-0">
            <div className="aspect-[21/9] md:aspect-[3/1] overflow-hidden">
              <img
                src={whyChooseMeConfig.wideImage}
                alt={whyChooseMeConfig.wideImageAlt}
                className="w-full h-full object-cover will-change-transform"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/85 md:from-forest-dark/60 via-forest-dark/35 md:via-transparent to-transparent" />
            {(whyChooseMeConfig.wideTitle || whyChooseMeConfig.wideDescription) && (
              <div className="wide-text-overlay absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-md opacity-0">
                {whyChooseMeConfig.wideTitle && (
                  <p className="text-white font-sans font-bold text-2xl md:text-3xl mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)]">
                    {whyChooseMeConfig.wideTitle}
                  </p>
                )}
                {whyChooseMeConfig.wideDescription && (
                  <p className="text-white/90 md:text-white/70 font-body text-sm md:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                    {whyChooseMeConfig.wideDescription}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
