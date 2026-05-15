import { useState } from 'react';
import { categoryColors, categoryLabels } from '@/data/events';
import type { TimelineEvent } from '@/types';

interface TimelineEventItemProps {
  event: TimelineEvent;
  onClick: (event: TimelineEvent) => void;
  isSelected: boolean;
}

export default function TimelineEventItem({ event, onClick, isSelected }: TimelineEventItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dotColor = categoryColors[event.category] || '#a39e93';
  const tagLabel = categoryLabels[event.category] || event.category;

  const formatDate = (dateStr: string | null, ongoing: boolean) => {
    if (!dateStr) return ongoing ? 'Ongoing' : '';
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  const dateDisplay = event.endDate
    ? `${formatDate(event.startDate, false)} – ${formatDate(event.endDate, false)}`
    : event.ongoing
      ? `${formatDate(event.startDate, false)} – Ongoing`
      : formatDate(event.startDate, false);

  return (
    <div
      onClick={() => onClick(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center py-3 px-6 cursor-pointer transition-all duration-150 ease-out rounded"
      style={{
        background: isSelected || isHovered ? 'var(--bg-card)' : 'transparent',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(event); }}
    >
      {isSelected && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r transition-all duration-200"
          style={{ background: 'var(--accent-teal)' }}
        />
      )}

      <span
        className="w-[140px] shrink-0 text-[13px] tabular-nums"
        style={{ color: 'var(--text-secondary)' }}
      >
        {dateDisplay}
      </span>

      <span
        className="w-2 h-2 rounded-full shrink-0 mr-3 transition-transform duration-150"
        style={{
          backgroundColor: dotColor,
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
        }}
      />

      <span
        className="flex-1 text-[15px] transition-colors duration-150"
        style={{ color: isHovered ? 'var(--text-primary)' : 'var(--text-primary)' }}
      >
        {event.title}
      </span>

      <span
        className="shrink-0 ml-3 px-2 py-0.5 text-[11px] font-medium rounded"
        style={{
          backgroundColor: `${dotColor}1a`,
          color: dotColor,
          border: `1px solid ${dotColor}66`,
        }}
      >
        {tagLabel}
      </span>
    </div>
  );
}
