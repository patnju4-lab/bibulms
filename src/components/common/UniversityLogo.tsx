import React from 'react';
import officialLogoImg from '../../assets/images/bibu_official_logo_1787514755469.jpg';

interface UniversityLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  withRing?: boolean;
  alt?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  size = 'md',
  className = '',
  withRing = false,
  alt = 'Breakthrough International Bible University Official Seal'
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11 md:w-12 md:h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
    hero: 'w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44'
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full bg-white overflow-hidden ${
        withRing ? 'border-2 border-[#C5A059] shadow-md ring-2 ring-white/20' : ''
      } ${sizeClasses} ${className}`}
    >
      <img
        src={officialLogoImg}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain p-0.5"
      />
    </div>
  );
};
