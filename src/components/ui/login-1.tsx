'use client';

import * as React from 'react';
import { useState } from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  [key: string]: any;
}

export const AppInput = (props: InputProps) => {
  const { label, placeholder, icon, ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="w-full relative">
      {label && (
        <label className="block mb-2 text-[10px] font-bold text-gold/50 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          className="peer relative z-10 border border-gold/20 h-12 w-full rounded-2xl bg-black/60 px-4 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-200 ease-in-out focus:bg-black focus:border-gold/50 focus:ring-2 focus:ring-gold/15"
          placeholder={placeholder}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          {...rest}
        />
        {isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[1px] z-20 rounded-t-2xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 0px, #D4AF37 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[1px] z-20 rounded-b-2xl overflow-hidden"
              style={{
                background: `radial-gradient(40px circle at ${mousePosition.x}px 1px, #D4AF37 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
