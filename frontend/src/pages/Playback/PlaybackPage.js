import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Snake from '../../assets/scripts/Snake/Snake';
import './PlaybackPage.css';
import {v4 as uuidv4} from "uuid";

const MAX_SPEED = 5; // Set maximum speed for snake head

const PlaybackPage = () => {
    const { id } = useParams();
    const [recording, setRecording] = useState(null);
    const [currentAction, setCurrentAction] = useState(0);
    const [snakeSegments, setSnakeSegments] = useState(
          Array.from({ length: 15 }, (_, index) => ({ x: 50 - index * 10, y: 50 }))
); // Initialize snake with one segment

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

    useEffect(() => {
        if (recording && recording.actions && recording.actions.length > 0 && currentAction > 0) {
            const action = recording.actions[currentAction];
            const head = { ...snakeSegments[0] };
            const dx = action.x - head.x;
            const dy = action.y - head.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > MAX_SPEED) {
                const ratio = MAX_SPEED / distance;
                head.x += dx * ratio;
                head.y += dy * ratio;
            } else {
                head.x = action.x;
                head.y = action.y;
            }

            const updatedSegments = [head, ...snakeSegments.slice(0, -1)];
            setSnakeSegments(updatedSegments);
        }
    }, [currentAction, recording]);

    if (!recording) {
        return <div>Loading...</div>;
    }

    return (
        <div className="playback-container">
             <Snake players={[{ id: uuidv4(),segments: snakeSegments, color: 'blue' ,score: 0,
                 username:'user@user.com',
                 nickname:'user_'+uuidv4().slice(0,1)}]} />
        </div>
    );
};

export default PlaybackPage;
