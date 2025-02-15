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
      <View className="flex-row justify-between py-1 px-2 ">
        <Text className="text-primary font-bold  text-3xl ml-2 mt-5 ">MoveCiné</Text>

      </View>
      {
        !token ? (<Login />) : (<ListScreen />)
      }
    </View>
  )
}

export default MyList