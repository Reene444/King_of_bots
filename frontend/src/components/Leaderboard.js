import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ players }) => {
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

    return (
        <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <ul>
                {sortedPlayers.map((player, index) => (
                    <li key={player.id}>
                        {index + 1}. {player.nickname} - {player.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
