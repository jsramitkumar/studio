import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServerInfoSection from '@/components/dashboard/ServerInfoSection';
import ResourceMonitoringSection from '@/components/dashboard/ResourceMonitoringSection';

interface ServerData {
  hostname: string;
  architecture: string;
  cpuModel: string;
  osType: string;
  uptime: string;
}

async function getServerData(): Promise<ServerData | null> {
  try {
    // Ensure this URL is correct for your Express API
    const res = await fetch('http://localhost:3001/api/server-info', { cache: 'no-store' }); 
    if (!res.ok) {
      console.error("Failed to fetch server info:", res.status, await res.text().catch(() => ""));
      return null; 
    }
    return await res.json() as ServerData;
  } catch (error) {
    console.error("Error fetching server info:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const fetchedServerInfo = await getServerData();

  const serverInfo = fetchedServerInfo ? {
    hostname: fetchedServerInfo.hostname,
    architecture: fetchedServerInfo.architecture,
    cpuModel: fetchedServerInfo.cpuModel,
    osType: fetchedServerInfo.osType,
    uptime: fetchedServerInfo.uptime,
  } : { // Fallback data if API fails or server data is null
    hostname: 'N/A (API Error)',
    architecture: 'N/A',
    cpuModel: 'N/A',
    osType: 'N/A',
    uptime: 'N/A',
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        <ServerInfoSection serverInfo={serverInfo} />
        <ResourceMonitoringSection />
      </main>
      <Footer />
    </div>
  );
}
