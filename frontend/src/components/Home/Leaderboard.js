import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ leaderboard }) => {
    const uniquePlayers = [...leaderboard]
        .sort((a, b) => b.score - a.score)
        .filter((player, index, self) =>
                index === self.findIndex((p) => (
                    p.score === player.score
                ))
        )
        .filter(player => player.nickname) // 过滤掉没有昵称的玩家
        .slice(0, 3);

    return (
        <div className="leaderboard-container">
            <h3>Leaderboard</h3>
            <ul>
                {uniquePlayers.map((player, index) => (
                    <li key={player.id}>
                        {index + 1}. {player.nickname} - {player.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
