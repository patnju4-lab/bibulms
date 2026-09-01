import React from 'react';

interface CircularProgressBarProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showText?: boolean;
  textColor?: string;
  textSize?: string;
  subText?: string;
  subTextColor?: string;
  className?: string;
  animate?: boolean;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 72,
  strokeWidth = 6,
  color,
  trackColor = '#E2E8F0',
  showText = true,
  textColor,
  textSize = 'text-xs',
  subText,
  subTextColor = 'text-slate-400',
  className = '',
  animate = true
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  // Center coordinate and radius calculation
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Determine dynamic progress color if not explicitly provided
  const getProgressColor = () => {
    if (color) return color;
    if (clampedPercentage === 100) return '#10B981'; // Emerald
    if (clampedPercentage >= 60) return '#002366'; // Oxford Blue
    if (clampedPercentage >= 25) return '#C5A059'; // Biblical Gold
    return '#F59E0B'; // Amber
  };

  const activeColor = getProgressColor();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clampedPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Course completion progress: ${clampedPercentage}%`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center overflow-visible"
      >
        {/* Background Track Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="transition-colors"
        />

        {/* Foreground Animated Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: animate ? 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease' : 'none'
          }}
        />
      </svg>

      {/* Centered Percentage & Subtext */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span
            className={`font-mono font-black tracking-tight leading-none ${textSize}`}
            style={{ color: textColor || (clampedPercentage === 100 ? '#10B981' : '#002366') }}
          >
            {clampedPercentage}%
          </span>
          {subText && (
            <span className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 leading-none ${subTextColor}`}>
              {subText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
