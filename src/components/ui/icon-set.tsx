import * as React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface IconGridItem {
  id: string;
  icon: React.ReactNode;
  name: string;
}

export interface IconGridProps {
  items: IconGridItem[];
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 12 },
  },
};

const IconGrid = React.forwardRef<HTMLDivElement, IconGridProps>(
  ({ items, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'grid grid-cols-3 gap-4 text-center sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6',
          className
        )}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group relative flex flex-col items-center justify-center"
            aria-label={item.name}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-border bg-card p-4 transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-md hover:-translate-y-1">
              {item.icon}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground font-medium truncate max-w-[96px]">
              {item.name}
            </p>
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

IconGrid.displayName = 'IconGrid';

export { IconGrid };
