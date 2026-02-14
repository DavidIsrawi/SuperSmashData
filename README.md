# SuperSmashData

SuperSmashData is a performance-focused dashboard for Super Smash Bros. competitive players. It leverages the [start.gg](https://www.start.gg) API to provide deep insights into player performance, character usage, and local tournament activity.

## Key Features

- **Player Profile**: Comprehensive overview of your competitive history, including:
    - **Top Characters**: Automatic identification of your most-used characters based on set selection data.
    - **Activity Summary**: Tracking of total sets, unique characters, and tournaments played over your last 300 sets.
- **Performance Analysis**: Deep dive into your competitive "clutch" and consistency:
    - **Clutch Factor**: Win rate calculation for "deciding games" (e.g., game 3 in a Best of 3, or game 5 in a Best of 5).
    - **Recent Form**: Visual representation of your last 10 sets and current win/loss streak.
    - **Gatekeepers**: Identification of players who have most frequently knocked you out of brackets and at which rounds.
    - **Bracket Performance**: Breakdown of win rates by specific bracket rounds (Winners, Losers, and Finals).
- **Tournament Finder**: Discover local competitive opportunities:
    - **State-based Discovery**: Lists upcoming and recent tournaments in specific regions (currently focused on WA).
    - **Direct Links**: Quick access to start.gg tournament pages for registration and details.

## Tech Stack

- **Frontend**: React (TypeScript)
- **Routing**: React Router
- **Data Fetching**: GraphQL via start.gg API
- **Styling**: Vanilla CSS

## Getting Started

### Prerequisites

- Node.js and Yarn/npm
- A start.gg API Token (configured in `.env`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DavidIsrawi/SuperSmashData.git
   cd SuperSmashData
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create a `.env` file in the root directory and add your start.gg token:
   ```env
   REACT_APP_STARTGG_API_TOKEN=your_token_here
   ```

4. Start the development server:
   ```bash
   yarn start
   ```

## Scripts

- `yarn start`: Runs the app in development mode.
- `yarn build`: Builds the app for production.
- `yarn test`: Launches the test runner.
