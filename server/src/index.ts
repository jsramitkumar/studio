'use strict';
import express, { type Request, type Response } from 'express';
import cors from 'cors';
import si from 'systeminformation';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function formatUptime(totalSeconds: number): string {
  const days = Math.floor(totalSeconds / (3600 * 24));
  totalSeconds %= (3600 * 24);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let uptimeString = "";
  if (days > 0) uptimeString += `${days}d `;
  if (hours > 0 || days > 0) uptimeString += `${hours}h `;
  if (minutes > 0 || hours > 0 || days > 0) uptimeString += `${minutes}m `;
  uptimeString += `${seconds}s`;
  return uptimeString.trim();
}

app.get('/api/server-info', async (_req: Request, res: Response) => {
  try {
    const osInfo = await si.osInfo();
    const cpuInfo = await si.cpu();
    const timeInfo = si.time(); // Synchronous

    res.json({
      hostname: osInfo.hostname,
      osType: `${osInfo.platform} ${osInfo.release}`,
      architecture: osInfo.arch,
      cpuModel: `${cpuInfo.manufacturer} ${cpuInfo.brand}`,
      uptime: formatUptime(timeInfo.uptime),
    });
  } catch (error) {
    console.error('Error fetching server info:', error);
    res.status(500).json({ error: 'Failed to fetch server information' });
  }
});

app.get('/api/resources/live', async (_req: Request, res: Response) => {
  try {
    const currentLoad = await si.currentLoad();
    const mem = await si.mem();
    const fsSizes = await si.fsSize();
    const temp = await si.cpuTemperature();

    const primaryDisk = fsSizes.find(fs => fs.mount === '/') || fsSizes[0];
    const diskUsage = primaryDisk ? primaryDisk.use : 0;

    // systeminformation might return null or specific structure if temp is not available
    // Ensure cpuTemperature is a number, defaulting to 0 if not determinable
    let cpuTemperatureValue = 0; 
    if (temp && typeof temp.main === 'number' && temp.main !== -1) { // -1 can be an indicator for not available on some systems
        cpuTemperatureValue = temp.main;
    }


    res.json({
      cpuUsage: currentLoad.currentLoad,
      ramUsage: (mem.active / mem.total) * 100,
      diskUsage: diskUsage,
      cpuTemperature: cpuTemperatureValue,
    });
  } catch (error) {
    console.error('Error fetching live resources:', error);
    res.status(500).json({ error: 'Failed to fetch live resource data' });
  }
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
