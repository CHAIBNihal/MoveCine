import { View, Text, StatusBar, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  useDerivedValue,
} from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

const WelcomeScreen = () => {
  const scale = useSharedValue(1);
  const rotate = useDerivedValue(() => {
    return `${scale.value * 2}rad`;
  });

  const rotateStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value }],
  }));

  useEffect(() => {
    // Animation infinie
    scale.value = withRepeat(withTiming(scale.value * 2, { duration: 1000 }), -1, true);

    // Redirection après 5 secondes
    const timeout = setTimeout(() => {
      router.push('/City'); // Navigation vers Home
    }, 3000);

    return () => clearTimeout(timeout); // Nettoyage au démontage du composant
  }, []);

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <Image
        source={require('../../assets/images/cinema.jpg')}
        blurRadius={30}
        className="w-full h-full absolute"
      />
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-primary text-6xl font-bold ">MovCiné</Text>

        <Animated.View className="bg-primary mt-10 items-center justify-center" style={[styles.box, rotateStyles]}>
          <FontAwesome name="video-camera" size={60} color="black" />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 100,
    width: 100,
    borderRadius: 15,
  },
});

export default WelcomeScreen;
