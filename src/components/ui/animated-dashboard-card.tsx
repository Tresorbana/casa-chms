"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedStatsCardProps {
  title?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryValue?: number;
  secondaryValue?: number;
  primaryTrend?: string;
  secondaryTrend?: string;
  currencyPrefix?: string;
  outerDotsCount?: number;
  innerDotsCount?: number;
  enableAnimations?: boolean;
  onMoreDetails?: () => void;
}

const defaultProps: Partial<AnimatedStatsCardProps> = {
  title: "Revenue Overview",
  primaryLabel: "Room Revenue",
  secondaryLabel: "Services",
  primaryValue: 1250000,
  secondaryValue: 375000,
  primaryTrend: "+15.2%",
  secondaryTrend: "+8.7%",
  currencyPrefix: "RWF",
  outerDotsCount: 48,
  innerDotsCount: 36,
  enableAnimations: true,
};

export function AnimatedStatsCard(props: AnimatedStatsCardProps) {
  const {
    title,
    primaryLabel,
    secondaryLabel,
    primaryValue,
    secondaryValue,
    primaryTrend,
    secondaryTrend,
    currencyPrefix,
    outerDotsCount,
    innerDotsCount,
    enableAnimations,
    onMoreDetails,
  } = { ...defaultProps, ...props };

  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const generateDots = (
    count: number,
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.round((centerX + radius * Math.cos(angle)) * 1000) / 1000;
      const y = Math.round((centerY + radius * Math.sin(angle)) * 1000) / 1000;
      dots.push({ x, y, delay: i * 0.02 });
    }
    return dots;
  };

  const outerDots = generateDots(outerDotsCount!, 185, 203, 200);
  const innerDots = generateDots(innerDotsCount!, 155, 203, 200);

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 0.7,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const total = (primaryValue! + secondaryValue!).toLocaleString();

  return (
    <motion.div
      className="w-full"
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <div className="bg-[#0a0a0a] border border-gold/15 rounded-[2rem] overflow-hidden shadow-xl shadow-black/40 relative">
        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Dots section */}
        <div className="relative pl-4 pr-8 pb-4 pt-8 overflow-hidden">
          <div className="relative w-full max-w-[28rem] h-[22rem] mx-auto">
            <svg className="w-full h-full" viewBox="0 0 448 400">
              {outerDots.map((dot, index) => (
                <motion.circle
                  key={`outer-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="9"
                  fill="#D4AF37"
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}
              {innerDots.map((dot, index) => (
                <motion.circle
                  key={`inner-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="9"
                  fill="#F0C040"
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ marginTop: '-4rem', marginLeft: '-2rem' }}>
              <div className="text-center" style={{ zIndex: 20 }}>
                <motion.div
                  className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em] mb-2"
                  initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 25 }}
                >
                  TOTAL
                </motion.div>
                <motion.div
                  className="text-4xl font-black italic text-gold tracking-tighter leading-none"
                  initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.8, filter: "blur(4px)" } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 28 }}
                >
                  {total}
                </motion.div>
                {currencyPrefix && (
                  <motion.div
                    className="text-[10px] font-bold text-gold/50 uppercase tracking-widest mt-1"
                    initial={shouldAnimate ? { opacity: 0 } : {}}
                    animate={shouldAnimate ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 }}
                  >
                    {currencyPrefix}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Gradient fade overlay */}
          <div
            className="absolute -inset-4 pointer-events-none rounded-[2rem]"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(10,10,10,0.75) 40%, rgba(10,10,10,0.95) 55%, rgba(10,10,10,1) 65%)",
              zIndex: 5,
            }}
          />

          {/* Bottom stats */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-2" style={{ zIndex: 10 }}>
            <div className="flex items-start justify-between mb-4">
              {/* Primary stat */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-0.5 h-4 rounded-full bg-gold"
                    initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                    animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ delay: 0.4, type: "spring" }}
                  />
                  <motion.span
                    className="text-[10px] font-bold text-white/40 uppercase tracking-widest"
                    initial={shouldAnimate ? { opacity: 0, y: 10 } : {}}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    {primaryLabel}
                  </motion.span>
                </div>
                <motion.div
                  className="text-xl font-black italic text-gold"
                  initial={shouldAnimate ? { opacity: 0, y: -10 } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  {primaryValue!.toLocaleString()}
                </motion.div>
                <motion.div
                  className="text-xs font-bold text-gold/60"
                  initial={shouldAnimate ? { opacity: 0 } : {}}
                  animate={shouldAnimate ? { opacity: 1 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  {primaryTrend}
                </motion.div>
              </div>

              {/* Secondary stat */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-0.5 h-4 rounded-full bg-gold-light"
                    initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                    animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                    transition={{ delay: 0.8, type: "spring" }}
                  />
                  <motion.span
                    className="text-[10px] font-bold text-white/40 uppercase tracking-widest"
                    initial={shouldAnimate ? { opacity: 0, y: 10 } : {}}
                    animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9 }}
                  >
                    {secondaryLabel}
                  </motion.span>
                </div>
                <motion.div
                  className="text-xl font-black italic text-gold-light"
                  initial={shouldAnimate ? { opacity: 0, y: -10 } : {}}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.0 }}
                >
                  {secondaryValue!.toLocaleString()}
                </motion.div>
                <motion.div
                  className="text-xs font-bold text-gold-light/60"
                  initial={shouldAnimate ? { opacity: 0 } : {}}
                  animate={shouldAnimate ? { opacity: 1 } : {}}
                  transition={{ delay: 1.1 }}
                >
                  {secondaryTrend}
                </motion.div>
              </div>
            </div>

            <motion.button
              className="w-full bg-transparent border border-gold/20 hover:bg-gold/10 hover:border-gold/40 text-gold/70 hover:text-gold px-4 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
              initial={shouldAnimate ? { opacity: 0, y: 20 } : {}}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1 }}
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              onClick={onMoreDetails}
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
