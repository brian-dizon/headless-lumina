export interface PulseItem {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
}

export interface PulseResponse {
  hits: PulseItem[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}
