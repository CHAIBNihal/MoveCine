import { View, Text } from 'react-native'
import React from 'react'
import ListScreen from '../../components/Tabs/ListScreen'
import Login from '../../components/Tabs/auth/Login'
import { useGlobalProvider } from '../../Context/GlobalProvider'
import Headers from '../../components/Tabs/Headers/Headers'
const MyList = () => {
  const { token } = useGlobalProvider()
  return (
    <View className="flex-1 bg-black ">
      <Headers />
      {
        !token ? (<Login />) : (<ListScreen />)
      }
    </View>
  )
}

export default MyList