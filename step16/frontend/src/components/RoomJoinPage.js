import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";


function RoomJoinPage() {

    const navigate = useNavigate();

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value);
    }

    const handleJoinButton = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                code: roomCode
            })
        }
        fetch('/api/join-room',requestOptions)
          .then((response) => {
            if(response.ok){
                navigate(`/room/${roomCode}`);
            } else {
                setError("Room not found")
            }
          })
          .catch((error) => console.log(error))
          


    }
    

    return(


        <Grid container spacing={1}>
            <Grid item xs={12} align = "center">
                <Typography variant="h4" component="h4">
                    Join A Room
                </Typography>
            </Grid>
            <Grid item xs={12} align = "center">
                <TextField
                    error={error}
                    label="code"
                    placeholder="Enter A Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align = "center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleJoinButton}
                >
                    Enter a Room
                </Button>
            </Grid>
            <Grid item xs={12} align = "center">
                <Button
                    color="secondary"
                    variant="contained"
                    to="/"
                    component={Link}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    )



}
export default RoomJoinPage;