import { View, Text } from 'react-native'
import React from 'react'
import Headers from '../../components/Tabs/Headers/Headers'
import Login from '../../components/Tabs/auth/Login'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalProvider } from "../../Context/GlobalProvider";
import Tickets from "../../components/Tabs/Tickets"
const Ticket = () => {
  const { token, setLogged, setEmailProvider} = useGlobalProvider();
  return(
    <SafeAreaView className="bg-black flex-1 ">
       <Headers/>
       {
        !token ?  ( <Login />) : (<Tickets/>)
       }
      
        
    </SafeAreaView>
  )
 
}

export default Ticket