import React, { useState, useEffect, useRef } from 'react';
import './RecordingControl.css';
import { recordGameActions } from '../../../../api/httpRequest';
import { useSelector } from 'react-redux';

const RecordingControl = ({ players,onRecordingChange }) => {
    const [recording, setRecording] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const recordedDataRef = useRef(''); // 使用 ref 来存储 recordedData
    const intervalIdRef = useRef(null); // 使用 ref 来存储定时器 ID
    const userAuth = useSelector(state => state.auth.user);
    const playersRef = useRef(players); // 使用 ref 来存储 players 引用

    // 使用 useEffect 来同步 players 引用
    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    const handleStartRecording = () => {
        setRecording(true);
        onRecordingChange(true);
        console.log("Start recording");
        const startTime = Date.now();
        setStartTime(startTime);
        recordedDataRef.current = ''; // 清空之前的记录
    };

    const handleStopRecording = () => {
        setRecording(false);
        onRecordingChange(false);
        console.log("Stop recording");

        const endTime = Date.now();//timestamp, the replay will use the timestamp here to replay the actions
        const duration = endTime - startTime;
        const fileName = `${userAuth.id}_${startTime}_${duration}.txt`;

        // create file and write data into file
        const blob = new Blob([recordedDataRef.current], { type: 'text/plain' });
        const file = new File([blob], fileName, { type: 'text/plain' });
        console.log("File created:", file);

        // send action file to the backend
        recordGameActions(file)
            .then(response => {
                console.log('Upload success:', response);
            })
            .catch(error => {
                console.error('Upload failed:', error);
            });

        // clear timer
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    };

    useEffect(() => {
        if (recording) {
            // Set the timer
            const recordPlayers = () => {
                const action = JSON.stringify({ players: playersRef.current, timestamp: Date.now() }) + ',\n';
                recordedDataRef.current += action; // update the ref data
            };

            intervalIdRef.current = setInterval(recordPlayers, 17); //record the actions per 17ms 

            // clear timer
            return () => {
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                }
            };
        } else {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
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
