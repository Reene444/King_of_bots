// RoomModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RoomToggerBox from '../RoomToggerBox/RoomToggerBox'; // Import your table component

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: '8px',
};

const RoomModal = ({ open, handleClose ,handleJoin,roomId}) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <RoomToggerBox onClose={handleClose} onJoin={handleJoin} roomId={roomId}/>
            </Box>
        </Modal>
    );
};

export default RoomModal;
