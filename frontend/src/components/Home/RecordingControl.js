import React, { useState, useEffect } from 'react';
import './RecordingControl.css';

const RecordingControl = ({ stompClient, player }) => {
    const [recording, setRecording] = useState(false);
    const [actions, setActions] = useState([]);

    const handleStartRecording = () => {
        setRecording(true);
        setActions([]);
    };

    const handleStopRecording = () => {
        setRecording(false);
        // 发送操作记录到后端
        console.log({ playerId: player.id, actions });
        fetch('http://localhost:8097/api/recordings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId: player.id, actions }),
        });
    };

    useEffect(() => {
        if (recording) {
            const recordAction = (event) => {
                const rect = event.target.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                setActions((prevActions) => [...prevActions, { x: mouseX, y: mouseY }]);
            };
            window.addEventListener('mousemove', recordAction);

            return () => {
                window.removeEventListener('mousemove', recordAction);
            };
        }
    }, [recording]);

    return (
        <div className="recording-control">
            {recording ? (
                <button className="stop-button" onClick={handleStopRecording}>
                    Stop Recording
                </button>
            ) : (
                <button className="recording-button" onClick={handleStartRecording}>
                    Start Recording
                </button>
            )}
        </div>
    );
};

export default RecordingControl;
