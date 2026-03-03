import { gql } from "@apollo/client";
import { EXPERT_FIELDS, RESOURCE_CARD_FIELDS } from "./fragments";

/**
 * Resources Queries
 */
export const GET_RESOURCES = gql`
  query GetLuminaResources($first: Int) {
    resources(first: $first) {
      nodes {
        ...ResourceCardFields
      }
    }
  }
  ${RESOURCE_CARD_FIELDS}
`;

export const GET_RESOURCE_BY_SLUG = gql`
  query GetResourceBySlug($id: ID!, $idType: ResourceIdType!, $asPreview: Boolean) {
    resource(id: $id, idType: $idType, asPreview: $asPreview) {
      title
      content
      ...ResourceCardFields
    }
  }
  ${RESOURCE_CARD_FIELDS}
`;

export const GET_ALL_RESOURCE_SLUGS = gql`
  query GetAllResourceSlugs {
    resources(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

/**
 * Experts Queries
 */
export const GET_EXPERTS = gql`
  query GetExpertsData($first: Int) {
    experts(first: $first) {
      nodes {
        ...ExpertFields
      }
    }
  }
  ${EXPERT_FIELDS}
`;

export const GET_EXPERT_BY_SLUG = gql`
  query GetExpertBySlug($slug: ID!) {
    expert(id: $slug, idType: SLUG) {
      ...ExpertFields
    }
    # Fetch resources at root for client-side filtering workaround
    resources(first: 100) {
      nodes {
        ...ResourceCardFields
      }
    }
  }
  ${EXPERT_FIELDS}
  ${RESOURCE_CARD_FIELDS}
`;

export const GET_ALL_EXPERT_SLUGS = gql`
  query GetAllExpertSlugs {
    experts(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

/**
 * Topics Queries
 */
export const GET_RESOURCES_BY_TOPIC = gql`
  query GetResourcesByTopic($topicSlug: [String]!) {
    topics(where: { slug: $topicSlug }) {
      nodes {
        name
        description
        resources {
          nodes {
            ...ResourceCardFields
          }
        }
      }
    }
  }
  ${RESOURCE_CARD_FIELDS}
`;

export const GET_ALL_TOPIC_SLUGS = gql`
  query GetAllTopics {
    topics(first: 100) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

/**
 * Page Blocks Query (About Page)
 */
export const GET_PAGE_BLOCKS = gql`
  query GetPageBlocks($id: ID!, $idType: PageIdType) {
    page(id: $id, idType: $idType) {
      title
      editorBlocks {
        name
        renderedHtml
        ... on CoreHeading {
          attributes {
            level
          }
        }
        ... on CoreQuote {
          attributes {
            value
          }
        }
      }
    }
  }
`;

/**
 * Search Resources Query
 * Performs a high-speed keyword search on titles and content.
 */
export const SEARCH_RESOURCES = gql`
  query SearchResources($search: String!) {
    resources(where: { search: $search }, first: 5) {
      nodes {
        id
        title
        slug
        resourceDetails {
          subtitle
        }
      }
    }
  }
`;
