import React from "react";
import { Tournament, TournamentImage } from "./api/types";
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
                {tournaments.map((tournament: Tournament) => (
                    <div key={tournament.id} data-slug={tournament.slug} className="tournament-card">
                        <div className="tournament-image-container">
                            <img src={tournament.images.filter((image: TournamentImage) => image.type === 'profile')[0].url} alt={tournament.name} />
                        </div>
                        <div className="tournament-info">
                            <h3>{tournament.name}</h3>
                            <p>{`Attendees: ${tournament.numAttendees}`}</p>
                            <p>{new Date(tournament.startAt * 1000).toDateString()}</p>
                            <a href={getStartggLink(tournament.slug)} className="tournament-link">View on Start.gg</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}