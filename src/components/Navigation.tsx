import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Settings, Sun, Moon, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme } from '@/providers/theme';

// ─── Shared sidebar used on every full page ───────────────────────────────────
// Pass years=[] and omit callbacks for pages that don't need timeline controls.

export interface NavigationProps {
  activeYear: number;
  years: number[];
  onYearClick: (year: number) => void;
  onSearchClick?: () => void;
  onAddEventClick?: () => void;
}

// Each action button has its own accent color for the pill hover state
interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  to?: string;
  accentColor: string;     // e.g. '#4a9eff'
  accentBg: string;        // e.g. 'rgba(74,158,255,0.12)'
  isActive?: boolean;
}

function NavButton({ icon: Icon, label, onClick, to, accentColor, accentBg, isActive }: NavButtonProps) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  const style: React.CSSProperties = {
    color: active ? accentColor : 'var(--text-secondary)',
    background: active ? accentBg : 'transparent',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    fontSize: '13.5px',
    fontWeight: 500,
    transition: 'color 0.15s, background 0.15s',
    width: '100%',
    position: 'relative',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'left',
  };

  const inner = (
    <>
      {isActive && (
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '18px',
            background: accentColor,
            borderRadius: '0 3px 3px 0',
          }}
        />
      )}
      <Icon size={15} style={{ color: active ? accentColor : 'var(--text-muted)', transition: 'color 0.15s', flexShrink: 0 }} />
      {label}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        style={style}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}

export default function Navigation({ activeYear, years, onYearClick, onSearchClick, onAddEventClick }: NavigationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const onSettings = location.pathname === '/settings';

  // On pages without handlers (e.g. Settings), fall back to navigating home
  const handleSearch = onSearchClick ?? (() => navigate('/'));
  const handleAddEvent = onAddEventClick ?? (() => navigate('/'));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-40 bg-bg-nav divider-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-teal flex items-center justify-center">
              <span className="text-xs font-bold text-white">T</span>
            </div>
            <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">OpenTimeline</span>
          </div>
          <div className="flex items-center gap-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearClick(year)}
                className={`px-2 py-1 text-xs font-semibold rounded transition-all duration-200 ${
                  activeYear === year ? 'text-accent-teal bg-accent-teal/10' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {year}
              </button>
            ))}
            <button onClick={handleSearch} className="p-2 rounded text-text-secondary hover:text-[#4a9eff] transition-colors">
              <Search size={16} />
            </button>
            <button onClick={handleAddEvent} className="p-2 rounded text-text-secondary hover:text-accent-teal transition-colors">
              <Plus size={16} />
            </button>
            <Link
              to="/settings"
              className={`p-2 rounded transition-colors ${onSettings ? 'text-[#9b6dff]' : 'text-text-secondary hover:text-[#9b6dff]'}`}
            >
              <Settings size={16} />
            </Link>
            <button onClick={toggle} className="p-2 rounded text-text-secondary hover:text-text-primary transition-colors">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <nav
      className="fixed top-0 left-0 h-screen w-[240px] bg-bg-nav z-40 flex flex-col p-6"
      style={{ transition: 'background-color 0.3s ease' }}
    >
      {/* Greeting — contextual: changes on settings page */}
      <div className="mb-8">
        <p className="text-[15px] font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
          {onSettings ? 'Settings' : 'Good to see you.'}
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {onSettings ? 'Configure your experience.' : 'Your timeline is up to date.'}
        </p>
      </div>

      {/* Action buttons — always rendered, each with its own accent color pill */}
      <div className="flex flex-col gap-0.5">
        <NavButton
          icon={Search}
          label="Search Events"
          onClick={handleSearch}
          accentColor="#4a9eff"
          accentBg="rgba(74, 158, 255, 0.12)"
        />
        <NavButton
          icon={Plus}
          label="Add Event"
          onClick={handleAddEvent}
          accentColor="var(--accent-teal)"
          accentBg="rgba(45, 212, 168, 0.12)"
        />
        <NavButton
          icon={Settings}
          label="Settings"
          to="/settings"
          accentColor="#9b6dff"
          accentBg="rgba(155, 109, 255, 0.12)"
          isActive={onSettings}
        />
      </div>

      {/* Year links — below nav actions */}
      {years.length > 0 && (
        <div className="flex flex-col gap-1 mt-6">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearClick(year)}
              className={`relative text-left py-2 px-3 text-[28px] font-bold transition-all duration-200 ease-out rounded-md ${
                activeYear === year
                  ? 'text-accent-teal'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {activeYear === year && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-accent-teal rounded-r" />
              )}
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Theme toggle */}
      <div className="mt-auto pt-4 divider-t">
        <button
          onClick={toggle}
          className="flex items-center gap-2 py-2 px-3 w-full text-[13.5px] font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-card transition-all duration-150"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="px-3 pt-2 flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-teal)' }}>OpenTimeline</p>
          <p className="text-[10px] text-text-muted">Press Cmd+K to search</p>
        </div>
      </div>
    </nav>
  );
}
