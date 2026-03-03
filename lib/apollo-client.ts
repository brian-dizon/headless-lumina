import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * 1. Endpoint Configuration
 * We pull the WordPress URL from environment variables for security.
 * Fallback to local development port if the variable is missing.
 */
const rawEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:10073/graphql";

/**
 * 2. URL Sanity Check
 * Ensures the endpoint always ends with /graphql, preventing 404 errors.
 */
const GRAPHQL_ENDPOINT = rawEndpoint.endsWith("/graphql") 
  ? rawEndpoint 
  : `${rawEndpoint.replace(/\/$/, "")}/graphql`;

/**
 * 3. Apollo Client Singleton (Enhanced for Auth)
 * @param authToken - Optional Base64 encoded 'user:pass' string.
 * If provided, the client will include an Authorization header and bypass caching.
 */
export const getClient = (authToken?: string) => {
  return new ApolloClient({
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      /**
       * 4. Authorization Headers
       * We use the Spread operator to conditionally add the Authorization header.
       * This is used specifically for fetching private data like Drafts.
       */
      headers: {
        ...(authToken ? { Authorization: `Basic ${authToken}` } : {}),
      },
      /**
       * 5. Dynamic Caching Logic
       * If an authToken is present, we set revalidate to 0.
       * This tells Next.js: "This is private/preview data, do NOT cache it."
       * Otherwise, we stick to our high-performance 60-second ISR cache.
       */
      fetchOptions: {
        next: { revalidate: authToken ? 0 : 60 }, 
      },
    }),
    /**
     * 6. In-Memory Cache
     * Prevents duplicate requests within the same server-side execution.
     */
    cache: new InMemoryCache(),
  });
};
