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
    const [players, setPlayers] = useState([]);
    const [offset,setOffset]=useState({x:0,y:0})    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("this recordingId is before fetching:",recordingId);
                const data = await fetchRecordingFileContent(recordingId);
                const parsedData = JSON.parse(`[${data.slice(0, -2)}]`); //Parsing the data
                setPlaybackData(parsedData);
                console.log("this is playbackdata:",playbackData);
                setPlayers(parsedData[0].players); // init the states of players
            } catch (error) {
                console.error('Error fetching playback data:', error);
            }
        };

        fetchData();
    }, [recordingId]);
    useEffect(() => {
        // Check if the current frame is not the last one in the playback data
        if (currentFrame < playbackData.length - 1) {
            // Set a timeout to move to the next frame after a delay
            const timeout = setTimeout(() => {
                // Find the player from the current list of players by matching the player ID
                let findPlayer = players.find(player => player.id === player.id);
                // Update the players state with the players data from the next frame
                setPlayers(playbackData[currentFrame + 1].players);
                // Find the player again from the updated list of players
                let findPlayer2 = players.find(player => player.id === player.id);
                // Update the offset to keep track of the player's movement between frames
                setOffset({
                    x: findPlayer.segments[0].x - findPlayer2.segments[1].x, 
                    y: findPlayer.segments[0].y - findPlayer2.segments[1].y
                });
                // Move to the next frame by incrementing the current frame counter
                setCurrentFrame(currentFrame + 1);
            }, playbackData[currentFrame + 1].timestamp - playbackData[currentFrame].timestamp);
            // Cleanup function to clear the timeout if the component re-renders or unmounts
            return () => clearTimeout(timeout);
        }
    }, [currentFrame, playbackData]);
    

    return (
        <div className="playback-container">
            <Map offset={offset} />
            <Snake players={players} />
        </div>
    );
};

export default PlaybackPage;
