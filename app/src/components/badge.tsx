"use client";

import React, { forwardRef } from "react";

type BadgeProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  burstClipPath?: string;
  percentText?: string;
  offText?: string;
  textColorClass?: string;
  percentFontSizeClass?: string;
  offFontSizeClass?: string;
  burstRef?: React.Ref<HTMLDivElement>;
  containerRef?: React.Ref<HTMLDivElement>;
  useDefaultStar?: boolean;
};

const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
  {
    className,
    style,
    size = 175,
    burstClipPath,
    percentText = "25%",
    offText = "OFF",
    textColorClass = "text-zinc-900",
    percentFontSizeClass = "text-[44px]",
    offFontSizeClass = "text-[26px]",
    burstRef,
    containerRef,
    useDefaultStar = true,
  },
  ref
) {
  const baseStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...style,
  };

  const burstStyle: React.CSSProperties = {
    backgroundColor: "#F6C343",
    ...(burstClipPath
      ? { clipPath: burstClipPath }
      : useDefaultStar
      ? {
          clipPath:
            "polygon(50% 0%, 70% 10%, 87% 26%, 96% 50%, 87% 74%, 70% 90%, 50% 100%, 30% 90%, 13% 74%, 4% 50%, 13% 26%)",
        }
      : {}),
  };

  return (
    <div ref={(containerRef as any) ?? ref} className={className} style={baseStyle}>
      <div ref={burstRef} className="absolute inset-0" style={burstStyle} />
      <div className={`relative z-10 leading-none text-center ${textColorClass}`}>
        <div className={`font-extrabold tracking-tight ${percentFontSizeClass}`}>{percentText}</div>
        <div className={`font-extrabold tracking-tight mt-1 ${offFontSizeClass}`}>{offText}</div>
      </div>
    </div>
  );
});

export default Badge;


