/**
 * Breakthrough International Bible University (BIBU) - Phoenix, Arizona, USA
 * Comprehensive Online Bible School, Theological Learning & Examination Management System
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RoleSwitcher } from './components/common/RoleSwitcher';

// Auth Components & Interceptors
import { ProtectedPortalWrapper } from './components/auth/ProtectedPortalWrapper';
import { LoginPage } from './components/auth/LoginPage';
import { CreateAccountPage } from './components/auth/CreateAccountPage';
import { MyAccountDashboard } from './components/auth/MyAccountDashboard';
import { AuthModal } from './components/auth/AuthModal';

// Public Pages
import { PublicHome } from './components/public/PublicHome';
import { AboutPage } from './components/public/AboutPage';
import { SchoolsCatalog } from './components/public/SchoolsCatalog';
import { ProgramsCatalog } from './components/public/ProgramsCatalog';
import { AdmissionsPortal } from './components/public/AdmissionsPortal';
import { RplPortal } from './components/public/RplPortal';
import { CertificateVerification } from './components/public/CertificateVerification';
import { DigitalLibrary } from './components/public/DigitalLibrary';
import { ContactPage } from './components/public/ContactPage';
import { PortalAccessHub } from './components/public/PortalAccessHub';
import { AlumniNetworkPortal } from './components/public/AlumniNetworkPortal';
import { GlobalFellowshipsPortal } from './components/public/GlobalFellowshipsPortal';
import { BulletinsCenter } from './components/public/BulletinsCenter';
import { BulletinDetailPage } from './components/public/BulletinDetailPage';

// Student Portal & LMS
import { StudentDashboard } from './components/student/StudentDashboard';
import { OnlineClassroom } from './components/student/OnlineClassroom';
import { ExamTaker } from './components/student/ExamTaker';
import { TranscriptView } from './components/student/TranscriptView';
import { FinancePortal } from './components/student/FinancePortal';

// TV & Radio Media Center Components
import { MediaHub } from './components/media/MediaHub';
import { BibuTVPage } from './components/media/BibuTVPage';
import { BibuRadioPage } from './components/media/BibuRadioPage';
import { LiveTVPage } from './components/media/LiveTVPage';
import { LiveRadioPage } from './components/media/LiveRadioPage';
import { MediaProgramsPage } from './components/media/MediaProgramsPage';
import { MediaSermonsPage } from './components/media/MediaSermonsPage';
import { MediaNewsPage } from './components/media/MediaNewsPage';
import { MediaPodcastsPage } from './components/media/MediaPodcastsPage';
import { MediaArchivesPage } from './components/media/MediaArchivesPage';
import { YouTubeChannelPage } from './components/media/YouTubeChannelPage';
import { PersistentRadioPlayer } from './components/media/PersistentRadioPlayer';

// Faculty & Admin Portals
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { GlobalExamCentresPortal } from './components/examCentres/GlobalExamCentresPortal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      // Public Views
      case 'home':
        return <PublicHome />;
      case 'about':
        return <AboutPage />;
      case 'schools':
        return <SchoolsCatalog />;
      case 'programs':
        return <ProgramsCatalog />;
      case 'admissions':
        return <AdmissionsPortal />;
      case 'rpl':
        return <RplPortal />;
      case 'verify':
      case 'verification':
        return <CertificateVerification />;
      case 'library':
        return <DigitalLibrary />;
      case 'contact':
        return <ContactPage />;
      case 'bulletins':
      case 'news':
        return <BulletinsCenter />;
      case 'bulletin-detail':
        return <BulletinDetailPage />;
      case 'portals':
      case 'portal-access':
        return <PortalAccessHub />;

      // Authentication & Account Routes
      case 'login':
        return <LoginPage />;
      case 'register':
      case 'create-account':
        return <CreateAccountPage />;
      case 'account':
      case 'my-account':
        return (
          <ProtectedPortalWrapper
            portalKey="account"
            portalName="My BIBU Account"
            targetView="account"
          >
            <MyAccountDashboard />
          </ProtectedPortalWrapper>
        );

      // Protected Route: Student Portal & LMS Sub-routes
      case 'student-dashboard':
        return (
          <ProtectedPortalWrapper
            portalKey="student"
            portalName="Student Learning Portal & LMS"
            targetView="student-dashboard"
          >
            <StudentDashboard />
          </ProtectedPortalWrapper>
        );
      case 'classroom':
        return (
          <ProtectedPortalWrapper
            portalKey="student"
            portalName="Online Classroom & Lectures"
            targetView="classroom"
          >
            <OnlineClassroom />
          </ProtectedPortalWrapper>
        );
      case 'exam-taker':
        return (
          <ProtectedPortalWrapper
            portalKey="student"
            portalName="Central Examination System"
            targetView="exam-taker"
          >
            <ExamTaker />
          </ProtectedPortalWrapper>
        );
      case 'transcript':
        return (
          <ProtectedPortalWrapper
            portalKey="student"
            portalName="Academic Transcript & Grades"
            targetView="transcript"
          >
            <TranscriptView />
          </ProtectedPortalWrapper>
        );
      case 'finance':
        return (
          <ProtectedPortalWrapper
            portalKey="student"
            portalName="Student Finance & Tuition"
            targetView="finance"
          >
            <FinancePortal />
          </ProtectedPortalWrapper>
        );

      // Protected Route: Faculty & Academic Instructor Portal
      case 'faculty-portal':
        return (
          <ProtectedPortalWrapper
            portalKey="faculty"
            portalName="Faculty & Instructor Portal"
            targetView="faculty-portal"
          >
            <FacultyPortal />
          </ProtectedPortalWrapper>
        );

      // Protected Route: Admin & Registrar Portal
      case 'admin-portal':
        return (
          <ProtectedPortalWrapper
            portalKey="admin"
            portalName="University Administration & Registrar"
            targetView="admin-portal"
          >
            <AdminPortal />
          </ProtectedPortalWrapper>
        );

      // Global Examination Centres & 47 Counties Hub
      case 'exam-centres':
      case 'kenya-counties':
      case 'national-rep-portal':
      case 'centre-rep-portal':
      case 'exam-attendance':
      case 'centre-directory':
      case 'centre-reports':
        return (
          <ProtectedPortalWrapper
            portalKey="admin"
            portalName="Global Examination Centre & Candidate Registration System"
            targetView="exam-centres"
          >
            <GlobalExamCentresPortal />
          </ProtectedPortalWrapper>
        );

      // Protected Route: Alumni Network Portal
      case 'alumni':
        return (
          <ProtectedPortalWrapper
            portalKey="alumni"
            portalName="BIBU Alumni & Ministerial Network"
            targetView="alumni"
          >
            <AlumniNetworkPortal />
          </ProtectedPortalWrapper>
        );

      // Protected Route: Global Ministry Fellowships Portal
      case 'fellowships':
        return (
          <ProtectedPortalWrapper
            portalKey="fellowships"
            portalName="Global Ministry Fellowships"
            targetView="fellowships"
          >
            <GlobalFellowshipsPortal />
          </ProtectedPortalWrapper>
        );

      // TV & Radio Media Center Subsections
      case 'media-center':
      case 'media':
        return <MediaHub />;
      case 'bibu-tv':
        return <BibuTVPage />;
      case 'bibu-radio':
        return <BibuRadioPage />;
      case 'live-tv':
        return <LiveTVPage />;
      case 'live-radio':
        return <LiveRadioPage />;
      case 'media-programs':
        return <MediaProgramsPage />;
      case 'media-sermons':
        return <MediaSermonsPage />;
      case 'media-news':
        return <MediaNewsPage />;
      case 'media-podcasts':
        return <MediaPodcastsPage />;
      case 'media-archives':
        return <MediaArchivesPage />;
      case 'youtube-channel':
        return <YouTubeChannelPage />;

      default:
        return <PublicHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-[#1E293B] selection:bg-[#C5A059] selection:text-[#002366]">
      <Navbar />
      <RoleSwitcher />
      <main className="flex-1 pb-16">
        {renderView()}
      </main>
      <Footer />
      <AuthModal />
      <PersistentRadioPlayer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
