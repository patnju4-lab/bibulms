import { AcademicLevel } from './index';

export type AlumniVerificationStatus = 
  | 'Demo Record' 
  | 'Pending Verification' 
  | 'Verified Alumni' 
  | 'Archived' 
  | 'Restricted';

export type AlumniPrivacyStatus = 'Public Profile' | 'Public Directory' | 'Alumni Only' | 'Private';

export type AlumniQualificationLevel = AcademicLevel | 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate' | 'PhD' | 'DMin' | 'MDiv' | 'ThD' | 'Honorary Doctorate';

export interface Alumni {
  id: string;
  alumni_id: string;
  student_id?: string;
  certificate_number?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  profile_photo?: string;
  country: string;
  country_code: string; // ISO 2-letter or 3-letter, e.g. KE, US, CA, GB, ZA
  city: string;
  email: string;
  phone?: string;
  graduation_year: number; // 2017 - 2026
  graduation_date?: string;
  program_id?: string;
  program_name: string;
  qualification_level: AlumniQualificationLevel;
  campus?: string;
  study_mode?: 'Online / Distance Learning' | 'On-Campus Resident' | 'Hybrid Academic Track' | string;
  current_position?: string;
  organization?: string;
  profession?: string;
  ministry?: string;
  biography?: string;
  achievements?: string[];
  linkedin_url?: string;
  website_url?: string;
  chapter_id?: string;
  verification_status: AlumniVerificationStatus;
  privacy_status: AlumniPrivacyStatus;
  featured?: boolean;
  distinguished?: boolean;
  distinguished_category?: 
    | 'Ministry Leadership'
    | 'Theology'
    | 'Christian Education'
    | 'Business'
    | 'Government'
    | 'Community Development'
    | 'Missions'
    | 'Chaplaincy'
    | 'Counseling'
    | 'Academia'
    | 'Entrepreneurship'
    | 'Humanitarian Service';
  is_demo?: boolean;
  created_at: string;
  updated_at: string;

  // CamelCase accessors / aliases for compatibility with frontend code
  alumniId?: string;
  studentId?: string;
  certificateNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName?: string;
  profilePhoto?: string;
  countryCode?: string;
  graduationYear?: number;
  graduationDate?: string;
  programId?: string;
  programName?: string;
  qualificationLevel?: AlumniQualificationLevel;
  studyMode?: string;
  currentPosition?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  chapterId?: string;
  verificationStatus?: AlumniVerificationStatus;
  privacyStatus?: AlumniPrivacyStatus;
  distinguishedCategory?: string;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AlumniChapter {
  id: string;
  name: string; // e.g. "BIBU Kenya Alumni Chapter"
  country: string;
  country_code: string;
  region?: string;
  city: string;
  president_name: string;
  president_alumni_id?: string;
  secretary_name?: string;
  contact_email: string;
  contact_phone?: string;
  member_count: number;
  alumni_count?: number;
  coverage_countries?: string[];
  next_meeting?: string;
  established_year: number;
  description?: string;
  cover_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlumniStory {
  id: string;
  alumni_id: string;
  alumni_name: string;
  country: string;
  country_code: string;
  graduation_year: number;
  program_name: string;
  qualification_level: string;
  current_role: string;
  organization?: string;
  title: string;
  summary: string;
  testimony: string;
  achievements?: string[];
  quote: string;
  photo_url?: string;
  has_video?: boolean;
  video_duration?: string;
  video_thumbnail?: string;
  video_url?: string;
  status: 'Published' | 'Draft' | 'Pending Review' | 'Archived';
  is_sample?: boolean; // For sample/demo stories
  created_at: string;
  updated_at: string;
}

export interface AlumniEvent {
  id: string;
  title: string;
  category: 
    | 'Global Alumni Conference'
    | 'Graduation Anniversary'
    | 'Regional Meeting'
    | 'Country Chapter'
    | 'Webinar'
    | 'Ministry Conference'
    | 'Reunion'
    | 'Alumni Fundraising'
    | 'Leadership Meeting';
  date: string;
  time: string;
  location_type: 'Online' | 'In-Person' | 'Hybrid';
  venue_or_link: string;
  country?: string;
  city?: string;
  chapter_id?: string;
  description: string;
  organizer: string;
  registration_deadline?: string;
  registered_attendees_count: number;
  capacity?: number;
  banner_image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlumniVerificationQuery {
  alumni_id?: string;
  certificate_number?: string;
  student_id?: string;
}

export interface AlumniVerificationResult {
  found: boolean;
  alumni?: {
    full_name: string;
    program_name: string;
    qualification_level: string;
    graduation_year: number;
    graduation_date?: string;
    certificate_number?: string;
    alumni_id: string;
    verification_status: AlumniVerificationStatus;
    is_demo: boolean;
    verification_date?: string;
  };
  message: string;
}
