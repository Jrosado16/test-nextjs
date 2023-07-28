import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://thegraph.zkevm.testnet.tropykus.com/graphql/subgraphs/name/tropykus-v2-zkevm-testnet',
  cache: new InMemoryCache(),
});

export default client;