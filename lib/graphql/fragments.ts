import { gql } from "@apollo/client";

/**
 * Expert Fields Fragment
 * Defines the standard set of data we need for any Expert profile or card.
 */
export const EXPERT_FIELDS = gql`
  fragment ExpertFields on Expert {
    title
    slug
    expertProfile {
      jobTitle
      bio
      headshot {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

/**
 * Resource Card Fragment
 * Defines the standard data needed to render a ResourceCard component.
 * Composes with the ExpertFields fragment for the expertRelationship.
 */
export const RESOURCE_CARD_FIELDS = gql`
  fragment ResourceCardFields on Resource {
    title
    slug
    date
    modified
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    resourceDetails {
      subtitle
      isPremium
      expertRelationship {
        nodes {
          ...ExpertFields
        }
      }
    }
    topics {
      nodes {
        name
        slug
      }
    }
  }
  ${EXPERT_FIELDS}
`;
