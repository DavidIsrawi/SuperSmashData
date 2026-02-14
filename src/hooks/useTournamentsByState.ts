import { useState, useEffect } from 'react';
import { useApolloClient } from "@apollo/client";
import { GET_TOURNAMENTS } from "../queries/tournaments";
import { getCache, setCache } from '../api/cache';

export const useTournamentsByState = (state: string, perPage: string = '10') => {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const client = useApolloClient();

    useEffect(() => {
        const fetchTournaments = async () => {
            const cacheKey = `tournaments-${state}-${perPage}`;
            const cachedData = getCache<any[]>(cacheKey);

            if (cachedData) {
                setTournaments(cachedData);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const { data } = await client.query({
                    query: GET_TOURNAMENTS,
                    variables: { state, perPage },
                });

                const nodes = data?.tournaments?.nodes || [];
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