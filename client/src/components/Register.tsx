import React, { useState, useEffect, Dispatch, SetStateAction, useRef } from "react";
import { Backdrop, Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import { useNavigate, NavigateFunction } from 'react-router-dom';

interface regData {
    status : boolean,
    error : string
}

const Register: React.FC = () : React.ReactElement => {

    const [registrationData, setRegistrationData] = useState<regData>({
        status: false,
        error: ""
    });

    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
    
        if (formRef.current?.username.value && formRef.current?.password.value) {
            try {
                const connection = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formRef.current?.username.value,
                        password: formRef.current?.password.value
                    })
                });
    
                const responseData = await connection.json();
    
                if (connection.ok) {
                    setRegistrationData({
                        status: true,
                        error: ""
                    });

                    formRef.current?.reset();
                   
                } else {
                    setRegistrationData({
                        status: false,
                        error: "Käyttäjätunnuksen luonti epäonnistui."
                    });
                }
            } catch (error) {
                console.error("Error creating user:", error);
                setRegistrationData({
                    status: false,
                    error: "Käyttäjätunnus varattu."
                });
            }
        }
    };


    useEffect(() => {
        
    }, [registrationData]);

    return (
        <>
            <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Paper sx={{ padding: 2, zIndex: (theme) => theme.zIndex.drawer + 2 }}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        ref={formRef}
                        style={{
                            width: 300,
                            backgroundColor : "#fff",
                            padding : 20
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography variant="h6">Luo uusi käyttäjätunnus</Typography>
                            <TextField 
                                label="Käyttäjätunnus" 
                                name="username"
                                required
                            />
                            <TextField 
                                label="Salasana"
                                name="password"
                                type="password" 
                                required
                            />
                        
                            {registrationData.status ? (
                                <Typography variant="body2" color="green">
                                Uusi käyttäjätunnus luotu.
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="red">
                                {registrationData.error}
                                </Typography>
                            )}
                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                            >
                                Luo uusi tunnus
                            </Button>
                            <Button 
                                type="submit" 
                                variant="outlined" 
                                size="large"
                                onClick={() => navigate('/')}
                            >
                                Palaa uutissivulle
                            </Button>
                        </Stack>
                        
                    </Box>
                </Paper>
            </Backdrop>
        </>
    );
};

export default Register;