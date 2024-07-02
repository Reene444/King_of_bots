import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snake from '../scripts/Snake';
import './Playback.css';

const Playback = () => {
    const { id } = useParams();
    const [recording, setRecording] = useState(null); // 修改初始状态
    const [currentAction, setCurrentAction] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8097/api/recordings/${id}`)
            .then(response => response.json())
            .then(data => setRecording(data))
            .catch(error => console.error('Error fetching recording:', error));
    }, [id]);

    useEffect(() => {
        if (recording && recording.actions && recording.actions.length > 0) {
            const interval = setInterval(() => {
                setCurrentAction(prev => {
                    if (prev < recording.actions.length - 1) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20); // Adjust the interval as needed

            return () => clearInterval(interval);
        }
    }, [recording]);

    if (!recording) {
        return <div>Loading...</div>;
    }

    const actions = recording.actions ? recording.actions.slice(0, currentAction) : [];

    return (

        <div className="playback-container">
            Playback
            <Snake players={[{ segments: actions, color: 'blue' }]} />
        </div>
    );
};

export default Playback;
