import ServerStatsCard from "./ServerStatsCard";

interface ServerInfoSectionProps {
  serverInfo: {
    hostname: string;
    architecture: string;
    cpuModel: string;
    osType: string;
    uptime: string;
  };
}

export default function ServerInfoSection({ serverInfo }: ServerInfoSectionProps) {
  return (
    <section aria-labelledby="server-info-title">
      <h2 id="server-info-title" className="text-xl font-semibold text-foreground mb-4">
        Server Information
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <ServerStatsCard iconName="Server" title="Hostname" value={serverInfo.hostname} className="xl:col-span-2" />
        <ServerStatsCard iconName="Clock" title="Local Time" isTime={true} />
        <ServerStatsCard iconName="Laptop" title="OS Type" value={serverInfo.osType} className="xl:col-span-2" />
        <ServerStatsCard iconName="Binary" title="Architecture" value={serverInfo.architecture} />
        <ServerStatsCard iconName="Cpu" title="CPU Model" value={serverInfo.cpuModel} className="md:col-span-2 lg:col-span-3 xl:col-span-3" />
        <ServerStatsCard iconName="Timer" title="Uptime" value={serverInfo.uptime} className="md:col-span-2 lg:col-span-3 xl:col-span-3" />
      </div>
    </section>
  );
}
