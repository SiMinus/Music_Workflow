import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Grid, Button, Typography } from "@mui/material";

import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
function Room(props){
    // other hooks
    const isMounted = useRef(true);
    const navigate = useNavigate();
    const { roomCode }= useParams();

    const [state, setState] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
    })

    const [spotifyChecked, setSpotifyChecked] = useState(false);
    const [song, setSong] = useState(null);

    useEffect(() => {
        getRoomDetails();
        
        const abortController = new AbortController();
        isMounted.current = true;
        let interval;
        if (spotifyChecked) {
            interval = setInterval(getCurrentSong, 1000);
        }
        return () => {
            abortController.abort();
            isMounted.current = false
            if (interval) {
                clearInterval(interval);
            }
        }
      }, [spotifyChecked]);

    const getRoomDetails = () => {
        fetch("/api/get-room" + "?code=" + roomCode)
            .then((response) => {
                if(!response.ok){
                    props.leaveRoomCallback();
                    navigate('/')
                }
                return response.json()
            })
            .then((data) => {
                setState((state) => ({
                    ...state,
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                }))
                if (data.is_host) {
                    authSpotify();
                    console.log('pass')
                }
            })
    }

    const authSpotify = () => {
        fetch("/spotify/is-authenticated")
          .then((response) => response.json())
          .then((data) => {
            setSpotifyChecked(data.status)
            console.log(data.status)
            if (!data.status) {
                fetch("/spotify/get-auth-url?force_auth=true")
                  .then((response) => response.json())
                  .then((data) => {
                    window.location.replace(data.url);
                  })
            } 
          })
    }

    const getCurrentSong = () => {
        fetch("/spotify/current-song")
          .then((response) => {
            if (!response.ok) {
                return {};
            } else {
                return response.json()
            }
          })
          .then((data) => {
            if (isMounted.current) {
                setSong(data)
                console.log(data)
            }
            
        })
    }

    const leaveRoomButton = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
        fetch("/api/leave-room", requestOptions)
          .then((response) => {
            props.leaveRoomCallback();
            navigate('/');

          })

    }

    const updateShowSettings = (value) => {
        setState((state) => ({
            ...state,
            showSettings: value,
        }))
    }

    const renderSettingsButton = () => {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)} >
                    Settings
                </Button>
            </Grid>
        );
    }

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={state.votesToSkip}
                        guestCanPause={state.guestCanPause}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                        redirectCallback={() => updateShowSettings(false)}
                    />

                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)} >
                        Close
                    </Button>
                </Grid>
                

            </Grid>
        );

    }
    if(state.showSettings){
        return renderSettings();
    }


    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Room Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                {song ? <MusicPlayer song={song} />: null }
            </Grid>
            {state.isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveRoomButton}
                >
                    Leave this Room
                </Button>
            </Grid>
             
            

        </Grid>



    );



}

export default Room;