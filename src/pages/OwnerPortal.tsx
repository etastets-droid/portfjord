import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OwnerSidebar } from "@/components/owner/OwnerSidebar";
import { OwnerDashboard } from "@/components/owner/OwnerDashboard";
import { PropertiesManagement } from "@/components/owner/PropertiesManagement";
import { ReservationsManagement } from "@/components/owner/ReservationsManagement";
import { CalendarView } from "@/components/owner/CalendarView";
import { FinancialReports } from "@/components/owner/FinancialReports";
import { MessagingCenter } from "@/components/owner/MessagingCenter";
import { ProfileSettings } from "@/components/owner/ProfileSettings";

export type OwnerPortalSection = 'dashboard' | 'properties' | 'reservations' | 'calendar' | 'reports' | 'messages' | 'profile';

const OwnerPortal = () => {
  const [activeSection, setActiveSection] = useState<OwnerPortalSection>('dashboard');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <OwnerDashboard />;
      case 'properties':
        return <PropertiesManagement />;
      case 'reservations':
        return <ReservationsManagement />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <FinancialReports />;
      case 'messages':
        return <MessagingCenter />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <OwnerDashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <OwnerSidebar 
          activeSection={activeSection} 
          onSectionChange={(section) => setActiveSection(section as OwnerPortalSection)} 
        />
        <main className="flex-1 p-6 bg-background">
          {renderActiveSection()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default OwnerPortal;