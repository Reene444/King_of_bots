import React, { useState, useEffect } from 'react';
import Snake from '../../assets/scripts/Snake/Snake';
import '../../assets/scripts/Snake/Snake.css';
import Map from "../../assets/scripts/Map/Map";

const playbackData = [




];

const PlaybackPage = () => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [players, setPlayers] = useState(playbackData[0].players);

    useEffect(() => {
        if (currentFrame < playbackData.length - 1) {
            const timeout = setTimeout(() => {
                setPlayers(playbackData[currentFrame + 1].players);
                setCurrentFrame(currentFrame + 1);
            }, playbackData[currentFrame + 1].timestamp - playbackData[currentFrame].timestamp);
            return () => clearTimeout(timeout);
        }
    }, [currentFrame]);

    return (
        <div className="playback-container">
            <Map players={{ players }} />
            <Snake players={players} />
        </div>
    );
};

export default PlaybackPage;
