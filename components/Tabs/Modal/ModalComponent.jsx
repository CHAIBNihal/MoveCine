import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ModalComponent = ({ down, setDown }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDJhZTBiNzE4MDQ3Yzc3MWYxMmQyNmFhOTA0ZDNjMCIsIm5iZiI6MTczODYxMTIxOS4zNjYwMDAyLCJzdWIiOiI2N2ExMWExM2VkODI5ZWJjNTZlMmI0NGYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.3K88CPu4X0HUOYc3J5Ns4GfL5dijSKMsDcT9Hr0ayvA'
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(url, options);
                const data = await response.json();
                if (data.genres) {
                    setCategories(data.genres);
                } else {
                    console.error("Format inattendu de la réponse :", data);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        };

        fetchCategories();
    }, []); // Ajout du tableau de dépendances pour éviter les appels répétés

    return (
        <Modal visible={down} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/70">
                <View className="w-full h-full items-center p-4">
                    <TouchableOpacity
                        onPress={() => setDown(false)}
                        className="absolute top-4 right-4"
                    >
                        <FontAwesome name="close" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Liste des catégories dynamiques */}
                    <View >
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <Text key={category.id} className="text-white text-lg py-2">
                                    {category.name}
                                </Text>
                            ))
                        ) : (
                            <Text className="text-white text-lg py-2">Chargement...</Text>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;
