import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      slug
      player {
        id
        gamerTag
      }
    }
  }
`;

export const GET_PLAYER_SETS = gql`
  query GetPlayerSets($playerId: ID!, $page: Int!, $perPage: Int!) {
    player(id: $playerId) {
      id
      sets(page: $page, perPage: $perPage) {
        pageInfo {
          totalPages
        }
        nodes {
          id
          fullRoundText
          displayScore
          totalGames
          winnerId
          completedAt
          event {
            id
            name
            tournament {
              id
              name
            }
          }
          games {
            id
            selections {
              entrant {
                id
              }
              selectionType
              selectionValue
            }
          }
          slots {
            entrant {
              id
              name
              participants {
                id
                player {
                  id
                }
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
