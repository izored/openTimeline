export type Category = 'legal' | 'debt' | 'job' | 'bv' | 'personal' | 'admin';

export type Status = 'open' | 'pending' | 'resolved' | 'blocked';

export interface Actor {
  name: string;
  role: string;
}

export interface Evidence {
  label: string;
  filename: string;
}

// This matches what the tRPC API returns
export interface TimelineEvent {
  id: number | string;
  slug: string;
  title: string;
  category: string;
  year: number;
  startDate: string;
  endDate: string | null;
  ongoing: boolean;
  status: string;
  description: string | null;
  actors: Actor[];
  evidence: unknown;
  relatedSlugs: unknown;
  // May include extra fields from API
  [key: string]: unknown;
}

export interface Subject {
  id: number | string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  status: string;
}
