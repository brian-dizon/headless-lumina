import { WPResource, WPResourceNode, WPExpert, WPExpertNode, WPBlock } from "./wordpress";

/**
 * Common Response Wrapper
 */
export interface GQLResponse<T> {
  data: T;
  errors?: unknown[];
}

/**
 * Resource Queries
 */
export interface GetResourcesData {
  resources: WPResourceNode;
}

export interface SingleResourceData {
  resource: WPResource | null;
}

export interface AllResourceSlugsData {
  resources: {
    nodes: Array<{ slug: string }>;
  };
}

/**
 * Expert Queries
 */
export interface GetExpertsData {
  experts: WPExpertNode;
}

export interface SingleExpertData {
  expert: WPExpert | null;
  resources: WPResourceNode;
}

export interface AllExpertSlugsData {
  experts: {
    nodes: Array<{ slug: string }>;
  };
}

/**
 * Topic Queries
 */
export interface TopicPageData {
  topics: {
    nodes: Array<{
      name: string;
      description: string | null;
      resources: WPResourceNode;
    }>;
  };
}

export interface GetAllTopicsData {
  topics: {
    nodes: Array<{ slug: string }>;
  };
}

/**
 * Page Queries (About Us)
 */
export interface AboutPageData {
  page: {
    title: string;
    editorBlocks: WPBlock[] | null;
  } | null;
}
