import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './Leaderboard.css';

const Leaderboard = ({ leaderboard }) => {
    const uniquePlayers = [...leaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return (
        <Box className="leaderboard-container">
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0)', padding: '5px', borderRadius: '10px', boxShadow: '0 4px 5px rgba(0, 0, 0, 0.2)' }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Leaderboard
                    </Typography>
                    <ul className="leaderboard-list">
                        {uniquePlayers.map((player, index) => (
                            <li key={player.id} className="leaderboard-item">
                                <Typography variant="h7">
                                    {index + 1}. {player.nickname} - {player.score}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Leaderboard;
