import {gql} from '@apollo/client';

export const GET_TOURNAMENTS = gql`
query TournamentsByState($perPage: Int, $state: String!, $videogameId: ID!) {
        tournaments(query: {
        perPage: $perPage
        filter: {
            addrState: $state
            upcoming: true
            videogameIds: [$videogameId]
        }
        sortBy: "startAt asc"
        }) {
        nodes {
            id
            name
            addrState
            venueAddress
            numAttendees
            startAt
            slug
            images {
                id
                url
                height
                width
                type
            }
        }
        }
    }
`;