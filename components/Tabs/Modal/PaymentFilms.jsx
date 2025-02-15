import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import RBSheet from 'react-native-raw-bottom-sheet'
import { FontAwesome } from '@expo/vector-icons';
import { StripeProvider } from '@stripe/stripe-react-native';
import { PUBLIC_KEY_STRIPE } from "../../../constants/index";
import CheckoutScreen from '../CheckoutScreen';
import { useGlobalProvider } from '../../../Context/GlobalProvider';
import { router } from 'expo-router';

const primary = "#E0144C",
    second = "#3E6D9C"
const PaymentFilms = ({ filmId, nameFilm }) => {
    const { emailProvider, token } = useGlobalProvider()
    const sheet = React.useRef();
    React.useEffect(() => {
        sheet.current.open()
    })
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <RBSheet ref={sheet} customStyles={{ container: styles.sheet }} height={450}>
                {
                    token ? (<View>
                        <View style={styles.headerSheet}>
                            <Text style={styles.headerSheetText}>Paye to book </Text>
                        </View>
                        <View style={styles.infos}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.infosText}> Film name : {nameFilm}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.infosText}>Price : {emailProvider} </Text>
                                <Text style={styles.infosText}>5.00</Text>
                                <FontAwesome name="dollar" size={17} color="black" style={{ marginLeft: 5, marginTop: 3 }} />
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.infosText}>Email : </Text>
                            </View>
                        </View>
                        <StripeProvider publishableKey={PUBLIC_KEY_STRIPE}>
                            <CheckoutScreen ID={filmId} />
                        </StripeProvider>
    
                    </View>) : (
                        <View style={styles.warn}>
                            <Text>You are not authorized Please Log In</Text>
                            <TouchableOpacity style={styles.warnBtn} onPress={()=>router.push('/account')}>
                                <Text style={styles.textBtn}>Go To log In</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </RBSheet>
        </SafeAreaView>

    )
}

export default PaymentFilms

const styles = StyleSheet.create({
    sheet: {
        backgroundColor: "gray",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 20,
    },
    headerSheet: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "black",
        shadowRadius: 10,
        backgroundColor: "black",
        borderRadius: 20

    },
    headerSheetText: {
        fontSize: 18,
        color: second
    },
    infos: {
        padding: 10,

    },
    infosText: {
        fontSize: 17,
    },
    warn : {
        justifyContent:'center',
        alignItems : "center",
        paddingVertical : 47
    },
    warnBtn : {
        paddingHorizontal : 10,
        paddingVertical : 15,
        backgroundColor : second,
        marginTop : 12,
        width : "100%",
        alignItems:"center",
        borderRadius : 16 
    },
    textBtn : {
        fontSize : 19,
        fontWeight : 900
    }
})