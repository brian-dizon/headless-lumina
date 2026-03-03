import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * 1. Endpoint Configuration
 * We pull the WordPress URL from environment variables for security.
 * Fallback to local development port if the variable is missing.
 */
const rawEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:10073/graphql";

/**
 * 2. URL Sanity Check
 * Ensures the endpoint always ends with /graphql, preventing 404 errors
 * if the user accidentally omits it in the .env file.
 */
const GRAPHQL_ENDPOINT = rawEndpoint.endsWith("/graphql") 
  ? rawEndpoint 
  : `${rawEndpoint.replace(/\/$/, "")}/graphql`;

/**
 * 3. Apollo Client Singleton (Server-Side)
 * This function returns a fresh Apollo Client instance for fetching data.
 * In Next.js 15, we use this inside Server Components.
 */
export const getClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      /**
       * 4. Next.js Data Cache Integration
       * By passing 'fetchOptions', we tell Next.js to use its native
       * Incremental Static Regeneration (ISR). This caches WP data 
       * for 60 seconds before checking for updates.
       */
      fetchOptions: {
        next: { revalidate: 60 }, 
      },
    }),
    /**
     * 5. In-Memory Cache
     * Stores query results in RAM during the lifecycle of the request
     * to prevent redundant network calls for the same data.
     */
    cache: new InMemoryCache(),
  });
};
