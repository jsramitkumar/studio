// src/components/dashboard/ResourceChart.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Cpu, MemoryStick, HardDrive, Thermometer, type LucideProps } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';

export type ResourceIconName = "Cpu" | "MemoryStick" | "HardDrive" | "Thermometer";

interface ResourceChartProps {
  iconName: ResourceIconName;
  title: string;
  description: string;
  dataUnit?: string;
  maxDataPoints?: number;
  updateInterval?: number; 
}

interface ChartDataPoint {
  time: string;
  usage: number;
}

const IconMap: Record<ResourceIconName, React.FC<LucideProps>> = {
  Cpu,
  MemoryStick,
  HardDrive,
  Thermometer,
};

const API_BASE_URL = 'http://localhost:3001/api/resources/live';

export default function ResourceChart({
  iconName,
  title,
  description,
  dataUnit = "%",
  maxDataPoints = 30,
  updateInterval = 2000,
}: ResourceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const IconComponent = IconMap[iconName];

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!isMounted) return;

        if (!response.ok) {
          const errorText = await response.text().catch(() => `API request failed with status: ${response.status}`);
          console.error(`API request failed: ${response.status}`, errorText);
          setError(`API Error: ${response.status}`);
          if (isLoading) setIsLoading(false);
          return;
        }
        
        const data = await response.json();
        setError(null); // Clear previous errors
        if (isLoading) setIsLoading(false);

        let newUsage: number;
        if (title.includes("CPU Usage")) {
          newUsage = data.cpuUsage ?? 0;
        } else if (title.includes("RAM")) {
          newUsage = data.ramUsage ?? 0;
        } else if (title.includes("Disk")) {
          newUsage = data.diskUsage ?? 0;
        } else if (title.includes("Temperature")) {
          newUsage = data.cpuTemperature ?? 0; 
        } else {
          newUsage = 0;
        }
        
        const newDataPoint: ChartDataPoint = {
          time: format(new Date(), 'HH:mm:ss'),
          usage: parseFloat(newUsage.toFixed(1)), // Ensure usage is a number, round to 1 decimal
        };

        setChartData((prevData) => {
          const updatedData = [...prevData, newDataPoint];
          if (updatedData.length > maxDataPoints) {
            return updatedData.slice(-maxDataPoints);
          }
          return updatedData;
        });

      } catch (e) {
        if (!isMounted) return;
        console.error("Failed to fetch resource data:", e);
        setError("Network error or API unavailable.");
        if (isLoading) setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, updateInterval);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, maxDataPoints, updateInterval]); // Deliberately not including isLoading or error

  const chartConfig = useMemo(() => ({
    usage: {
      label: `Usage (${dataUnit})`,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig), [dataUnit]);

  const yAxisDomain: [number, number] = title.includes("Temperature") ? [0, 100] : [0, 100];


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
         <CardTitle className="text-base font-semibold">{title}</CardTitle>
         <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
        </div>
        {IconComponent && <IconComponent className="h-5 w-5 text-accent" />}
      </CardHeader>
      <CardContent className="flex-grow">
        {isLoading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : error ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-destructive">{error}</p>
          </div>
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value} 
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  domain={yAxisDomain}
                  tickFormatter={(value) => `${value}${dataUnit}`}
                  className="text-xs"
                />
                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="usage"
                  type="monotone"
                  stroke="var(--color-usage)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false} // Smoother updates with real-time data
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
