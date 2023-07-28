import client from '../adapters/apolloClient';
import { useQuery } from '@apollo/client';
import { USER_RESERVE_GQL } from '../graphql/userReserve';

export const useUserReserve = (walletAddress: string) => {
  const { loading, error, data } = useQuery(USER_RESERVE_GQL, { variables: { user: walletAddress }, client },);
  
  if (loading) return { loading };
  if (error) return { error };
  
  return { data };
};