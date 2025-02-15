import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { useGlobalProvider } from "../../Context/GlobalProvider";
import { Foundation, Ionicons, FontAwesome } from '@expo/vector-icons';
import { ServeurPoint, tmdb_Token } from "../../constants";
import QRCode from 'react-native-qrcode-svg';


const Tickets = () => {
  const { id, token, emailProvider } = useGlobalProvider();
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [filmBooked, setFilmBooked] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const endPoints = Platform.OS === 'ios' ? 'http://localhost:4242' : ServeurPoint;

  const fetchAllTickets = async () => {
    try {
      const response = await fetch(`${endPoints}/allTickets/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des tickets.");

      const data = await response.json();
      setAllTickets(data.data.length > 0 ? data.data.map((t) => t.filmId) : []);
      setError(null);
    } catch (error) {
      console.error("Erreur lors du chargement des tickets:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };



  const fetchMovies = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=2",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${tmdb_Token}`,
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
    if (movies.length > 0 && allTickets.length > 0) {
      const films = movies.filter((movie) => allTickets.includes(movie.id.toString()));
      setFilmBooked(films);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllTickets();
      await fetchMovies();
    };
    fetchData();
  }, []);

  useEffect(() => {
    getTicketList();
  }, [movies, allTickets]);

  if (loading) return <ActivityIndicator size="large" color="#E0144C" style={{ flex: 1 }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {selectedTicket ? (

        <View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <TouchableOpacity onPress={() => setSelectedTicket(null)}>
              <Ionicons name="arrow-back" size={24} color="gray" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>Ticket Details</Text>
          </View>

          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${selectedTicket.poster_path}` }}
              style={{ width: 200, height: 300, borderRadius: 10 }}
            />
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
              {selectedTicket.title}
            </Text>
          </View>


          <View style={{ padding: 10, backgroundColor: "rgba(128,128,128,0.2)", borderRadius: 10, marginBottom: 20 }}>
            <Text style={{ color: "#bbb", fontSize: 16 }}>Email: {emailProvider}</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ color: "#bbb", fontSize: 16 }}>Ticket price </Text>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>5.00</Text>
              <FontAwesome name="dollar" size={19} color="white" style={{ marginLeft: 5, marginTop: 3 }} />
            </View>
          </View>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Text style={{ color: "white", fontWeight: 700, marginBottom: 10 }}>Ticket code for scann </Text>
            <View style={{ width: "auto", backgroundColor: "rgba(128,128,128,0.5)", alignItems: 'center', padding: 19, marginBottom: 7 }}>
              <QRCode
                value={JSON.stringify({
                  email: emailProvider,
                  film: selectedTicket.title,
                  prix: 5,
                  etat: "Validé"
                })}
                size={150}
                color="black"
                backgroundColor="white"
              />
            </View>


          </View>


        </View>
      ) : (

        <ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
            <TouchableOpacity onPress={() => setSelectedTicket(null)} style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="arrow-back" size={24} color="gray" />
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>Mes Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { fetchAllTickets(); fetchMovies(); }}>
              <Foundation name="refresh" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {filmBooked.length > 0 ? (
            filmBooked.map((film, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedTicket(film)}
                style={{
                  flexDirection: "row",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  backgroundColor: "rgba(128,128,128,0.2)"
                }}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${film.poster_path}` }}
                  style={{ width: 100, height: 150, borderRadius: 10 }}
                />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{film.title}</Text>
                  <Text style={{ color: "#bbb" }}>Email: {emailProvider}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>Aucun film réservé</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Tickets;
