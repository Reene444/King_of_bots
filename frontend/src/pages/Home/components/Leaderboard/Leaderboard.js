import React from 'react';
import {Card, CardContent, Typography, Box, Button} from '@mui/material';
import './Leaderboard.css';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import UpgradeTwoToneIcon from '@mui/icons-material/UpgradeTwoTone';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
const Leaderboard = ({ leaderboard,score,onReturnRoom }) => {
    const uniquePlayers = [...leaderboard]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    return (
        <Box className="leaderboard-container">
            <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0)', padding: '5px', borderRadius: '10px', boxShadow: '0 4px 5px rgba(0, 0, 0, 0.2)' }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        <SportsScoreIcon/>Leaderboard
                    </Typography>
                    <ul className="leaderboard-list">
                        {uniquePlayers.map((player, index) => (
                            <li key={player.id} className="leaderboard-item">
                                <Typography variant="h7" style={{color: player.color}}>
                                    {index + 1}. {player.nickname} - {player.score}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                    <div style={{borderTop: '1px solid #ccc', paddingTop: '8px', marginBottom: '1px'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <UpgradeTwoToneIcon/>
                            <text>You - {score}</text>
                        </div>
                    </div>
                </CardContent>
                <Typography variant="h4" component="div">
                   <Button variant='text' onClick={onReturnRoom}>return room</Button><KeyboardReturnIcon/>
                </Typography>
            </Card>
        </Box>
);
};

export default Leaderboard;
