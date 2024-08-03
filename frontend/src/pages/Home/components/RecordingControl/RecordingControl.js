import React, { useState, useEffect } from 'react';
import './RecordingControl.css';
import { recordGameActions } from '../../../../api/httpRequest';
import { useSelector } from 'react-redux';

const RecordingControl = ({ players }) => {
    const [recording, setRecording] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [recordedData, setRecordedData] = useState('');
    const userAuth = useSelector(state => state.auth.user);

    const handleStartRecording = () => {
        setRecording(true);
        console.log("Start recording");
        const startTime = Date.now();
        setStartTime(startTime);
        setRecordedData(''); // 清空之前的记录
    };

    const handleStopRecording = () => {
        setRecording(false);
        console.log("Stop recording");

        const endTime = Date.now();
        const duration = endTime - startTime;
        const fileName = `${userAuth.id}_${startTime}_${duration}.txt`;

        // 在创建文件之前，打印 recordedData 的内容
        console.log("Recorded data:", recordedData);

        // 创建文件，并将 recordedData 写入文件
        const blob = new Blob([recordedData], { type: 'text/plain' });
        const file = new File([blob], fileName, { type: 'text/plain' });
        console.log("File created:", file);



        // 发送操作记录到后端
        recordGameActions(file)
            .then(response => {
                console.log('Upload success:', response);
            })
            .catch(error => {
                console.error('Upload failed:', error);
            });
    };

    useEffect(() => {
        if (recording) {
            const recordPlayers = () => {
                const action = JSON.stringify({ players, timestamp: Date.now() }) + '\n';
                setRecordedData(prevData => prevData + action);
                console.log("Recorded action:", action); // 每次记录操作时输出日志
            };

            const intervalId = setInterval(recordPlayers, 1000); // 每秒记录一次

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [recording, players]);

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
