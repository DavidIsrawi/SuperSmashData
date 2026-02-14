import React, { useMemo } from 'react';
import { usePlayerSets } from './hooks/usePlayerSets';
import { useCurrentUser } from './hooks/useCurrentUser';
import './styles/Performance.css';

export const Performance = () => {
  const { userData, loading: userLoading } = useCurrentUser();
  const playerId = userData?.currentUser?.player?.id;
  const userId = userData?.currentUser?.id;
  const userGamerTag = userData?.currentUser?.player?.gamerTag;

  const { sets, loading: setsLoading, error: setsError } = usePlayerSets(playerId, 300);

  const stats = useMemo(() => {
    if (!sets || sets.length === 0 || !playerId) return null;

    const roundStats: Record<string, { wins: number; total: number }> = {};
    const gatekeepers: Record<string, { count: number; rounds: Set<string> }> = {};
    const recentForm: { isWinner: boolean; opponent: string; score: string }[] = [];
    let clutchWins = 0;
    let clutchTotal = 0;

    const pId = playerId.toString();
    const uId = userId?.toString();

    sets.forEach((set: any) => {
      const round = set.fullRoundText;
      
      // Identify the user's slot and the opponent's slot
      let userSlotIndex = -1;
      set.slots.forEach((slot: any, index: number) => {
        const isUser = slot.entrant?.participants?.some((p: any) => 
          p.player?.id?.toString() === pId || (uId && p.user?.id?.toString() === uId)
        );
        if (isUser) userSlotIndex = index;
      });

      if (userSlotIndex === -1) return;

      const userEntrant = set.slots[userSlotIndex].entrant;
      if (!userEntrant) return;

      const isWinner = set.winnerId?.toString() === userEntrant.id.toString();
      const opponentSlot = set.slots.find((_: any, index: number) => index !== userSlotIndex);
      const opponentName = opponentSlot?.entrant?.name || 'Unknown';

      // Recent Form (last 10)
      if (recentForm.length < 10) {
        recentForm.push({ 
          isWinner, 
          opponent: opponentName, 
          score: set.displayScore || 'N/A' 
        });
      }

      // Round Stats
      if (!roundStats[round]) roundStats[round] = { wins: 0, total: 0 };
      roundStats[round].total++;
      if (isWinner) roundStats[round].wins++;

      // Clutch Factor (Deciding Game sets: 2-1 or 3-2)
      if (set.displayScore) {
        const scores = set.displayScore.match(/(\d+)/g);
        if (scores && scores.length >= 2) {
          const s1 = parseInt(scores[0]);
          const s2 = parseInt(scores[1]);
          const isClose = Math.abs(s1 - s2) === 1 && (s1 + s2 > 2); // 2-1, 3-2, etc.
          if (isClose) {
            clutchTotal++;
            if (isWinner) clutchWins++;
          }
        }
      }

      // Gatekeepers (only if the user lost)
      if (!isWinner) {
        const opponent = opponentSlot?.entrant;
        
        if (opponent && opponent.name !== userGamerTag && opponent.id !== userEntrant.id) {
          if (!gatekeepers[opponent.name]) {
            gatekeepers[opponent.name] = { count: 0, rounds: new Set<string>() };
          }
          gatekeepers[opponent.name].count++;
          gatekeepers[opponent.name].rounds.add(round);
        }
      }
    });

    const sortedRounds = Object.entries(roundStats).sort((a, b) => b[1].total - a[1].total);

    // Group rounds into logical bracket stages
    const bracketGroups: Record<string, typeof sortedRounds> = {
      'Winners': [],
      'Losers': [],
      'Finals': [],
      'Other': []
    };

    const getRoundWeight = (roundName: string) => {
      if (roundName.includes('Grand Final Reset')) return 200;
      if (roundName.includes('Grand Final')) return 190;
      if (roundName.includes('Semi-Final')) return 175;
      if (roundName.includes('Quarter-Final')) return 170;
      if (roundName.includes('Final')) return 180;
      
      const roundNumMatch = roundName.match(/Round (\d+)/);
      if (roundNumMatch) {
        return parseInt(roundNumMatch[1]);
      }
      return 0;
    };

    Object.entries(roundStats).forEach(([round, data]) => {
      if (round.includes('Grand Final')) {
        bracketGroups['Finals'].push([round, data]);
      } else if (round.includes('Winners')) {
        bracketGroups['Winners'].push([round, data]);
      } else if (round.includes('Losers')) {
        bracketGroups['Losers'].push([round, data]);
      }
      // Rounds that don't match are explicitly ignored to keep only double elimination info
    });

    // Sort within groups
    const sortRounds = (a: [string, any], b: [string, any]) => getRoundWeight(a[0]) - getRoundWeight(b[0]);
    bracketGroups['Winners'].sort(sortRounds);
    bracketGroups['Losers'].sort(sortRounds);
    bracketGroups['Finals'].sort(sortRounds);

    const topGatekeepers = Object.entries(gatekeepers)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5);

    // Calculate Streak
    let streakCount = 0;
    let isWinStreak = false;
    if (recentForm.length > 0) {
      isWinStreak = recentForm[0].isWinner;
      for (const item of recentForm) {
        if (item.isWinner === isWinStreak) {
          streakCount++;
        } else {
          break;
        }
      }
    }

    return { 
      sortedRounds, 
      bracketGroups,
      topGatekeepers, 
      recentForm,
      clutchStats: { wins: clutchWins, total: clutchTotal },
      streak: { count: streakCount, isWin: isWinStreak }
    };
  }, [sets, playerId, userId, userGamerTag]);

  if (userLoading || (setsLoading && sets.length === 0)) return <main className="loading-container"><p>Loading analysis...</p></main>;
  if (setsError && sets.length === 0) return <main className="error-container"><p>Error loading data: {setsError.message}</p></main>;
  if (!stats && !setsLoading) return <main className="error-container"><p>No data found for analysis.</p></main>;

  const clutchWinPct = stats ? (stats.clutchStats.total > 0 
    ? (stats.clutchStats.wins / stats.clutchStats.total) * 100 
    : 0) : 0;

  return (
    <main className="performance-container">
      <header className="performance-header">
        <h1>Performance Analysis: {userData?.currentUser?.player?.gamerTag}</h1>
        <span className="subtitle">Last {sets.length} Sets</span>
      </header>

      {setsLoading && <div className="loading-indicator">Updating data... ({sets.length}/300)</div>}

      <div className="metrics-grid">
        <section className="analysis-section metric-card">
          <h2>Clutch Factor</h2>
          {stats ? (
            <>
              <div className="metric-value">
                <span className={clutchWinPct >= 60 ? 'win-percent-high' : clutchWinPct <= 40 ? 'win-percent-low' : ''}>
                  {clutchWinPct.toFixed(1)}%
                </span>
              </div>
              <p className="metric-detail">Win rate in deciding games ({stats.clutchStats.wins}/{stats.clutchStats.total})</p>
            </>
          ) : <p>No clutch stats available yet.</p>}
          <div className="metric-explanation">
            Clutch Factor measures performance under pressure. It is calculated by taking the win percentage of sets that went to the final possible game (e.g., 2-1 in Bo3 or 3-2 in Bo5).
          </div>
        </section>

        <section className="analysis-section metric-card">
          <h2>Recent Form</h2>
          {stats ? (
            <>
              <div className="form-dots">
                {stats.recentForm.map((item, i) => (
                  <span 
                    key={i} 
                    className={`form-dot ${item.isWinner ? 'win' : 'loss'}`}
                    title={`${item.isWinner ? 'Win' : 'Loss'} vs ${item.opponent} (${item.score})`}
                  />
                ))}
              </div>
              <p className="metric-detail">
                {stats.streak.count} {stats.streak.isWin ? 'Win' : 'Loss'} Streak
              </p>
            </>
          ) : <p>No form data available yet.</p>}
          <div className="metric-explanation">
            Recent form shows the outcome of the last 10 sets. The streak indicates the number of consecutive wins or losses leading up to the most recent match.
          </div>
        </section>
      </div>
      
      {stats && (
        <>
          <section className="analysis-section">
            <h2>Top Gatekeepers</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Losses</th>
                  <th>Rounds Stopped</th>
                </tr>
              </thead>
              <tbody>
                {stats.topGatekeepers.map(([name, data]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{data.count}</td>
                    <td>{Array.from(data.rounds).join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="analysis-section">
            <h2>Bracket Performance</h2>
            <div className="bracket-stats-container">
              {Object.entries(stats.bracketGroups).map(([groupName, groupRounds]) => {
                if (groupRounds.length === 0) return null;
                return (
                  <div key={groupName} className="bracket-group">
                    <h3 className="bracket-group-title">{groupName}</h3>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Round</th>
                          <th>Wins / Total</th>
                          <th>Win %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupRounds.map(([round, data]) => {
                          const winPct = (data.wins / data.total) * 100;
                          const winPctClass = winPct >= 60 ? 'win-percent-high' : winPct <= 40 ? 'win-percent-low' : '';
                          return (
                            <tr key={round}>
                              <td>{round}</td>
                              <td>{data.wins} / {data.total}</td>
                              <td>
                                <span className={winPctClass}>{winPct.toFixed(1)}%</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
};
