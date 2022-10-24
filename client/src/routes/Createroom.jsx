import React from "react";
import { v1 as uuid } from "uuid";
import "./createRoom.css";
import { useNavigate } from "react-router-dom";
import { TextField, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
    palette: {
        B1: {
            main: '#FFB70D',
        },
    },
});

export default function CreateRoom() {
    const navigate = useNavigate();
    const createRoom = (e) => {
        const txtRoomName = e.target.RoomName.value;
        console.log(txtRoomName);
        if (txtRoomName === "") {
            const roomID = uuid();
            console.log(`/room/${roomID}`);
            navigate(`/room/${roomID}`);
        } else {
            navigate(`/room/${txtRoomName}`);
        }



    }


    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Box className="ShadowBox">
                        <form className="Form" onSubmit={createRoom}>
                            <TextField id="standard-basic" name="RoomName" label="Room label" variant="standard" placeholder="Join Room..." />
                            <Button sx={{
                                marginTop: "30px",
                                BackgroundColor: "#F7B206"
                            }} type="submit" variant="contained" color="B1" >Create Room</Button>
                        </form>
                    </Box>
                </Box>
            </ThemeProvider>
        </>

    );
}
