import { useState, useEffect } from 'react';
import { useApolloClient } from "@apollo/client";
import { GET_TOURNAMENTS } from "../queries/tournaments";
import { getCache, setCache } from '../api/cache';
import { TournamentsByStateQuery, TournamentsByStateQueryVariables } from '../gql/graphql';
import { SMASH_ULTIMATE_ID } from '../api/constants';

type TournamentNode = NonNullable<NonNullable<TournamentsByStateQuery['tournaments']>['nodes']>[number];

export const useTournamentsByState = (state: string, perPage: number = 10) => {
    const [tournaments, setTournaments] = useState<TournamentNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const client = useApolloClient();

    useEffect(() => {
        const fetchTournaments = async () => {
            const cacheKey = `tournaments-${state}-${perPage}`;
            const cachedData = getCache<TournamentNode[]>(cacheKey);

            if (cachedData) {
                setTournaments(cachedData);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const { data } = await client.query<TournamentsByStateQuery, TournamentsByStateQueryVariables>({
                    query: GET_TOURNAMENTS,
                    variables: { 
                        state, 
                        perPage,
                        videogameId: SMASH_ULTIMATE_ID
                    },
                });

                const nodes = (data?.tournaments?.nodes || []).filter((n): n is TournamentNode => !!n);
                setTournaments(nodes);
                setCache(cacheKey, nodes);
            } catch (err) {
                console.error('Error fetching tournaments:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, [state, perPage, client]);

    return { loading, error, tournaments };
}