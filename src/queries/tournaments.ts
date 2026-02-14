import {gql} from '@apollo/client';
import { SMASH_ULTIMATE_ID } from '../api/constants';

export const GET_TOURNAMENTS = gql`
query TournamentsByState($perPage: Int, $state: String!) {
        tournaments(query: {
        perPage: $perPage
        filter: {
            addrState: $state
            upcoming: true
            videogameIds: [${SMASH_ULTIMATE_ID}]
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