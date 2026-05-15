import { Settings2, Database, Palette, Globe, Eye, Download, Info, X } from 'lucide-react';
import { useTheme } from '@/providers/theme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingRowProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex-1 mr-8">
        <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mt-8 mb-2">
      <Icon size={14} style={{ color: 'var(--accent-teal)' }} />
      <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-teal)' }}>
        {title}
      </span>
    </div>
  );
}

function PlaceholderToggle({ disabled = true }: { disabled?: boolean }) {
  return (
    <div
      className="w-10 h-5 rounded-full flex items-center px-0.5 opacity-40 cursor-not-allowed"
      style={{ background: 'var(--border)' }}
      title={disabled ? 'Coming soon' : undefined}
    >
      <div className="w-4 h-4 rounded-full bg-white" />
    </div>
  );
}

function PlaceholderSelect({ placeholder }: { placeholder: string }) {
  return (
    <select
      disabled
      className="text-[12px] px-3 py-1.5 rounded-md opacity-40 cursor-not-allowed"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
    >
      <option>{placeholder}</option>
    </select>
  );
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const { theme, toggle } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div
        className="relative h-full w-full max-w-[420px] overflow-y-auto"
        style={{ background: 'var(--bg-nav)', borderLeft: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b"
          style={{ background: 'var(--bg-nav)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <Settings2 size={16} style={{ color: 'var(--accent-teal)' }} />
            <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-12">
          {/* Appearance */}
          <SectionHeader icon={Palette} title="Appearance" />
          <SettingRow label="Theme" description="Switch between light and dark mode">
            <button
              onClick={toggle}
              className="text-[12px] px-3 py-1.5 rounded-md font-medium transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </SettingRow>
          <SettingRow label="Compact view" description="Reduce spacing between events for denser layout">
            <PlaceholderToggle />
          </SettingRow>
          <SettingRow label="Show event dots" description="Display colored dots on the timeline spine">
            <PlaceholderToggle />
          </SettingRow>

          {/* Timeline */}
          <SectionHeader icon={Settings2} title="Timeline" />
          <SettingRow label="Default year" description="Which year the timeline starts on">
            <PlaceholderSelect placeholder="2022" />
          </SettingRow>
          <SettingRow label="Hide resolved events" description="Filter out events with status resolved">
            <PlaceholderToggle />
          </SettingRow>
          <SettingRow label="Category filter" description="Show only selected categories">
            <PlaceholderSelect placeholder="All categories" />
          </SettingRow>

          {/* Data */}
          <SectionHeader icon={Database} title="Data" />
          <SettingRow label="Data source" description="Using built-in demo data. Connect a database to use your own data.">
            <span
              className="text-[11px] px-2 py-1 rounded-full font-medium"
              style={{ background: 'rgba(74, 158, 255, 0.15)', color: '#4a9eff' }}
            >
              Demo mode
            </span>
          </SettingRow>
          <SettingRow label="Database URL" description="MySQL / TiDB connection string">
            <PlaceholderSelect placeholder="Not configured" />
          </SettingRow>
          <SettingRow label="Auto-sync" description="Refresh data from database on focus">
            <PlaceholderToggle />
          </SettingRow>

          {/* Privacy */}
          <SectionHeader icon={Eye} title="Privacy" />
          <SettingRow label="Privacy mode" description="Blur actor names and monetary amounts in the UI">
            <PlaceholderToggle />
          </SettingRow>
          <SettingRow label="Redact evidence filenames" description="Hide document filenames in detail panels">
            <PlaceholderToggle />
          </SettingRow>

          {/* Localisation */}
          <SectionHeader icon={Globe} title="Localisation" />
          <SettingRow label="Language" description="Interface language">
            <PlaceholderSelect placeholder="English" />
          </SettingRow>
          <SettingRow label="Date format" description="How dates are displayed throughout the app">
            <PlaceholderSelect placeholder="YYYY-MM-DD" />
          </SettingRow>
          <SettingRow label="Currency" description="Currency symbol for monetary amounts">
            <PlaceholderSelect placeholder="EUR (€)" />
          </SettingRow>

          {/* Export */}
          <SectionHeader icon={Download} title="Export" />
          <SettingRow label="Export timeline" description="Download all events as CSV or PDF">
            <button
              disabled
              className="text-[12px] px-3 py-1.5 rounded-md opacity-40 cursor-not-allowed"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Coming soon
            </button>
          </SettingRow>

          {/* About */}
          <SectionHeader icon={Info} title="About" />
          <SettingRow label="Version" description="OpenTimeline app version">
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>v0.1.0</span>
          </SettingRow>
          <SettingRow label="Data scope" description="Events tracked in this timeline">
            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>2022 – 2025</span>
          </SettingRow>
        </div>
      </div>
    </div>
  );
}
