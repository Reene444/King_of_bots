import React, { useState, useEffect } from 'react';
import Snake from '../../assets/scripts/Snake/Snake';
import '../../assets/scripts/Snake/Snake.css';
import Map from "../../assets/scripts/Map/Map";
import {fetchRecordingFileContent} from "../../api/httpRequest";
import {useParams} from "react-router-dom";



const PlaybackPage = () => {


    const [playbackData,setPlaybackData] = useState([])
    const { recordingId } = useParams();

    const [currentFrame, setCurrentFrame] = useState(0);
    // const [players, setPlayers] = useState(playbackData[0].players);
    const [players, setPlayers] = useState([]);
    const [offset,setOffset]=useState({x:0,y:0})    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("this recordingId is before fetching:",recordingId);
                const data = await fetchRecordingFileContent(recordingId);
                // console.log("this the received data:",JSON.parse(`[${data.slice(0, -2)}]`));
                const parsedData = JSON.parse(`[${data.slice(0, -2)}]`); // 解析数据
                setPlaybackData(parsedData);
                console.log("this is playbackdata:",playbackData);
                setPlayers(parsedData[0].players); // 初始化 players 状态
            } catch (error) {
                console.error('Error fetching playback data:', error);
            }
        };

        fetchData();
    }, [recordingId]);
    useEffect(() => {
        if (currentFrame < playbackData.length - 1) {
            const timeout = setTimeout(() => {
           
                let findPlayer = players.find(player => player.id === player.id);
                setPlayers(playbackData[currentFrame + 1].players);
                let findPlayer2 = players.find(player => player.id === player.id);
                setOffset({x:findPlayer.segments[0].x-findPlayer2.segments[1].x,y:findPlayer.segments[0].y-findPlayer2.segments[1].y})
                setCurrentFrame(currentFrame + 1);
            }, playbackData[currentFrame + 1].timestamp - playbackData[currentFrame].timestamp);
            return () => clearTimeout(timeout);
        }
    }, [currentFrame,playbackData]);

    return (
        <div className="playback-container">
            <Map offset={offset} />
            <Snake players={players} />
        </div>
    );
};

export default PlaybackPage;
