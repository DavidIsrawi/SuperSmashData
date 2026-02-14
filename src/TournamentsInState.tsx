import React from "react";
import { useTournamentsByState } from "./hooks/useTournamentsByState";
import './styles/TournamentsInState.css';

const getStartggLink = (slug: string) => {
    return `https://www.start.gg/${slug}/details`;
}

export const TournamentsInState = () => {
    const { loading, error, tournaments } = useTournamentsByState('WA');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div className="tournaments-container">
            <header className="tournaments-header">
                <h1>Tournaments in WA</h1>
            </header>
            <div className="tournaments-section">
                {tournaments.map((tournament: any) => (
                    <div key={tournament.id} data-slug={tournament.slug} className="tournament-card">
                        <div className="tournament-image-container">
                            <img src={tournament.images?.find((image: any) => image.type === 'profile')?.url || tournament.images?.[0]?.url} alt={tournament.name} />
                        </div>
                        <div className="tournament-info">
                            <h3>{tournament.name}</h3>
                            <p>{`Attendees: ${tournament.numAttendees || 0}`}</p>
                            <p>{tournament.startAt ? new Date(tournament.startAt * 1000).toDateString() : 'Date TBD'}</p>
                            <a href={getStartggLink(tournament.slug)} className="tournament-link">View on Start.gg</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}