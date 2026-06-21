export interface Contest {
  title: string;
  url: string;
  organizer: string;
  genres: string[];
  deadline: string | null; // YYYY-MM-DD
  dday: string;
  status: string;
  summary: string;
  prize: string;
  eligibility: string;
  sources: string[];
}

export interface ContestPayload {
  generated_at: string;
  count: number;
  contests: Contest[];
}
