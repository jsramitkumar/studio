export default function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
      <div className="container flex flex-col items-center justify-center gap-4 h-16 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          ServerPulse &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
