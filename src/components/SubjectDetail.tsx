import { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { categoryColors, categoryLabels, statusColors } from '@/data/events';
import TimelineEventItem from './TimelineEventItem';
import type { TimelineEvent } from '@/types';

interface SubjectDetailProps {
  subject: {
    id: number;
    slug: string;
    name: string;
    category: string;
    description: string | null;
    status: string;
    events: any[];
    eventsByYear: Record<number, any[]>;
  } | null;
  onClose: () => void;
  onEventClick: (event: TimelineEvent) => void;
  selectedEventId: string | null;
}

export default function SubjectDetail({ subject, onClose, onEventClick, selectedEventId }: SubjectDetailProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!subject) return null;

  const dotColor = categoryColors[subject.category] || '#a39e93';
  const tagLabel = categoryLabels[subject.category] || subject.category;
  const statusStyle = statusColors[subject.status] || statusColors.resolved;

  const years = Object.keys(subject.eventsByYear).map(Number).sort((a, b) => a - b);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-300" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-screen w-full md:w-[560px] z-50 overflow-y-auto animate-in slide-in-from-right duration-400"
        style={{
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 z-10 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          aria-label="Close panel"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-12">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-[13px] mb-6 transition-colors hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={14} />
            Back to timeline
          </button>

          <span
            className="inline-block px-3 py-1 text-[13px] font-medium rounded mb-4"
            style={{
              backgroundColor: `${dotColor}1a`,
              color: dotColor,
              border: `1px solid ${dotColor}66`,
            }}
          >
            {tagLabel}
          </span>

          <h2 className="font-serif text-4xl leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            {subject.name}
          </h2>

          <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
            {subject.description}
          </p>

          <div className="mb-8">
            <span
              className="inline-block px-3 py-1.5 text-[13px] font-medium rounded-full capitalize"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
            >
              {subject.status}
            </span>
          </div>

          <div className="h-px my-6" style={{ background: 'var(--border)' }} />

          <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-4" style={{ color: 'var(--text-secondary)' }}>
            Case Timeline ({subject.events.length} events)
          </h3>

          <div className="relative">
            <div className="absolute left-[78px] top-0 bottom-0 w-[2px]" style={{ background: 'var(--accent-teal)', opacity: 0.3 }} />

            {years.map((year) => (
              <div key={year} className="mb-8">
                <h4 className="text-2xl font-bold mb-4 ml-2" style={{ color: 'var(--text-primary)' }}>{year}</h4>
                <div className="flex flex-col gap-1">
                  {subject.eventsByYear[year].map((ev) => (
                    <TimelineEventItem
                      key={ev.id}
                      event={ev}
                      onClick={onEventClick}
                      isSelected={selectedEventId === ev.id?.toString()}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
