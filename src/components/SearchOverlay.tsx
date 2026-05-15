import { useEffect, useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { trpc } from '@/providers/trpc';
import { categoryColors } from '@/data/events';
import type { TimelineEvent } from '@/types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onEventSelect: (event: TimelineEvent) => void;
}

export default function SearchOverlay({ isOpen, onClose, onEventSelect }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: allEvents } = trpc.event.list.useQuery();

  const results = useMemo(() => {
    if (!query.trim() || !allEvents) return [];
    const q = query.toLowerCase();
    return allEvents.filter((ev: any) =>
      ev.title.toLowerCase().includes(q) ||
      (ev.description ?? '').toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.year.toString().includes(q) ||
      ev.actors.some((a: any) => a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
    );
  }, [query, allEvents]);

  useEffect(() => { setHighlightedIndex(0); }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!isOpen) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex((p) => Math.min(p + 1, results.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex((p) => Math.max(p - 1, 0)); return; }
      if (e.key === 'Enter' && results[highlightedIndex]) {
        onEventSelect(results[highlightedIndex]);
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, results, highlightedIndex, onClose, onEventSelect]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 animate-in fade-in duration-200" onClick={onClose} />
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 animate-in zoom-in-95 fade-in duration-250"
        style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        >
          <div className="relative px-4 pt-4 pb-2">
            <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, categories, actors..."
              className="w-full h-12 pl-10 pr-16 rounded-lg text-[15px] focus:ring-2 focus:ring-accent-teal/30 focus:outline-none"
              style={{
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            />
            <button
              onClick={onClose}
              className="absolute right-7 top-1/2 -translate-y-1/2 text-[11px] transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              ESC
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto px-2 pb-2">
            {results.length === 0 && query.trim() !== '' && (
              <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>No events found</div>
            )}
            {results.length === 0 && query.trim() === '' && (
              <div className="py-8 text-center text-[13px]" style={{ color: 'var(--text-muted)' }}>Type to search events...</div>
            )}
            {results.map((ev: any, i: number) => {
              const dotColor = categoryColors[ev.category] || '#a39e93';
              const isHighlighted = i === highlightedIndex;
              return (
                <button
                  key={ev.id}
                  onClick={() => { onEventSelect(ev); onClose(); }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ background: isHighlighted ? 'var(--bg-base)' : 'transparent' }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                  <span className="flex-1 text-[15px] truncate" style={{ color: 'var(--text-primary)' }}>{ev.title}</span>
                  <span className="text-[11px] shrink-0" style={{ color: 'var(--text-secondary)' }}>{ev.year}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
