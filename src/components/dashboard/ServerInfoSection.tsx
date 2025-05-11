import ServerStatsCard from "./ServerStatsCard";
// Removed Lucide icon imports as they are handled by ServerStatsCard
// import { Server, Cpu, Binary, Clock } from "lucide-react"; 

interface ServerInfoSectionProps {
  hostname: string;
  architecture: string;
  cpuModel: string;
}

export default function ServerInfoSection({ hostname, architecture, cpuModel }: ServerInfoSectionProps) {
  return (
    <section aria-labelledby="server-info-title">
      <h2 id="server-info-title" className="text-xl font-semibold text-foreground mb-4">
        Server Information
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ServerStatsCard iconName="Server" title="Hostname" value={hostname} />
        <ServerStatsCard iconName="Clock" title="Local Time" isTime={true} />
        <ServerStatsCard iconName="Binary" title="Architecture" value={architecture} />
        <ServerStatsCard iconName="Cpu" title="CPU Model" value={cpuModel} className="md:col-span-2 lg:col-span-1"/>
      </div>
    </section>
  );
}
