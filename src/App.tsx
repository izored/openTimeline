import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { trpc } from '@/providers/trpc';
import Navigation from '@/components/Navigation';
import TimelineEventItem from '@/components/TimelineEventItem';
import DetailPanel from '@/components/DetailPanel';
import SearchOverlay from '@/components/SearchOverlay';
import SubjectDetail from '@/components/SubjectDetail';
import AddEventForm from '@/components/AddEventForm';
import { events as demoEvents, subjects as demoSubjects } from '@/data/events';
import type { TimelineEvent } from '@/types';
import './App.css';

function App() {
  const [activeYear, setActiveYear] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Fetch data from API
  const { data: eventsByYearData, refetch: refetchEvents } = trpc.event.byYear.useQuery();
  const { data: subjectsApiData, refetch: refetchSubjects } = trpc.subject.list.useQuery();
  const { data: actorsData } = trpc.actor.list.useQuery();
  const { data: selectedSubjectData } = trpc.subject.bySlug.useQuery(
    { slug: selectedSubjectSlug! },
    { enabled: !!selectedSubjectSlug }
  );

  // Fall back to demo data when DB not connected
  const demoEventsByYear = demoEvents.reduce<Record<number, TimelineEvent[]>>((acc, ev) => {
    if (!acc[ev.year]) acc[ev.year] = [];
    acc[ev.year].push(ev);
    return acc;
  }, {});
  const hasApiData = eventsByYearData && Object.keys(eventsByYearData).length > 0;
  const eventsByYear = hasApiData ? eventsByYearData : demoEventsByYear;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subjectsData: any[] = (subjectsApiData && subjectsApiData.length > 0) ? subjectsApiData : demoSubjects;

  // Derive years from data
  const years = Object.keys(eventsByYear).map(Number).sort((a, b) => b - a);

  // Check mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, []);

  // Intersection Observer for active year
  useEffect(() => {
    if (years.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = parseInt(entry.target.getAttribute('data-year') || '2022', 10);
            setActiveYear(year);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px', threshold: 0 }
    );

    Object.values(yearRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [years.length, eventsByYearData]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollToYear = useCallback((year: number) => {
    const el = yearRefs.current[year];
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -40 });
    }
  }, []);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEvent(event);
    if (lenisRef.current) lenisRef.current.stop();
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
    if (lenisRef.current) lenisRef.current.start();
  }, []);

  const handleSubjectClick = useCallback((slug: string) => {
    setSelectedSubjectSlug(slug);
    if (lenisRef.current) lenisRef.current.stop();
  }, []);

  const handleCloseSubject = useCallback(() => {
    setSelectedSubjectSlug(null);
    if (lenisRef.current) lenisRef.current.start();
  }, []);

  const handleEventAdded = useCallback(() => {
    refetchEvents();
    refetchSubjects();
  }, [refetchEvents, refetchSubjects]);

  // Total stats
  const totalEvents = Object.values(eventsByYear).reduce((sum, arr) => sum + arr.length, 0);
  const totalActors = actorsData?.length ?? new Set(demoEvents.flatMap((e) => e.actors.map((a) => a.name))).size;
  const totalSubjects = subjectsData.length;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', transition: 'background-color 0.3s ease' }}>
      <Navigation
        activeYear={activeYear}
        years={years}
        onYearClick={scrollToYear}
        onSearchClick={() => setIsSearchOpen(true)}
        onAddEventClick={() => setIsAddEventOpen(true)}
      />

      <div className="min-h-screen" style={{ marginLeft: isMobile ? 0 : '240px', paddingTop: isMobile ? '60px' : 0 }}>
        <div className="max-w-[900px] mx-auto px-8 py-12">
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-5xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              My Timeline
            </h1>
            <p className="text-[15px] max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A personal record of events, proceedings, and milestones —
              organised by year, tagged by subject and actor.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <StatBadge value={totalEvents} label="Total Events" />
              <StatBadge value={totalSubjects} label="Subjects" />
              <StatBadge value={years.length} label="Years" />
              <StatBadge value={totalActors} label="Actors" />
            </div>

            {/* Subject pills */}
            {subjectsData && subjectsData.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {subjectsData.map((sub) => {
                  const colors: Record<string, string> = {
                    legal: '#e85d5d', debt: '#f5a623', job: '#4a9eff',
                    bv: '#9b6dff', personal: 'var(--accent-teal)', admin: 'var(--dot-admin)',
                  };
                  const dotColor = colors[sub.category] || '#a39e93';
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSubjectClick(sub.slug)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full transition-colors hover:border-accent-teal/50"
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                      {sub.name.split('—')[0].trim()}
                    </button>
                  );
                })}
              </div>
            )}
          </header>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline spine */}
            <div
              className="absolute top-0 bottom-0 w-[2px]"
              style={{ left: '152px', background: 'var(--accent-teal)', opacity: 0.3 }}
            />

            {years.map((year: number) => (
              <div
                key={year}
                ref={(el) => { yearRefs.current[year] = el; }}
                data-year={year}
                className="mb-16"
              >
                <div className="relative mb-8" style={{ height: '56px' }}>
                  <h2 className="absolute left-0 bottom-0 text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {year}
                  </h2>
                  <span
                    className="absolute bottom-[10px] text-[13px]"
                    style={{ left: '160px', color: 'var(--text-secondary)' }}
                  >
                    {eventsByYear[year]?.length || 0} events
                  </span>
                </div>

                <div className="flex flex-col gap-1 ml-4">
                  {eventsByYear[year]?.map((ev) => (
                    <TimelineEventItem
                      key={String(ev.id)}
                      event={ev}
                      onClick={handleEventClick}
                      isSelected={selectedEvent?.id === ev.id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="mt-24 pt-8 divider-t">
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
              OpenTimeline — {hasApiData ? 'Live data via API.' : 'Demo data mode.'}{' '}
              {totalEvents} events across {totalSubjects} subject areas.
            </p>
          </footer>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedEvent && <DetailPanel event={selectedEvent} onClose={handleCloseDetail} />}

      {/* Subject Detail */}
      {selectedSubjectSlug && selectedSubjectData && (
        <SubjectDetail
          subject={selectedSubjectData as any}
          onClose={handleCloseSubject}
          onEventClick={handleEventClick}
          selectedEventId={selectedEvent?.id?.toString() || null}
        />
      )}

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onEventSelect={handleEventClick}
      />

      {/* Add Event Form */}
      {isAddEventOpen && (
        <AddEventForm
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          subjects={subjectsData?.map((s) => ({ id: s.id, slug: s.slug, name: s.name })) ?? []}
          actors={actorsData?.map((a) => ({ id: a.id, name: a.name, role: a.role })) ?? []}
          onSuccess={handleEventAdded}
        />
      )}

    </div>
  );
}

function StatBadge({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold" style={{ color: 'var(--accent-teal)' }}>{value}</span>
      <span className="text-[12px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

export default App;
