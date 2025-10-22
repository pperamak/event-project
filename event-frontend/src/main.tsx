import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import {
   ApolloClient,
   ApolloProvider,
   InMemoryCache,
   createHttpLink,
   from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthProvider } from './hooks/useAuth.tsx';

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const authLink = setContext((_: unknown, { headers }: { headers?: Record<string, string>}) => {
  const token = localStorage.getItem("events-user-token");
  return {
    headers: {
      ...(headers ?? {}),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
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

const link = from([errorLink, authLink, httpLink]);

const client = new ApolloClient({
   link: link,
   cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
   <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
      
   </ApolloProvider>  
);
