import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import {
   ApolloClient,
   ApolloProvider,
   InMemoryCache,
   createHttpLink
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}, Code: ${extensions?.code}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const client = new ApolloClient({
   link: errorLink.concat(httpLink),
   cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
   <ApolloProvider client={client}>
      <App />
   </ApolloProvider>  
);
