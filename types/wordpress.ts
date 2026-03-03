/**
 * Shared WordPress Media Types
 */
export interface WPMediaNode {
  sourceUrl: string;
  altText?: string | null;
}

export interface WPMediaItem {
  node: WPMediaNode | null;
}

/**
 * Taxonomy Types
 */
export interface WPTopic {
  name: string;
  slug: string;
}

export interface WPTopicNode {
  nodes: WPTopic[];
}

/**
 * Expert Types
 */
export interface WPExpert {
  title: string;
  slug: string;
  expertProfile?: {
    jobTitle?: string | null;
    bio?: string | null;
    headshot?: WPMediaItem | null;
  } | null;
}

export interface WPExpertNode {
  nodes: WPExpert[];
}

/**
 * Resource Types
 */
export interface WPResource {
  title: string;
  slug: string;
  content?: string;
  date?: string;
  modified?: string;
  featuredImage?: WPMediaItem | null;
  resourceDetails?: {
    subtitle?: string | null;
    isPremium?: boolean | null;
    expertRelationship?: WPExpertNode | null;
  } | null;
  topics?: WPTopicNode | null;
}

export interface WPResourceNode {
  nodes: WPResource[];
}

/**
 * Block Types (Gutenberg)
 */
export interface WPBlock {
  name: string;
  renderedHtml: string;
  attributes?: {
    level?: number;
    [key: string]: unknown;
  } | null;
}
