import { Activity } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Activity className="h-8 w-8" />
          <h1 className="text-2xl font-bold tracking-tight">ServerPulse</h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
