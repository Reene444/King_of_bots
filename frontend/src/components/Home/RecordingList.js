import React, { useState, useEffect } from 'react';
import './RecordingList.css';

const RecordingList = () => {
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8097/api/recordings')
            .then(response => response.json())
            .then(data => setRecordings(data))
            .catch(error => console.error('Error fetching recordings:', error));
    }, []);

    return (
        <div className="recording-list-container">
            <div className="recording-list">
                <div className="recording-list-header">
                    <h3>Recordings</h3>
                </div>
                <ul className="recording-list-content">
                    {recordings.map((recording, index) => (
                        <li key={recording.id} onClick={() => window.location.href = `/playback/${recording.id}`}>
                            {index + 1}. Player ID: {recording.playerId}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecordingList;
