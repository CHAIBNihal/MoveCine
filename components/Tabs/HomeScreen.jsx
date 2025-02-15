import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import Headers from './Headers/Headers';
import NowShowing from '../films/NowShowing';
import CommingSoon from '../films/CommingSoon';
import ModalComponent from './Modal/ModalComponent';

const HomeScreen = () => {
  const [isDown, setisDown] = useState(false)
  const [options, setoptions] = useState(0)
  console.log(isDown)
  return (
    <View className="bg-black flex-1 blur-lg relative gap-y-5">
      <Headers />

      {/**Filter */}
      <View className=" w-1/3 justify-start ">
      
        <TouchableOpacity className="py-3 px-4 ml-3 rounded-3xl flex-row" onPress={() => setisDown(!isDown)}
          style={{ backgroundColor: "rgba(128,128,128,0.4)" }}>
          <Text className="text-md ml-4 text-white font-semibold ">Categories </Text>
        </TouchableOpacity>
      </View>
      <ModalComponent down={isDown} setDown={setisDown} />

      {/** Time Dispalying films */}
      <View className='flex-row justify-evenly items-center '>
        <TouchableOpacity onPress={() => setoptions(0)}>
          <Text className="text-xl font-bold  border-b-2 " style={{ color: options == 0 ? "#E0144C" : "grey" }} >Now Playing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setoptions(1)}>
          <Text className="text-xl font-bold  border-b-2  ml-5 " style={{ color: options == 1 ? "#E0144C" : "grey" }}>Upcoming</Text>
        </TouchableOpacity>


      </View>

      {options == 0 ? <NowShowing /> : <CommingSoon />}
    </View>
  )
}

export default HomeScreen