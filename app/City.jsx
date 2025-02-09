import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const City = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [errorCity, setErrorCity] = useState("");

    const cities = [
        { id: 1, city: "Marrakesh" },
        { id: 2, city: "CasaBlanca" },
        { id: 3, city: "Rabat" },
        { id: 4, city: "Fes" },
        { id: 5, city: "Meknes" },
        { id: 6, city: "Tanger" },
        { id: 7, city: "Kenitra" }
    ];

    // Sauvegarder la ville sélectionnée et naviguer
    const handleSelect = async () => {
        if (!selectedCity) {
            setErrorCity('No city selected, please select your city.');
        } else {
            try {
                await AsyncStorage.setItem('City', selectedCity);
                router.push('/home');
            } catch (error) {
                console.error("Erreur lors de l'enregistrement de la ville :", error);
            }
        }
    };

    
    useEffect(() => {
        const checkStoredCity = async () => {
            try {
                const storedCity = await AsyncStorage.getItem('City');
                if (storedCity) {
                    console.log("Stored city", storedCity)
                    router.replace('/home');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de la ville stockée :", error);
            }
        };

        checkStoredCity();
    }, []);
    return (
        <View className="bg-black flex-1">
            <Text className="text-primary text-5xl font-bold pl-4 pt-8">MovCiné</Text>

            {errorCity ? (
                <Text className="text-red-500 text-center mt-4 font-semibold">{errorCity}</Text>
            ) : null}

            <SafeAreaView className="flex-1 mt-7 pl-4">
                <Text className="mt-3 text-white mb-4 text-center text-2xl">Select your city</Text>
                <FlatList
                    data={cities}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setSelectedCity(item.city)}
                            className="py-2 px-3 mb-6 mx-2 rounded-3xl"
                            style={{
                                backgroundColor: "rgba(128, 128, 128, 0.4)",
                                borderWidth: selectedCity === item.city ? 2 : 0,
                                borderColor: selectedCity === item.city ? "#3E6D9C" : "transparent",
                            }}
                        >
                            <Text className="text-white text-xl text-center">{item.city}</Text>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>

            {/* Bouton positionné en bas à droite */}
            <View className="absolute bottom-10 right-5">
                <TouchableOpacity
                    className="flex-row px-4 py-4 rounded-3xl"
                    onPress={handleSelect}
                    style={{ backgroundColor: "rgba(128, 128, 128, 0.6)" }}
                >
                    <Text className="text-white text-xl">Book for a movie</Text>
                    <AntDesign className="mt-1 ml-3" name="caretright" size={24} color="#3E6D9C" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default City;
