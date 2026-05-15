import { useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import { categoryColors, categoryLabels, statusColors } from '@/data/events';
import type { TimelineEvent } from '@/types';
import { trpc } from '@/providers/trpc';

interface DetailPanelProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

export default function DetailPanel({ event, onClose }: DetailPanelProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Fetch related events from slugs
  const { data: allEvents } = trpc.event.list.useQuery();

  if (!event) return null;

  const dotColor = categoryColors[event.category] || '#a39e93';
  const tagLabel = categoryLabels[event.category] || event.category;
  const statusStyle = statusColors[event.status] || statusColors.resolved;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const dateDisplay = event.endDate
    ? `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`
    : event.ongoing
      ? `Ongoing since ${formatDate(event.startDate)}`
      : formatDate(event.startDate);

  // Find related events from slugs
  const relatedSlugs = (event.relatedSlugs as string[] | null) || [];
  const relatedEvents = relatedSlugs
    .map((slug: string) => allEvents?.find((e: any) => e.slug === slug))
    .filter(Boolean) as any[];

  const evidence = ((event as any).evidence as Array<{label: string; filename: string}> | null) || [];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-300" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-screen w-full md:w-[480px] z-50 overflow-y-auto animate-in slide-in-from-right duration-400"
        style={{
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <button onClick={onClose} className="absolute top-5 right-5 p-1 z-10 transition-colors" style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          aria-label="Close panel"
        >
          <X size={24} />
        </button>

        <div className="p-8 pt-12">
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
            {event.title}
          </h2>

          <p className="text-[13px] mb-6" style={{ color: 'var(--text-secondary)' }}>{dateDisplay}</p>

          <div className="h-px my-5" style={{ background: 'var(--border)' }} />

          <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text-primary)', opacity: 0.9 }}>
            {event.description}
          </p>

          {/* Status */}
          <div className="mb-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-secondary)' }}>Status</h3>
            <span className="inline-block px-3 py-1.5 text-[13px] font-medium rounded-full capitalize" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
              {event.status}
            </span>
          </div>

          {/* Actors */}
          {event.actors && event.actors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-secondary)' }}>Actors</h3>
              <div className="flex flex-wrap gap-2">
                {event.actors.map((actor, i) => (
                  <span key={i} className="px-3 py-1.5 text-[13px] rounded" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    {actor.name} <span style={{ color: 'var(--text-secondary)' }}>— {actor.role}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {evidence.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-secondary)' }}>Evidence</h3>
              <div className="flex flex-col gap-2">
                {evidence.map((ev: any, i: number) => (
                  <span key={i} className="flex items-center gap-2 text-[13px] group" style={{ color: 'var(--accent-teal)' }}>
                    <FileText size={14} className="shrink-0 opacity-60" />
                    {ev.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] mb-3" style={{ color: 'var(--text-secondary)' }}>Related</h3>
              <div className="flex flex-col gap-2">
                {relatedEvents.map((rel) => {
                  const relColor = categoryColors[rel.category] || '#a39e93';
                  return (
                    <span key={rel.id} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: relColor }} />
                      {rel.title}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
