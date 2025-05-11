import ResourceChart from "./ResourceChart";
// Removed Lucide icon imports as they are handled by ResourceChart
// import { Cpu, MemoryStick, HardDrive, Thermometer } from "lucide-react";

export default function ResourceMonitoringSection() {
  return (
    <section aria-labelledby="resource-monitoring-title">
      <h2 id="resource-monitoring-title" className="text-xl font-semibold text-foreground mb-4">
        Real-time Resource Monitoring
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <ResourceChart
          iconName="Cpu"
          title="CPU Usage"
          description="Current processor utilization."
          dataUnit="%"
        />
        <ResourceChart
          iconName="MemoryStick"
          title="RAM Usage"
          description="Current memory utilization."
          dataUnit="%"
        />
        <ResourceChart
          iconName="HardDrive"
          title="Disk Usage"
          description="Current primary disk utilization."
          dataUnit="%"
        />
        <ResourceChart
          iconName="Thermometer"
          title="CPU Temperature"
          description="Current CPU core temperature."
          dataUnit="°C"
        />
      </div>
    </section>
  );
}
