import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Start from './components/Start';
import Login from './components/Login';
import Register from './components/Register';

const App : React.FC = () : React.ReactElement => {

  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(storedToken !== null ? String(storedToken) : null);

  const storedUserName = localStorage.getItem("username");
  const [userName, setUserName] = useState <string | null>(storedUserName !== null ? String(storedUserName) : null);


  return (
    <Container>

      <Header/>

      <Routes>
        <Route path="/" element={<Start token={token} userName={userName} setToken={setToken} setUserName={setUserName}/>}/>
        <Route path="/login" element={<Login setToken={setToken} setUserName={setUserName} />}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
      

    </Container>
  );
}

export default App;
