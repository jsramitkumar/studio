import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServerInfoSection from '@/components/dashboard/ServerInfoSection';
import ResourceMonitoringSection from '@/components/dashboard/ResourceMonitoringSection';

export default function DashboardPage() {
  // Mock server data (in a real app, this would come from an API or server-side logic)
  const serverInfo = {
    hostname: 'pulse-master-node',
    architecture: 'ARM64', // Example: 'x86_64' or 'ARM64'
    cpuModel: 'Apple M1 Max', // Example: 'Intel Xeon E5-2673 v3 @ 2.40GHz'
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <ServerInfoSection
          hostname={serverInfo.hostname}
          architecture={serverInfo.architecture}
          cpuModel={serverInfo.cpuModel}
        />
        <ResourceMonitoringSection />
      </main>
      <Footer />
    </div>
  );
}
