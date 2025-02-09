import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalProvider } from '../../Context/GlobalProvider';

const ListScreen = () => {
  const { id, token } = useGlobalProvider();
  const [favorite, setFavorite] = useState([]);
  const [movies, setMovies] = useState([]); // Films en cours de diffusion
  const [coming, setComing] = useState([]); // Films à venir
  const [filteredMovies, setFilteredMovies] = useState([]); // Liste filtrée des films favoris
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les films favoris de l'utilisateur
  const fetchUserFavorites = async () => {
    if (!id) {
      console.log("No user Id");
      return;
    }

    try {
      const res = await fetch(`http://192.168.11.121:4242/list/${id}`,{
        method : 'GET',
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`No data received, Status: ${res.status}`);

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        const filmsList = data.data[0].films.map(String) || []; // Convertir en chaîne si nécessaire
        setFavorite(filmsList);
      } else {
        setFavorite([]);
      }
    } catch (error) {
      console.error("Error fetching favorite films:", error);
      setError("Erreur lors du chargement des favoris.");
    }
  };

  // Fonction pour récupérer les films en cours
  const fetchMovies = async () => {
    const url = "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:   "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDJhZTBiNzE4MDQ3Yzc3MWYxMmQyNmFhOTA0ZDNjMCIsIm5iZiI6MTczODYxMTIxOS4zNjYwMDAyLCJzdWIiOiI2N2ExMWExM2VkODI5ZWJjNTZlMmI0NGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.3K88CPu4X0HUOYc3J5Ns4GfL5dijSKMsDcT9Hr0ayvA",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Échec du chargement des films.");

      const data = await response.json();
      setMovies(data.results);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fonction pour récupérer les films à venir
  const fetchUpComingMovies = async () => {
    const url = "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer TON_TOKEN_TMDB",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Échec du chargement des films.");
      const data = await response.json();
      setComing(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserFavorites();
      await fetchMovies();
      await fetchUpComingMovies();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Mettre à jour la liste des films favoris
  useEffect(() => {
    if (movies.length > 0 || coming.length > 0) {
      const allMovies = [...movies, ...coming]; // Fusionner les deux listes
      const uniqueMovies = new Map(); // Stocker les films uniques par leur ID

      allMovies.forEach((movie) => {
        if (favorite.includes(movie.id.toString())) {
          uniqueMovies.set(movie.id, movie); // Ajoute le film s'il est dans les favoris
        }
      });

      setFilteredMovies(Array.from(uniqueMovies.values())); // Convertir en tableau
    } else {
      setFilteredMovies([]);
    }
  }, [movies, coming, favorite]);

  if (loading) return <ActivityIndicator size="large" color="#E0144C" className="flex-1" />;
  if (error) return <Text className="text-red-500 text-center">{error}</Text>;

  return (
    <View className="bg-black flex-1 relative gap-y-5">
      {/* Header */}
      <View className="flex-row px-3 mt-5 justify-between items-center">
        <View className="flex-row">
          <Ionicons name="arrow-back" size={24} color="gray" />
          <Text className="text-white ml-4 text-lg font-semibold">My List</Text>
        </View>
        <TouchableOpacity
          className="px-2 py-3 ml-4 bg-second w-1/4 rounded-xl shadow-xl"
          onPress={() => {
            fetchUserFavorites();
            fetchMovies();
            fetchUpComingMovies();
          }}
        >
          <Text className="text-white font-semibold text-center">Refresh List</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des films favoris */}
      <View className="px-3">
        {filteredMovies.length > 0 ? (
          <FlatList
            data={filteredMovies}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()} // Plus besoin de l'index
            renderItem={({ item }) => (
              <View className="p-2">
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                  className="w-40 h-60 rounded-lg"
                />
                <Text className="text-white text-center mt-1">{item.title}</Text>
              </View>
            )}
          />


        ) : (
          <Text className="text-gray-400 text-center">No favorite films found</Text>
        )}
      </View>
    </View>
  );
};

export default ListScreen;
