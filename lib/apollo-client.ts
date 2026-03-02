import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const rawEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "http://localhost:10073/graphql";

const GRAPHQL_ENDPOINT = rawEndpoint.endsWith("/graphql") ? rawEndpoint : `${rawEndpoint.replace(/\/$/, "")}/graphql`;

export const getClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: GRAPHQL_ENDPOINT,
      fetchOptions: {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    }),
    cache: new InMemoryCache(),
  });
};
