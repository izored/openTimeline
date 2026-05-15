import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Settings2, Database, Palette, Globe, Eye, Download, Info, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/providers/theme';
import Navigation from '@/components/Navigation';

function PlaceholderToggle() {
  return (
    <div
      className="w-10 h-5 rounded-full flex items-center px-0.5 opacity-30 cursor-not-allowed shrink-0"
      style={{ background: 'var(--border)' }}
      title="Coming soon"
    >
      <div className="w-4 h-4 rounded-full" style={{ background: 'var(--text-muted)' }} />
    </div>
  );
}

function PlaceholderSelect({ placeholder }: { placeholder: string }) {
  return (
    <select
      disabled
      className="text-[12px] px-3 py-1.5 rounded-md opacity-40 cursor-not-allowed shrink-0"
      style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
    >
      <option>{placeholder}</option>
    </select>
  );
}

function CardRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 divider-b last:border-0">
      <div className="mr-6">
        <p className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg p-5 ${className}`}
      style={{ background: 'var(--bg-card)' }}
    >
      {children}
    </div>
  );
}

function CardLabel({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={12} style={{ color: 'var(--accent-teal)' }} />
      <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-teal)' }}>
        {title}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', transition: 'background-color 0.3s ease' }}>
      <Navigation activeYear={0} years={[]} onYearClick={() => {}} />

      <div style={{ marginLeft: isMobile ? 0 : '240px', paddingTop: isMobile ? '52px' : 0 }}>
        <div className="max-w-[900px] mx-auto px-8 py-12">

          {/* Header */}
          <header className="mb-10">
            <h1 className="text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Settings
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Configure your timeline experience.
              </p>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-[13px] transition-colors hover:text-accent-teal shrink-0"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={12} />
                Back to timeline
              </Link>
            </div>
          </header>

          {/* Bento grid */}
          <div className="grid grid-cols-2 gap-3">

            {/* Appearance — full width */}
            <Card className="col-span-2">
              <CardLabel icon={Palette} title="Appearance" />
              <div className="grid grid-cols-3 gap-x-8">
                <CardRow label="Theme" description="Light or dark mode">
                  <button
                    onClick={toggle}
                    className="text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors shrink-0"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </button>
                </CardRow>
                <CardRow label="Compact view" description="Denser event spacing">
                  <PlaceholderToggle />
                </CardRow>
                <CardRow label="Show event dots" description="Dots on timeline spine">
                  <PlaceholderToggle />
                </CardRow>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <CardLabel icon={Settings2} title="Timeline" />
              <CardRow label="Default year" description="Year shown on load">
                <PlaceholderSelect placeholder="Most recent" />
              </CardRow>
              <CardRow label="Hide resolved" description="Filter resolved events">
                <PlaceholderToggle />
              </CardRow>
              <CardRow label="Category filter" description="Show selected categories">
                <PlaceholderSelect placeholder="All" />
              </CardRow>
            </Card>

            {/* Data */}
            <Card>
              <CardLabel icon={Database} title="Data" />
              <CardRow label="Data source" description="Currently using demo data">
                <span
                  className="text-[11px] px-2 py-1 rounded-full font-medium shrink-0"
                  style={{ background: 'rgba(74,158,255,0.12)', color: '#4a9eff', border: '1px solid rgba(74,158,255,0.2)' }}
                >
                  Demo
                </span>
              </CardRow>
              <CardRow label="Database URL" description="MySQL / TiDB connection">
                <PlaceholderSelect placeholder="Not set" />
              </CardRow>
              <CardRow label="Auto-sync" description="Refresh on window focus">
                <PlaceholderToggle />
              </CardRow>
            </Card>

            {/* Privacy */}
            <Card>
              <CardLabel icon={Eye} title="Privacy" />
              <CardRow label="Privacy mode" description="Blur names and amounts">
                <PlaceholderToggle />
              </CardRow>
              <CardRow label="Redact filenames" description="Hide evidence filenames">
                <PlaceholderToggle />
              </CardRow>
            </Card>

            {/* Localisation */}
            <Card>
              <CardLabel icon={Globe} title="Localisation" />
              <CardRow label="Language" description="Interface language">
                <PlaceholderSelect placeholder="English" />
              </CardRow>
              <CardRow label="Date format" description="How dates display">
                <PlaceholderSelect placeholder="YYYY-MM-DD" />
              </CardRow>
              <CardRow label="Currency" description="Symbol for amounts">
                <PlaceholderSelect placeholder="EUR (€)" />
              </CardRow>
            </Card>

            {/* Export + About stacked in one column */}
            <div className="flex flex-col gap-3">
              <Card>
                <CardLabel icon={Download} title="Export" />
                <CardRow label="Export timeline" description="Download as CSV or PDF">
                  <button
                    disabled
                    className="text-[12px] px-3 py-1.5 rounded-md opacity-40 cursor-not-allowed shrink-0"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Coming soon
                  </button>
                </CardRow>
              </Card>

              <Card>
                <CardLabel icon={Info} title="About" />
                <CardRow label="Version" description="OpenTimeline release">
                  <span className="text-[12px] shrink-0" style={{ color: 'var(--text-muted)' }}>v0.47.0</span>
                </CardRow>
                <CardRow label="Data scope" description="Events in this timeline">
                  <span className="text-[12px] shrink-0" style={{ color: 'var(--text-muted)' }}>2022–present</span>
                </CardRow>
              </Card>
            </div>

          </div>

          <footer className="mt-8 pt-6 divider-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>OpenTimeline v0.47.0</span>
                <span className="text-[12px]" style={{ color: 'var(--border)' }}>·</span>
                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>MIT License</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="https://github.com/izored/openTimeline" target="_blank" rel="noreferrer" className="text-[12px] transition-colors hover:text-accent-teal" style={{ color: 'var(--text-muted)' }}>
                  GitHub
                </a>
                <a href="https://github.com/izored/openTimeline/issues" target="_blank" rel="noreferrer" className="text-[12px] transition-colors hover:text-accent-teal" style={{ color: 'var(--text-muted)' }}>
                  Report a bug
                </a>
                <a href="https://github.com/izored/openTimeline/releases" target="_blank" rel="noreferrer" className="text-[12px] transition-colors hover:text-accent-teal" style={{ color: 'var(--text-muted)' }}>
                  Changelog
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Built by <a href="https://dev.izo.red" target="_blank" rel="noreferrer" className="hover:text-accent-teal transition-colors">Reda Izo</a>
              </p>
              <div className="flex items-center gap-4">
                <a href="https://dev.izo.red" target="_blank" rel="noreferrer" className="text-[11px] transition-colors hover:text-accent-teal" style={{ color: 'var(--text-muted)' }}>
                  dev.izo.red
                </a>
                <a href="mailto:dev@izo.red" className="text-[11px] transition-colors hover:text-accent-teal" style={{ color: 'var(--text-muted)' }}>
                  dev@izo.red
                </a>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}
