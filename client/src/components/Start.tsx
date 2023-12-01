import React, {useState, useRef,useEffect, Dispatch, SetStateAction} from 'react';
import { Typography, Alert, Container, Button, TextField, Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, Stack, Backdrop, CircularProgress } from '@mui/material';
import {useNavigate, NavigateFunction} from 'react-router-dom';

interface News {
  uutisId : number
  otsikko : string
  sisalto : string
}

interface Comment {
  kommenttiId  :  number
  uutisId : number
  kayttajatunnus : string
  kommentti : string
  aikaleima : Date
}

interface ApiData {
  content: {
    news: News[];
    comments: Comment[];
  }
  error : string
  fetched : boolean
}

interface Props {
  token : string | null 
  userName : string | null
  setToken : Dispatch<SetStateAction<string | null>>
  setUserName : Dispatch<SetStateAction<string | null>>
}

interface fetchSettings {
  method : string
  headers? : any
  body? : string
}

const Start : React.FC<Props> = (props : Props) : React.ReactElement => {

  const [loading, setLoading] = useState<boolean>(true);
  
  const navigate : NavigateFunction = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  const [apiData, setApiData] = useState<ApiData>({
                                                    content : {
                                                      news : [],
                                                      comments : []
                                                    },
                                                    error : "",
                                                    fetched : false
                                                  });
  
  const handleLogout = () => {
    localStorage.clear();
    props.setToken(null);
    props.setUserName(null);
  }

  const addComment = (e: React.FormEvent, uutisId : number) => {

    e.preventDefault();
    
    apiCall("POST", {
      uutisId : uutisId,
      kayttajatunnus : props.userName,
      kommentti : formRef.current?.newComment.value
    });

  }
     
  const apiCall = async (method? : string, data? : any, uutisId? : number) : Promise<void> => {

    setLoading(true);

    setApiData({
      ...apiData,
      fetched : false
    });
  
    let url = `http://localhost:3106/api/news`;
  
    let settings : fetchSettings = { 
      method : method || "GET",
      headers : {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${props.token}`
      }
    };

    if (method === 'POST') {

      settings = {
        ...settings,
        body: JSON.stringify({
          ...data,
        }),
      };
    }

    try {

      //used to simulate delay in order to test exceptionhandling
      //await new Promise((resolve, reject) => setTimeout(reject, 2000));

      const connection = await fetch(url, settings);
  
      if (connection.status === 200) {

        const responseData = await connection.json();

        setApiData({
          ...apiData,
          content : responseData, 
          fetched : true
        });

        setLoading(false);
  
      } else if (connection.status === 404){
  
        setApiData({
          ...apiData,
          error : "Data not found",
          fetched : true
        });

        setLoading(false);

      } else {

        setApiData({
          ...apiData,
          error : "Unexpected error on the server",
          fetched : true
        });

        setLoading(false);
      }
      
    } catch (e : any) {

      setApiData({
        ...apiData,
        error : "Unable to connect to server",
        fetched : true
      });
  
    }
  
  }
  
  useEffect(() => {
    apiCall();
  }, []);

  return (
    <>
    <Typography variant="h6" sx={{marginBottom : 2, marginTop : 2}}>Uutiset</Typography>

    {Boolean(apiData.error) ? (
      <Alert severity="error">{apiData.error}</Alert>
    ) : (
      <Stack>
        {/* Loading - tila ennen renderöintiä */}
        {loading ? (
            <Backdrop open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            // Renderöidään uutiset
            apiData.content.news.map((singleNews: News) => (
            <Container key={singleNews.uutisId}>
              <Typography variant="h5">{singleNews.otsikko}</Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>{singleNews.sisalto}</Typography>
              {props.token !== null ? (
                <>
                <List>
                {apiData.content.comments
                        .filter((comment) => comment.uutisId === singleNews.uutisId)
                        .sort((a,b) => b.kommenttiId - a.kommenttiId)
                        .map((comment) => (
                          <Paper key={comment.kommenttiId} sx={{ marginTop: 1, padding: 2 }}>
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar>{comment.kayttajatunnus[0]}</Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={comment.kayttajatunnus}
                                secondary={
                                  <>
                                    <Typography variant="caption" color="text.secondary">
                                      {`${new Date(
                                        comment.aikaleima
                                      ).toLocaleString('fi-FI', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                      })}`}
                                    </Typography>
                                    <Typography variant="body2">{`UutisId ${comment.uutisId}: ${comment.kommentti}`}</Typography>
                                  </>
                                }
                              />
                            </ListItem>
                          </Paper>
                        ))}
                </List>

                <Stack
                      component="form"
                      ref={formRef}
                      onSubmit={(e) => addComment(e, Number(singleNews.uutisId))}
                    >
                      <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        Jätä kommenttisi tähän
                      </Typography>
                      <TextField
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        name="newComment"
                        label="Kirjoita kommentti"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ marginTop: 1 }}
                      >
                        Lähetä kommentti
                      </Button>
                      <Button
                        type="submit"
                        variant="outlined"
                        onClick={handleLogout}
                        sx={{ marginTop: 1 }}
                      >
                        Kirjaudu ulos
                      </Button>
                    </Stack>
                </>
              ) : (
                <>
                <Stack>
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{ marginTop: 1 }}
                >
                  Kirjaudu sisään kommentoidaksesi
                </Button>
                <Button
                variant="outlined"
                onClick={() => navigate("/register")}
                sx={{ marginTop: 1 }}
              >
                Luo uusi käyttäjätunnus
              </Button>
              </Stack>
              </>
              )}
              
            </Container>
            ))
          )}
      </Stack>
    )}
       
    </>
  );
}

export default Start;