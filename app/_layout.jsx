import { Stack } from "expo-router";

import GlobalProvider from "../Context/GlobalProvider";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
      <Stack.Screen name="index" options={{headerShown : false}} />
      <Stack.Screen name="City" options={{headerShown : false}} />
      <Stack.Screen name="(tabs)" options={{headerShown : false}} />
    </Stack>
    </GlobalProvider>
    
  );
}
