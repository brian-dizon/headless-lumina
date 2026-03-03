import { gql } from "@apollo/client";

/**
 * Create Lead Mutation
 * This mutation creates a new post in the 'Leads' CPT.
 * We map the user's name to the Title and their email/message to the Content.
 */
export const CREATE_LEAD_MUTATION = gql`
  mutation CreateLead($title: String!, $content: String!) {
    createLead(input: { title: $title, content: $content, status: PUBLISH }) {
      lead {
        databaseId
        title
      }
    }
  }
`;
