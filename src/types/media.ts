export type MediaCategory =
  | 'Theology'
  | 'Theology & Doctrine'
  | 'Bible Studies'
  | 'Biblical Studies'
  | 'Christian Ministry'
  | 'Ministry & Leadership'
  | 'Sermons & Teachings'
  | 'Leadership'
  | 'Evangelism'
  | 'Missions'
  | 'Global Missions'
  | 'Worship'
  | 'Prayer'
  | 'Prophetic & Prayer'
  | 'Interviews'
  | 'Graduation'
  | 'Campus & Convocation'
  | 'Conferences'
  | 'Student Life'
  | 'Youth & Family'
  | 'Faculty'
  | 'News'
  | 'News & Announcements'
  | 'Announcements'
  | 'Podcasts'
  | 'Documentaries'
  | 'Academic Lectures';

export interface MediaChannel {
  id: string;
  name: string;
  type: 'tv' | 'radio' | 'general' | 'academic';
  youtubeChannelId: string;
  youtubeChannelUrl: string;
  description: string;
  logo: string;
  bannerUrl?: string;
  subscriberCount?: string;
  videoCount?: number;
  status: 'active' | 'inactive';
}

export interface MediaVideo {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  youtubeVideoId: string;
  youtubeUrl?: string;
  category: MediaCategory;
  thumbnail?: string;
  thumbnailUrl?: string;
  presenterId?: string;
  presenter?: string;
  presenterTitle?: string;
  presenterPhoto?: string;
  speakerName?: string;
  speakerTitle?: string;
  programId?: string;
  programTitle?: string;
  duration: string; // e.g. "45:20"
  durationSeconds?: number;
  publishedAt?: string;
  publishedDate?: string;
  featured?: boolean;
  isFeatured?: boolean;
  isLive?: boolean;
  isEmbeddable?: boolean;
  viewsCount: number;
  likesCount?: number;
  associatedCourseId?: string;
  associatedCourseCode?: string;
  associatedCourseTitle?: string;
  bibleReferences?: string[];
  scriptureReference?: string;
  tags: string[];
  status?: 'published' | 'draft' | 'archived';
}

export interface MediaPlaylist {
  id: string;
  title: string;
  youtubePlaylistId: string;
  category: MediaCategory;
  description: string;
  thumbnail: string;
  videoCount: number;
  status: 'active' | 'archived';
}

export interface TVProgram {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  presenter?: string;
  hostName?: string;
  presenterId?: string;
  presenterPhoto?: string;
  presenterTitle?: string;
  category: MediaCategory;
  schedule?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  timeZone?: string;
  airTime?: string;
  broadcastFrequency?: 'Weekly' | 'Daily' | 'Bi-Weekly' | 'Special';
  targetAudience?: string;
  youtubePlaylistId?: string;
  featuredVideoId?: string;
  episodesCount?: number;
  coverImage?: string;
  isLiveNow?: boolean;
  status?: 'active' | 'archived' | 'upcoming' | 'live_now';
}

export interface RadioProgram {
  id: string;
  title: string;
  description: string;
  presenter?: string;
  hostName?: string;
  presenterId?: string;
  presenterPhoto?: string;
  presenterTitle?: string;
  category: MediaCategory;
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | 'Daily';
  dayOfWeek?: string;
  startTime?: string; // e.g. "8:00 AM"
  endTime?: string;   // e.g. "9:00 AM"
  airTime?: string;
  status?: 'active' | 'upcoming' | 'archived';
  currentTheme?: string;
  scriptureFocus?: string;
  audioPreviewUrl?: string;
}

export interface RadioSettings {
  stationName: string;
  tagline: string;
  streamUrl: string;
  streamMountPoint?: string;
  whatsappHotline?: string;
  backupStreamUrl?: string;
  youtubeLiveRadioId?: string;
  logo?: string;
  description?: string;
  currentProgramTitle?: string;
  currentPresenter?: string;
  currentPresenterPhoto?: string;
  currentProgramDescription?: string;
  currentScripture?: string;
  isLive?: boolean;
  listenerCount?: number;
  status?: 'broadcasting' | 'standby' | 'offline';
}

export interface YouTubeSettings {
  channelId: string;
  channelUrl?: string;
  channelTitle?: string;
  customHandle?: string;
  apiKey?: string;
  featuredVideoId?: string;
  liveStreamVideoId?: string;
  isLiveBroadcasting?: boolean;
  liveProgramTitle?: string;
  liveProgramDescription?: string;
  livePresenter?: string;
  livePresenterPhoto?: string;
  liveViewersCount?: number;
  tvPlaylistId?: string;
  radioPlaylistId?: string;
  sermonsPlaylistId?: string;
  podcastsPlaylistId?: string;
  newsPlaylistId?: string;
}

export interface MediaPresenter {
  id: string;
  name: string;
  title?: string;
  academicTitle?: string;
  department?: string;
  photo?: string;
  avatarUrl?: string;
  bio: string;
  coursesTaught?: string[];
  tvPrograms?: string[];
  radioPrograms?: string[];
  totalBroadcasts?: number;
  sermonsCount?: number;
  lecturesCount?: number;
  publications?: string[];
  email?: string;
  location?: string;
}

export interface StudentMediaProgress {
  id: string;
  studentId: string;
  videoId: string;
  videoTitle?: string;
  thumbnail?: string;
  watchedSeconds?: number;
  totalSeconds?: number;
  percentage?: number;
  isCompleted?: boolean;
  lastWatchedAt?: string;
  isBookmarked?: boolean;
  isFavorite?: boolean;
}

export interface MediaAnalyticsData {
  totalVideoViews?: number;
  totalViews?: number;
  lmsInternalViews?: number;
  youtubeExternalViews?: number;
  totalRadioListenMinutes?: number;
  totalRadioListeners?: number;
  activeLiveViewers?: number;
  totalSubscribers?: number;
  watchTimeHours?: number;
  totalWatchHours?: number;
  activeCountries?: number;
  popularCategories?: { category: MediaCategory; count: number; views: number }[];
  topVideos?: { id: string; title: string; presenter: string; lmsViews: number; ytViews: number; category: string }[];
  topRadioShows?: { id: string; title: string; day: string; time: string; listeners: number }[];
  recentStudentWatchLogs?: { studentName: string; videoTitle: string; watchedAt: string; completionPercent: number }[];
}
