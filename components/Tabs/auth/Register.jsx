import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useGlobalProvider } from '../../../Context/GlobalProvider';
import Entypo from '@expo/vector-icons/Entypo';

const Register = ({ isHaveAccount, setisHaveAccount }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setToken, token, setLogged, setEmailProvider, setId } = useGlobalProvider();
    const [showPassword, setShowPassword] = useState(false); // Nouvel état pour afficher ou cacher le mot de passe

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

    const RegisterUser = async () => {
        if (!isValid()) return;

        try {
            const res = await fetch("http://192.168.11.121:4242/signUp", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log("data", data.token);
            if (data.success) {
                console.log("Login is success")
                setToken(data.token)
                setEmailProvider(email)
                console.log(token)
                setId(data.user._id)

            } else {
                setError(data.message)
            }
        } catch (error) {
            console.log("Error while logging in:", error);
        }
    };
    return (
        <View className="bg-black flex-1 justify-start  items-center gap-y-4">

            {error && (
                <View className="py-4 w-full mb-3 rounded-xl">
                    <Text className="text-primary text-center font-bold">
                        {error}
                    </Text>
                </View>
            )}
            <View className=" w-full">
                <Text className="text-white text-2xl mb-5 font-bold text-center mt-3 ">Sign Up </Text>
            </View>

            <View className="py-7  items-start justify-start w-screen px-6 rounded-2xl">
                <View className="w-full px-2 py-2">
                    <Text className="text-white text-lg font-bold mb-4">Email</Text>
                    <View className="flex-row relative">
                        <TextInput
                            className="text-white w-full rounded-xl bg-slate-500"
                            onChangeText={(e) => { setEmail(e) }}
                            style={{ backgroundColor: "rgba(128,128,128,0.5)" }}
                            placeholder="example@gmail.com"
                            placeholderTextColor="lightgray"
                        />
                        <AntDesign name="user" size={24} color="white" className="absolute right-1 top-2" />
                    </View>
                </View>

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

                <View className="flex-row justify-around mx-2">
                    <Text className="text-white text-lg">If you have an account?</Text>
                    <Text
                        className="text-primary font-bold text-lg ml-2"
                        onPress={() => setisHaveAccount(false)}
                    >
                        Sign In
                    </Text>
                </View>

                <View className="w-full mt-4 py-8">
                    <TouchableOpacity className="bg-second px-2 py-4 rounded" onPress={RegisterUser}>
                        <Text className="text-center text-xl font-bold text-white">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Register;
