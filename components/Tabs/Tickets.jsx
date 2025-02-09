import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalProvider } from "../../Context/GlobalProvider";
import Foundation from '@expo/vector-icons/Foundation';

const Ticket = () => {
  const { id, token } = useGlobalProvider();
  const [AllTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [FilmBooked, setFilmBooked] = useState([]);

  const fetchAllTic = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.11.121:4242/allTickets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success || !data.data || data.data.length === 0) {
        throw new Error(data.message || "Aucun ticket trouvé");
      }

      const tickets = data.data[0].films ? data.data[0].films.map(String) : [];
      setAllTickets(tickets);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des tickets:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: "Bearer TON_TOKEN_TMDB",
          },
        }
      );

      if (!response.ok) throw new Error("Échec du chargement des films.");

      const data = await response.json();
      setMovies(data.results);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des films:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTicketList = () => {
    if (movies.length > 0 && AllTickets.length > 0) {
      const films = movies.filter((movie) => AllTickets.includes(movie.id.toString()));
      setFilmBooked(films);
    } else {
      console.log("Aucun film réservé pour le moment");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllTic();
      await fetchMovies();
    };
    fetchData();
  }, []);

  useEffect(() => {
    getTicketList();
  }, [movies, AllTickets]);

  if (loading) return <ActivityIndicator size="large" color="#E0144C" className="flex-1" />;
  if (error) return <Text className="text-red-500 text-center">{error}</Text>;

  return (
    <View className="flex-1 justify-start items-start  py-2" style={{ backgroundColor: "rgba(128,128,128,0.5)" }}>
      <View className="flex-row justify-around  items-center ">
        <View>
          <Text className="text-white text-lg font-bold">Tickets</Text>
        </View>
        <TouchableOpacity
          className="px-4 py-2  rounded-lg my-2"
          onPress={() => {
            fetchAllTic();
            fetchMovies();
          }}
        >
          <Foundation name="refresh" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {FilmBooked.length > 0 ? (
        <View className="  w-screen">
          {FilmBooked.map((film, index) => (
            <View key={index} className=" flex-row  px-4 py-4  w-full mx-3 rounded-xl mb-4 " style={{ backgroundColor: "rgba(128,128,128,0.2)" }}>
              <Image
                source={{ uri: `https://image.tmdb.org/t/p/w500${film.poster_path}` }}
                className="w-32 h-48 rounded-md"
              />
              <View className="px-2 ">
              <Text className="text-white text-center">{film.title}</Text>
              <Text className="text-white text-center">{film.id}</Text>
              </View>
            
            </View>
          ))}
        </View>


      ) : (
        <Text className="text-white">Aucun film réservé</Text>
      )}
    </View>
  );
};

export default Ticket;
