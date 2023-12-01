import React, { Dispatch, SetStateAction, useRef } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { useState } from "react";

interface Props {
    setToken : Dispatch<SetStateAction<string | null>> 
    setUserName : Dispatch<SetStateAction<string | null>>
}

const Login: React.FC<Props> = (props : Props) : React.ReactElement => {

    const [error, setError] = useState<string>("");

    const navigate : NavigateFunction = useNavigate();

    const formRef = useRef<HTMLFormElement>();

    const login = async (e : React.FormEvent) : Promise<void> => {
        
        e.preventDefault();

        if (formRef.current?.username.value) {
            const username = formRef.current?.username.value;

            if (formRef.current?.password.value) {
                
                const connection = await fetch("/api/auth/login", {
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        username : username,
                        password : formRef.current?.password.value
                    })
                });

                if (connection.status === 200) {
                  
                    let { token} = await connection.json();

                    props.setToken(token);

                    props.setUserName(username)

                    localStorage.setItem("token", token);
                    localStorage.setItem("username", username);

                    navigate("/");

                } else {

                    setError("Kirjautuminen epäonnistui.")
                }

            } 
        } 
    };

    return (
        <>
            <Backdrop open={true}>
                <Paper sx={{padding : 2}}>
                    <Box
                        component="form"
                        onSubmit={login}
                        ref={formRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Kirjaudu sisään</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="username"
                            />
                            <TextField 
                                label="Salasana"
                                name="password"
                                type="password" 
                            />
                            {error && (
                                <Typography variant="body2" color="error">
                                    {error}
                                </Typography>
                            )}
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Kirjaudu
                            </Button>
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Peruuta
                            </Button>
                            <Typography>
                                (Kirjaudu sisään testitunnuksilla: käyttäjä:besserwisser, salasana: kissakala)
                            </Typography>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
        </>
    );
};

export default Login;