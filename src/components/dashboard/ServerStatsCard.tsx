// src/components/dashboard/ServerStatsCard.tsx
"use client";

import { Server, Clock, Binary, Cpu, Laptop, Timer, type LucideProps } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

// Define the possible icon names as a union type
export type ServerStatIconName = "Server" | "Clock" | "Binary" | "Cpu" | "Laptop" | "Timer";

interface ServerStatsCardProps {
  iconName: ServerStatIconName;
  title: string;
  value?: string;
  isTime?: boolean;
  className?: string;
}

const IconMap: Record<ServerStatIconName, React.FC<LucideProps>> = {
  Server,
  Clock,
  Binary,
  Cpu,
  Laptop,
  Timer,
};

export default function ServerStatsCard({ iconName, title, value, isTime = false, className }: ServerStatsCardProps) {
  const [displayValue, setDisplayValue] = useState<string | undefined>(value);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  const IconComponent = IconMap[iconName];

  useEffect(() => {
    if (isTime) {
      const updateCurrentTime = () => {
        setCurrentTime(new Date().toLocaleTimeString());
      };
      const timerId = setInterval(updateCurrentTime, 1000);
      updateCurrentTime(); // Initial call
      setIsLoading(false);
      return () => clearInterval(timerId);
    } else {
      // For non-time values, update if the prop 'value' changes
      setDisplayValue(value);
      setIsLoading(false); // Assume loaded once value is processed
    }
  }, [isTime, value]); // Rerun if 'value' changes for non-time cards
  
  const finalDisplayValue = isTime ? currentTime : displayValue;

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {IconComponent && <IconComponent className="h-5 w-5 text-accent" />}
      </CardHeader>
      <CardContent>
        {isLoading && !isTime && value === undefined ? ( // Show skeleton if loading and value isn't set yet (for async fetched values handled by parent)
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold text-foreground truncate" title={finalDisplayValue}>
            {finalDisplayValue || <span className="text-sm text-muted-foreground">N/A</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
