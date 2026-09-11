"use client";
import React from 'react';
import Link from 'next/link';

export default function TrademarkLogo({
  width = 180,
  height,
  className = "",
  tmColor = "#475569",
  tmSize = "0.55rem",
  tmOffsetTop = "38%",
  tmOffsetRight = "-8px",
  src = "/logo_header2.png",
  alt = "BariVivah",
  href,
  priority = false,
}) {
  const calcHeight = height || Math.round(width * (54 / 140));

  const content = (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof calcHeight === 'number' ? `${calcHeight}px` : calcHeight,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
        loading={priority ? "eager" : "lazy"}
      />
      <span
        className="absolute font-semibold leading-none pointer-events-none select-none uppercase tracking-wider font-sans"
        style={{
          color: tmColor,
          fontSize: typeof tmSize === 'number' ? `${tmSize}px` : tmSize,
          top: typeof tmOffsetTop === 'number' ? `${tmOffsetTop}px` : tmOffsetTop,
          right: typeof tmOffsetRight === 'number' ? `${tmOffsetRight}px` : tmOffsetRight,
        }}
      >
        TM
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

