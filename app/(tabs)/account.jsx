import { View, Text } from 'react-native'
import React from 'react'
import Headers from '../../components/Tabs/Headers/Headers'
import Login from '../../components/Tabs/auth/Login'
import { useGlobalProvider } from '../../Context/GlobalProvider'
import User from "../../components/Tabs/User"
const Account = () => {
  const {token} = useGlobalProvider()
  return (
    <View className="flex-1 bg-black ">
     <Headers/>
     {
      !token ? (<Login />) : (
        <User/>
      )
      
     }
    
    </View>
    
  )
}

export default Account