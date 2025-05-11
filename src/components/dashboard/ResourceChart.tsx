// src/components/dashboard/ResourceChart.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { Cpu, MemoryStick, HardDrive, Thermometer, type LucideProps } from "lucide-react"; // Import specific icons
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

// Define the possible icon names as a union type
export type ResourceIconName = "Cpu" | "MemoryStick" | "HardDrive" | "Thermometer";

interface ResourceChartProps {
  iconName: ResourceIconName;
  title: string;
  description: string;
  dataUnit?: string;
  maxDataPoints?: number;
  updateInterval?: number; // in milliseconds
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

export default function ResourceChart({
  iconName,
  title,
  description,
  dataUnit = "%",
  maxDataPoints = 30, // Show last 30 data points
  updateInterval = 2000, // Update every 2 seconds
}: ResourceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const IconComponent = IconMap[iconName];

  useEffect(() => {
    // Initial data generation
    const initialData: ChartDataPoint[] = [];
    const now = new Date();
    for (let i = maxDataPoints -1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * updateInterval);
      let simulatedUsage: number;
      if (title.includes("CPU Usage")) {
        simulatedUsage = Math.floor(Math.random() * 80); // 0-79
      } else if (title.includes("RAM")) {
        simulatedUsage = Math.floor(Math.random() * 60); // 0-59
      } else if (title.includes("Temperature")) {
        simulatedUsage = Math.floor(Math.random() * 50) + 40; // 40-89 °C
      } else { // Disk Usage or other
        simulatedUsage = Math.floor(Math.random() * 40); // 0-39
      }
      initialData.push({
        time: format(time, 'HH:mm:ss'),
        usage: simulatedUsage,
      });
    }
    setChartData(initialData);
    setIsLoading(false);

    const intervalId = setInterval(() => {
      setChartData((prevData) => {
        let newUsage: number;
        if (title.includes("CPU Usage")) {
          newUsage = Math.floor(Math.random() * 70) + 10; // 10-79
        } else if (title.includes("RAM")) {
          newUsage = Math.floor(Math.random() * 50) + 10; // 10-59
        } else if (title.includes("Temperature")) {
          newUsage = Math.floor(Math.random() * 50) + 40; // 40-89 °C
        } else { // Disk Usage or other
          newUsage = Math.floor(Math.random() * 30) + 10; // 10-39
        }
        const newDataPoint: ChartDataPoint = {
          time: format(new Date(), 'HH:mm:ss'),
          usage: newUsage,
        };
        const updatedData = [...prevData, newDataPoint];
        if (updatedData.length > maxDataPoints) {
          return updatedData.slice(updatedData.length - maxDataPoints);
        }
        return updatedData;
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [title, maxDataPoints, updateInterval]);

  const chartConfig = useMemo(() => ({
    usage: {
      label: `Usage (${dataUnit})`,
      color: "hsl(var(--chart-1))", // Uses Teal from globals.css
    },
  } satisfies ChartConfig), [dataUnit]);


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
                  domain={[0, 100]}
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
                  isAnimationActive={true}
                  animationDuration={300}
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
