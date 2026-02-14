import React, { useMemo } from 'react';
import { usePlayerSets } from './hooks/usePlayerSets';
import { useAllCharacters } from './hooks/useAllCharacters';
import { useCurrentUser } from './hooks/useCurrentUser';
import './styles/Player.css';

export const Player = () => {
  const { userData, loading: userLoading } = useCurrentUser();
  const playerId = userData?.currentUser?.player?.id;
  const userId = userData?.currentUser?.id;
  
  const { sets, loading: setsLoading, error: setsError } = usePlayerSets(playerId, 300);
  const { characters, loading: charsLoading } = useAllCharacters();

  const playerData = useMemo(() => {
    if (!sets || sets.length === 0 || !playerId || !characters.length) return null;

    const pId = playerId.toString();
    const uId = userId?.toString();

    const characterUsage: Record<number, { count: number; wins: number; games: number }> = {};
    const recentTournamentsMap = new Map<string, { name: string; date: number; id: string }>();

    sets.forEach((set: any) => {
      // Find user's entrant ID in this set
      let userEntrantId: number | null = null;
      set.slots.forEach((slot: any) => {
        const isUser = slot.entrant?.participants?.some((p: any) => 
          p.player?.id?.toString() === pId || (uId && p.user?.id?.toString() === uId)
        );
        if (isUser) {
          userEntrantId = slot.entrant?.id;
        }
      });

      if (!userEntrantId) return;

      // Track Tournament
      if (set.event?.tournament) {
        const t = set.event.tournament;
        if (!recentTournamentsMap.has(t.id)) {
          recentTournamentsMap.set(t.id, {
            id: t.id,
            name: t.name,
            date: set.completedAt || 0
          });
        }
      }

      // Track Characters
      if (set.games) {
        set.games.forEach((game: any) => {
          if (game.selections) {
            game.selections.forEach((selection: any) => {
              if (selection.entrant?.id === userEntrantId && selection.selectionType === 'CHARACTER') {
                const charId = selection.selectionValue;
                if (!characterUsage[charId]) {
                  characterUsage[charId] = { count: 0, wins: 0, games: 0 };
                }
                characterUsage[charId].games++;
              }
            });
          }
        });
      }
    });

    const topCharacters = Object.entries(characterUsage)
      .map(([id, data]) => {
        const char = characters.find(c => c.id.toString() === id);
        return {
          id,
          name: char?.name || 'Unknown Character',
          image: char?.images?.find(img => img.type === 'stockIcon')?.url || char?.images?.[0]?.url,
          ...data
        };
      })
      .sort((a, b) => b.games - a.games)
      .slice(0, 5);

    const recentTournaments = Array.from(recentTournamentsMap.values())
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);

    return {
      topCharacters,
      recentTournaments,
      totalSets: sets.length
    };
  }, [sets, playerId, userId, characters]);

  if (userLoading || charsLoading || (setsLoading && sets.length === 0)) return <main className="loading-container"><p>Loading player data...</p></main>;
  if (setsError && sets.length === 0) return <main className="error-container"><p>Error loading data: {setsError.message}</p></main>;
  if (!playerData && !setsLoading) return <main className="error-container"><p>No data found for player.</p></main>;

  return (
    <main className="player-container">
      <header className="player-header">
        <h1>Player Profile: {userData?.currentUser?.player?.gamerTag}</h1>
        <span className="subtitle">Last {playerData?.totalSets} sets</span>
      </header>

      {setsLoading && <div className="loading-indicator">Updating data... ({sets.length}/300)</div>}

      <div className="player-grid">
        <section className="player-section">
          <h2>Top Characters</h2>
          {playerData?.topCharacters.length ? (
            <div className="char-list">
              {playerData.topCharacters.map(char => (
                <div key={char.id} className="char-card">
                  {char.image && <img src={char.image} alt={char.name} className="char-image" />}
                  <div className="char-info">
                    <span className="char-name">{char.name}</span>
                    <span className="char-stats">{char.games} games played</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="metric-explanation">No character selection data found in recent sets.</p>
          )}
        </section>

        <section className="player-section">
          <h2>Recent Tournaments</h2>
          <ul className="tournament-list">
            {playerData?.recentTournaments.map(t => (
              <li key={t.id} className="tournament-item">
                <span className="tournament-name">{t.name}</span>
                <span className="tournament-date">{t.date ? new Date(t.date * 1000).toLocaleDateString() : 'Unknown Date'}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="player-section">
        <h2>Activity Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <span className="summary-label">Total Sets Analyzed</span>
            <span className="summary-value">{playerData?.totalSets}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Unique Characters</span>
            <span className="summary-value">{playerData?.topCharacters.length}</span>
          </div>
          <div className="summary-card">
            <span className="summary-label">Tournaments Played</span>
            <span className="summary-value">{playerData?.recentTournaments.length}</span>
          </div>
        </div>
        <div className="metric-explanation">
          This data is aggregated from your last 300 sets on start.gg. Character usage is only available for sets where games were reported.
        </div>
      </section>
    </main>
  );
};
