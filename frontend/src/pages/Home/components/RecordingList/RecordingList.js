import React, { useState, useEffect } from 'react';
import './RecordingList.css';
import {useSelector} from "react-redux";
import {fetchRecordingsByUserId} from "../../../../api/httpRequest";

const RecordingList = ({recording}) => {
    const [recordings, setRecordings] = useState([]);
    const userAuth=useSelector(state => state.auth.user)
    useEffect(() => {
        console.log("this is recording component:",recording);
        const fetchRecordings = async () => {
            try {
                console.log("begin fetch");
                const response = await fetchRecordingsByUserId(userAuth.id);
                console.log("end fetch",[...response]);
                setRecordings([...response]);
                console.log("response:",response);
            } catch (error) {
                console.error('Error fetching recordings:', error);
            }
        };
        fetchRecordings();
    }, [userAuth.id,recording]);
    return (
        <div className="recording-list-container">
            <div className="recording-list">
                <div className="recording-list-header">
                    <h3>Recordings</h3>
                </div>
                <ul className="recording-list-content">
                    {recordings.map((recording, index) => {
                        let iostime = 'Invalid Date';
                        iostime = new Date(parseInt(recording.startTime)).toISOString();
                        console.log("recording_index:",recording);
                        if (typeof iostime !== 'number' || isNaN(iostime)) {
                           // console.error('Invalid timestamp:', recording.startTime);
                        }
                        if (iostime === 'Invalid timestamp') {
                            return null;
                        }
                        return (
                            <li key={recording.id} onClick={() => window.location.href = `/playback/${recording.id}`}>
                                {index + 1}. Start Time: {iostime}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default RecordingList;
