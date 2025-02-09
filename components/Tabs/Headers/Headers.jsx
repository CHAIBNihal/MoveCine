import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

const Headers = () => {
    const [isSearching, setisSearching] = useState(false)
 const [myCity, setMyCity] = useState("")

  useEffect(()=>{
    const getCity = async()=>{
        try {
            const storedCity = await AsyncStorage.getItem('City');
            if (storedCity) {
                setMyCity(storedCity)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la ville stockée :", error);
        }
    }
    getCity()
  })
    const handlSearch = () => {
        setisSearching(!isSearching)
    }



    
    return (
    <View>
           
        <View className="flex-row justify-between py-1 px-2 ">
            <Text className="text-primary font-bold  text-3xl ml-2 mt-5 ">MoveCiné</Text>

            <TouchableOpacity
                className="mt-4 mr-2 flex-row justify-between px-3 rounded-3xl "
                onPress={handlSearch}
                style={{ backgroundColor: isSearching ? `rgba(128, 128, 128, 0.3)` : "#000" }} // Gray transparent
            >
                {isSearching && (
                    <TextInput className="w-1/2 text-white " placeholder='Find Your Film' />
                )}
                <FontAwesome name="search" className="py-2" size={24} color="#E0144C" />
            </TouchableOpacity>
        </View>
        <View className='mx-3 mt-4 '>
            <View className="flex-row">
            <Entypo name="location-pin" size={24} color="#3E6D9C" />
            {
               myCity && ( <Text className='text-white text-xl font-semibold ml-2 '
                onPress={()=>{
                    AsyncStorage.removeItem('City')
                    router.push('/City')
                 }} 
               >
                {myCity}
               </Text>)
           }
           
            </View>
          
        </View>
    </View>
        
    )
}

export default Headers