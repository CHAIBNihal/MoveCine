import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useGlobalProvider } from "../../Context/GlobalProvider"
import { AddToFavoriteList, createTicket } from "../../Functions/index"
import Fontisto from '@expo/vector-icons/Fontisto';
import { tmdb_Token } from "../../constants";
import PaymentFilms from "../Tabs/Modal/PaymentFilms";
const NowShowing = () => {
  // Provider values
  const { id, token,emailProvider } = useGlobalProvider();

  // States 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [open, setOpen] = useState(false)
 
  const numColumns = 2;
 
  useEffect(() => {
    const fetchMovies = async () => {
      const url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
           `Bearer ${tmdb_Token}`
        },
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Échec du chargement des films.");
        const data = await response.json();
        setMovies(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  
  if (loading) return <ActivityIndicator size="large" color="#E0144C" />;
  if (error) return <Text style={styles.error}>Erreur : {error}</Text>;
console.log(open)

  return selectedMovie ? (
    // Selected film
    <ScrollView >
      <View style={styles.detailsContainer} >
        <View className="w-1/2 mx-6 items-center justify-center ">
          <Image
            className="w-full "
            source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` }}
            style={styles.detailsPoster}
          />
        </View>

        <Text style={styles.movieTitle}>{selectedMovie.title}</Text>
        <Text style={styles.releaseDate}>Released at  : {selectedMovie.release_date}</Text>
        <Text style={styles.movieOverview}>{selectedMovie.overview}</Text>
        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: "space-between", width: "100%", paddingHorizontal: 38 }}>
          <TouchableOpacity style={styles.iconButton} onPress={()=>setOpen(!open)}>

            <Fontisto name="ticket" size={24} color="black" />
            <Text className="text-center ml-2  ">book ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => AddToFavoriteList(id, selectedMovie.id, token)}>
            <Ionicons name="add" size={24} color="black" />
            <Text>My List</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setSelectedMovie(null)} // Revenir à la liste des films
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back </Text>
        </TouchableOpacity>
        {
          open ? <PaymentFilms filmId={selectedMovie.id} nameFilm={selectedMovie.title}/> : null
        }
      </View>

    </ScrollView>
  ) : (
    //All Films
    <View style={styles.container}>
      <FlatList
        key={`numColumns-${numColumns}`}
        numColumns={numColumns}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedMovie(item)} style={styles.movieCard}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              style={styles.poster}
            />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.releaseDate}>Released in : {item.release_date}</Text>
            <View className="flex-row mt-3">
              <FontAwesome name="heart" size={24} color="#B82132" />
              <Text className="ml-1">{item.vote_count}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 10 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  movieCard: {
    flex: 1,
    margin: 5,
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 10
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
    textAlign: "center"
  },
  releaseDate: {
    color: "#aaa",
    fontSize: 12
  },
  iconContainer: { flexDirection: "row", marginTop: 10 },
  iconButton: { padding: 10, backgroundColor: "#eee", borderRadius: 30, marginLeft: 5, justifyContent: "center", alignItems: "center", flexDirection: "row" },

  // Styles pour l'écran de détails
  detailsContainer: { flex: 1, alignItems: "center" },
  detailsPoster: { height: 290, borderRadius: 10 },
  movieOverview: { color: "white", marginTop: 15, textAlign: "center" },
  backButton: { marginTop: 20, padding: 10, backgroundColor: "#555", borderRadius: 5 },
  backButtonText: { color: "white", fontWeight: "bold" },
});

export default NowShowing;
