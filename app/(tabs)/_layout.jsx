import { Stack, Tabs } from "expo-router";
import { StatusBar } from "react-native";


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./home";
import MyList from "./myList";
import Ticket from "./ticket";
import Account from "./account";
import MyTabBar from "../../components/Tabs/TabBar/MyTabBar";

export default function RootLayout() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Group screenOptions={{headerShown : false}}>
      <Tab.Screen name="Home" component={Home}  />
      <Tab.Screen name="MyList" component={MyList}  />
      <Tab.Screen name="Tickets" component={Ticket}  />
      <Tab.Screen name="Account" component={Account}  />
      </Tab.Group>
    </Tab.Navigator>
  );
}
