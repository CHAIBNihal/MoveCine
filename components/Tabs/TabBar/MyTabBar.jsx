import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const MyTabBar = ({ state, descriptors, navigation }) => {
    const primaryColor = "#E0144C";
    const secondColor = "#fff";

    const icons = {
        Home: (props) => <AntDesign name="home" size={26} color={primaryColor} {...props} />,
        MyList: (props) => <AntDesign size={26} name="hearto" color={primaryColor} {...props} />,
        Tickets: (props) => <MaterialCommunityIcons name="ticket-percent-outline" size={26} color={primaryColor} {...props} />,
        Account: (props) => <MaterialCommunityIcons name="account" size={26} color={primaryColor} {...props} />
    };

    return (
        <View className="flex-row  py-3  bottom-0 justify-center items-center bg-black   shadow-gray-200 shadow-md">
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;
                console.log(route)
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // Vérifie si l'icône existe, sinon affiche un icône par défaut
                const IconComponent = icons[route.name] || (() => <Text>❓</Text>);

                return (
                    <TouchableOpacity
                        className="flex-1 justify-center items-center"
                        key={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}
                    >
                        <IconComponent color={isFocused ? primaryColor : secondColor} />
                        <Text className="text-lg gap-1  " style={{ color: isFocused ? primaryColor : secondColor }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default MyTabBar;
