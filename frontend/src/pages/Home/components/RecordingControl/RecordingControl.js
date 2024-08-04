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

        const endTime = Date.now();
        const duration = endTime - startTime;
        const fileName = `${userAuth.id}_${startTime}_${duration}.txt`;

        // 在创建文件之前，打印 recordedData 的内容
        console.log("Recorded data:", recordedDataRef.current);

        // 创建文件，并将 recordedData 写入文件
        const blob = new Blob([recordedDataRef.current], { type: 'text/plain' });
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

        // 清除定时器
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
    };

    useEffect(() => {
        if (recording) {
            // 设置定时器
            const recordPlayers = () => {
                const action = JSON.stringify({ players: playersRef.current, timestamp: Date.now() }) + ',\n';
                recordedDataRef.current += action; // 更新 ref 中的数据
                console.log("Recorded action:", action); // 每次记录操作时输出日志
            };

            intervalIdRef.current = setInterval(recordPlayers, 17); // 调整为每 100 毫秒记录一次

            // 清除定时器
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
    }, [recording]); // 依赖数组中仅包含 recording

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
