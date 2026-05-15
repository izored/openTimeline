import { useState } from 'react';
import { X } from 'lucide-react';
import { trpc } from '@/providers/trpc';

interface AddEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Array<{ id: number; slug: string; name: string }>;
  actors: Array<{ id: number; name: string; role: string }>;
  onSuccess: () => void;
}

export default function AddEventForm({ isOpen, onClose, subjects, actors, onSuccess }: AddEventFormProps) {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'legal' | 'debt' | 'job' | 'bv' | 'personal' | 'admin'>('legal');
  const [year, setYear] = useState(2025);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ongoing, setOngoing] = useState(false);
  const [status, setStatus] = useState<'open' | 'pending' | 'resolved' | 'blocked'>('open');
  const [description, setDescription] = useState('');
  const [selectedActorIds, setSelectedActorIds] = useState<number[]>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [error, setError] = useState('');

  const createEvent = trpc.event.create.useMutation({
    onSuccess: () => {
      resetForm();
      onSuccess();
      onClose();
    },
    onError: (err) => setError(err.message),
  });

  function resetForm() {
    setSlug('');
    setTitle('');
    setCategory('legal');
    setYear(2025);
    setStartDate('');
    setEndDate('');
    setOngoing(false);
    setStatus('open');
    setDescription('');
    setSelectedActorIds([]);
    setSelectedSubjectIds([]);
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!slug || !title || !startDate || !description) {
      setError('Please fill in all required fields');
      return;
    }

    createEvent.mutate({
      slug,
      title,
      category,
      year,
      startDate,
      endDate: endDate || null,
      ongoing,
      status,
      description,
      actorIds: selectedActorIds,
      subjectIds: selectedSubjectIds,
      evidence: [],
      relatedSlugs: [],
    });
  }

  function toggleActor(id: number) {
    setSelectedActorIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  function toggleSubject(id: number) {
    setSelectedSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in duration-200" onClick={onClose} />
      <div
        className="fixed top-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] max-h-[90vh] overflow-y-auto z-50 animate-in zoom-in-95 fade-in duration-250"
        style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="bg-bg-card rounded-xl border shadow-2xl overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xl font-semibold text-text-primary">Add New Event</h2>
            <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Slug *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ev-2025-16"
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Year *</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="w-full h-10 px-3 rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent-teal/30"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof category)}
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                >
                  <option value="legal">Legal</option>
                  <option value="debt">Debt</option>
                  <option value="job">Job</option>
                  <option value="bv">BV</option>
                  <option value="personal">Personal</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as typeof status)}
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent-teal/30"
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ongoing}
                onChange={(e) => setOngoing(e.target.checked)}
                className="w-4 h-4 rounded accent-accent-teal"
              />
              <span className="text-sm text-text-secondary">Ongoing event</span>
            </label>

            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event description..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent-teal/30 resize-none"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
              />
            </div>

            {/* Actors selection */}
            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-2">Actors</label>
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                {actors.map((actor) => (
                  <button
                    key={actor.id}
                    type="button"
                    onClick={() => toggleActor(actor.id)}
                    className={`px-3 py-1.5 text-[12px] rounded-full border transition-colors ${
                      selectedActorIds.includes(actor.id)
                        ? 'bg-accent-teal text-white border-accent-teal'
                        : 'bg-transparent text-text-secondary border-white/10 hover:border-accent-teal/50'
                    }`}
                  >
                    {actor.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects selection */}
            <div>
              <label className="block text-[12px] font-medium text-text-secondary uppercase tracking-wider mb-2">Subjects</label>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`px-3 py-1.5 text-[12px] rounded-full border transition-colors ${
                      selectedSubjectIds.includes(subject.id)
                        ? 'bg-accent-teal text-white border-accent-teal'
                        : 'bg-transparent text-text-secondary border-white/10 hover:border-accent-teal/50'
                    }`}
                  >
                    {subject.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={createEvent.isPending}
                className="flex-1 h-10 bg-accent-teal text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {createEvent.isPending ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 text-text-secondary font-medium rounded-lg hover:bg-bg-base transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
