import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { AntDesign, EvilIcons, Entypo } from '@expo/vector-icons';
import Register from './Register';
import { useGlobalProvider } from '../../../Context/GlobalProvider';

const Login = () => {
    const [isNotMember, setisNotMember] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // État pour afficher le chargement

    const { setToken, setLogged, setEmailProvider, setId } = useGlobalProvider();

    const isValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !password) {
            setError('Both fields are required.');
            return false;
        }

        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return false;
        }

        setError('');
        return true;
    };

    const login = async () => {
        if (!isValid()) return;
        setLoading(true); // Active le chargement

        try {
            const res = await fetch('http://192.168.11.157:4242/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (!data.success) {
                setError(data.message || 'Login failed.');
                return;
            }

            setToken(data.token);
            setEmailProvider(email);
            setId(data.user._id);
            setLogged(true);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.log('Error while logging in:', error);
        } finally {
            setLoading(false); // Désactive le chargement
        }
    };

    return !isNotMember ? (
        <View className="bg-black flex-1 justify-start items-center gap-y-4">
            <View className="py-7 mt-7 items-start justify-start w-screen px-6 rounded-2xl">
                {error && (
                    <View className="py-4 w-full mb-3 rounded-xl">
                        <Text className="text-primary text-center font-bold">{error}</Text>
                    </View>
                )}

                <View className="w-full">
                    <Text className="text-white text-2xl mb-5 font-bold text-center">Sign In</Text>
                </View>

                {/* Email Input */}
                <View className="w-full px-2 py-2">
                    <Text className="text-white text-lg font-bold mb-4">Email</Text>
                    <View className="relative">
                        <TextInput
                            onChangeText={setEmail}
                            value={email}
                            className="text-white w-full rounded-xl p-3 bg-slate-500"
                            style={{ backgroundColor: 'rgba(128,128,128,0.5)' }}
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
                            style={{ backgroundColor: 'rgba(128,128,128,0.5)' }}
                            placeholder="Password"
                            placeholderTextColor="lightgray"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            className="absolute right-3 top-3"
                            onPress={() => setShowPassword(!showPassword)}
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
                    <TouchableOpacity
                        className="bg-second px-2 py-4 rounded"
                        onPress={login}
                        disabled={loading} // Désactive le bouton pendant le chargement
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text className="text-center text-xl font-bold text-white">Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    ) : (
        <Register isHaveAccount={isNotMember} setisHaveAccount={setisNotMember} />
    );
};

export default Login;
