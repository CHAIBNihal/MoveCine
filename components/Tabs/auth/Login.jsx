import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import Register from './Register';
import {useGlobalProvider} from "../../../Context/GlobalProvider"
import Entypo from '@expo/vector-icons/Entypo';
const Login = () => {
    const [isNotMember, setisNotMember] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    //Providers values
    const {setToken, setLogged, setEmailProvider, logged, setId} = useGlobalProvider();
    const isValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setError("Both fields are required.");
            return false;
        }

        if (!emailRegex.test(email)) {
            setError("Invalid email format.");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }

        setError(""); // Clear errors if all validations pass
        return true;
    };

    const login = async () => {
        if (!isValid()) return;

        try {
            const res = await fetch("http://192.168.11.121:4242/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log(data)
            if(data.success){
                setLogged(true)
                console.log("Login is success", logged)
            }
           setToken(data.token)
           setEmailProvider(email)
           setError(data.message)
           setId(data.user._id)
           
        } catch (error) {
            console.log("Error while logging in:", error);
            setError(error)
        }
    };

    return !isNotMember ? (
        <View className="bg-black flex-1 justify-start  items-center gap-y-4">
            <View className="py-7 mt-7 items-start justify-start w-screen px-6 rounded-2xl">
                {error && (
                    <View className="py-4 w-full mb-3 rounded-xl">
                        <Text className="text-primary text-center font-bold">
                            {error}
                        </Text>
                    </View>
                )}
                <View className=" w-full">
                <Text className="text-white text-2xl mb-5 font-bold text-center ">Sign In </Text>
                </View>

                {/* Email Input */}
                <View className="w-full px-2 py-2">
                    <Text className="text-white text-lg font-bold mb-4">Email</Text>
                    <View className="relative">
                        <TextInput
                            onChangeText={setEmail}
                            value={email}
                            className="text-white w-full rounded-xl p-3 bg-slate-500"
                            style={{ backgroundColor: "rgba(128,128,128,0.5)" }}
                            placeholder="example@gmail.com"
                            placeholderTextColor="lightgray"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <AntDesign name="user" size={24} color="white" className="absolute right-3 top-3" />
                    </View>
                </View>

                {/* Password Input */}
                <View className="w-full px-2 py-2">
                    <Text className="text-white text-lg font-bold mb-4">Password</Text>
                    <View className="relative">
                        <TextInput
                            onChangeText={setPassword}
                            value={password}
                            className="text-white w-full rounded-xl p-3 bg-slate-500"
                            style={{ backgroundColor: "rgba(128,128,128,0.5)" }}
                            placeholder="Password"
                            placeholderTextColor="lightgray"
                            secureTextEntry={!showPassword} // Affiche ou cache le mot de passe
                        />
                        <TouchableOpacity
                            className="absolute right-3 top-3"
                            onPress={() => setShowPassword(!showPassword)} // Inverse l'état
                        >
                            {showPassword ? (
                                <Entypo name="eye-with-line" size={24} color="white" />
                            ) : (
                                <EvilIcons name="eye" size={28} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Register Link */}
                <View className="flex-row justify-around mx-2 mt-4">
                    <Text className="text-white text-lg">If you don't have an account?</Text>
                    <Text className="text-primary font-bold text-lg ml-2" onPress={() => setisNotMember(true)}>
                        Register
                    </Text>
                </View>

                {/* Login Button */}
                <View className="w-full mt-4 py-8">
                    <TouchableOpacity className="bg-second px-2 py-4 rounded" onPress={login}>
                        <Text className="text-center text-xl font-bold text-white">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    ) : (
        <Register isHaveAccount={isNotMember} setisHaveAccount={setisNotMember} />
    );
};

export default Login;
