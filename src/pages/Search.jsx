import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [randomPic, setRandomPic] = useState(
    "https://images.unsplash.com/photo-1640098178528-27bf4b399da3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3MjQ2ODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDI2NDg4MTl8&ixlib=rb-4.0.3&q=85"
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  // Fetch city suggestions
  const fetchCities = async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/search.json?key=80ca7c1872fd4eb8ab894433251803&q=${searchQuery}`
      );
      const data = await response.json();
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setLoading(false);
  };

  const getRandomCityPictures = async () => {
    try {
      const response = await fetch(
        "https://api.unsplash.com/photos/random/?client_id=sC_DuAiI1xjVnxJjRSaLbxbatfcoEoK-df4lLlsRO-k&query=citynights&count=100"
      );
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const newImageUrl = data[randomIndex].urls.full;

      const img = new Image();
      img.src = newImageUrl;
      img.onload = () => {
        setRandomPic(newImageUrl);
        setImageLoaded(true); 
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      setImageLoaded(true); 
    }
  };

  useEffect(() => {
    getRandomCityPictures();
  }, []);

  return (
    <>
      {!imageLoaded && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
            zIndex: 10, 
          }}
        />
      )}
  
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: `url(${randomPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          opacity: imageLoaded ? 1 : 0, // Fade-in effect
          transition: "opacity 1.5s ease-in-out",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          Search for a City 🌍
        </Typography>
  
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            padding: "10px 15px",
            borderRadius: 2,
            width: "90%",
            maxWidth: 500,
          }}
        >
          <SearchIcon sx={{ color: "white" }} />
          <TextField
            fullWidth
            variant="standard"
            label="Enter city name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              fetchCities(e.target.value); // Fetch suggestions on change
            }}
            InputProps={{ sx: { color: "white" } }}
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.8)" } }}
            sx={{ borderBottom: "1px solid rgba(255,255,255,0.8)" }}
          />
        </Box>
        
        {loading && <CircularProgress sx={{ mt: 2, color: "white" }} />}
        
        {results.length > 0 && (
          <Paper
            elevation={5}
            sx={{
              mt: 2,
              maxHeight: 300,
              overflowY: "auto",
              borderRadius: 2,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              width: "90%",
              maxWidth: 500,
              color: "white",
            }}
          >
            <List>
              {results.map((city) => (
                <ListItem
                  key={city.id}
                  button
                  sx={{
                    transition: "0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                  onClick={() => navigate(`/weather?loc=${city.name}`)}
                >
                  <ListItemText
                    primary={`${city.name}, ${city.country}`}
                    secondary={city.region}
                    sx={{
                      color: "white",
                      "& .MuiListItemText-secondary": {
                        color: "rgba(255,255,255,0.8)",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </>
  );
  
};

export default Search;
