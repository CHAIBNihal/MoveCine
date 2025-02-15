import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Login from '../../components/Tabs/auth/Login'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalProvider } from "../../Context/GlobalProvider";
import Tickets from "../../components/Tabs/Tickets"
const Ticket = () => {
  const { token } = useGlobalProvider();
  return (
    <SafeAreaView className="bg-black flex-1 ">
      <View className="flex-row justify-between py-1 px-2 ">
        <Text className="text-primary font-bold  text-3xl ml-2 mt-5 ">MoveCiné</Text>
      </View>
      {
        !token ? (<Login />) : (<Tickets />)
      }
    </SafeAreaView>
  )
}

export default Ticket