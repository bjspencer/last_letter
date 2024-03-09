import { Box, Modal, Typography } from '@mui/material'
import React from 'react'
import InfoIcon from '@mui/icons-material/Info';

export default function InfoModal({ open, handleClose }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: "#242424",
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{
                        display: "flex",
                    }}>
                        <InfoIcon />
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{
                            marginLeft: "0.5rem",
                        }}>
                            How to play:
                        </Typography>
                    </div>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Guess a word that starts with the last letter of the given word. You have 6 seconds to guess a word and you can't use the same word more than once. If you can't think of a word, game over! Good luck!
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}
