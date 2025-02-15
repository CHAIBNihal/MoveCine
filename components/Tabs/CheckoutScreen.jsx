import React from 'react';
import { View, Button, Platform } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { useGlobalProvider } from '../../Context/GlobalProvider';
import { ServeurPoint } from '../../constants';

function CheckoutScreen({ ID }) {
  const { emailProvider, token, id } = useGlobalProvider();
  const { confirmPayment, loading } = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    try {
      const apiEndpoint = Platform.OS === 'ios' ? 'http://localhost:4242' : ServeurPoint;
      console.log(`${apiEndpoint}/booking`);

      const response = await fetch(`${apiEndpoint}/booking`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: 50,
          filmId: ID,
          userId: id,
          email: emailProvider,
          quantite: 1,
        }),
      });

      const data = await response.json();
      console.log("Response data", data);

      if (!data.clientSecret) {
        throw new Error("No client secret received from server");
      }

      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      return null;
    }
  };

  const handlePayPress = async () => {
    try {
      const clientSecret = await fetchPaymentIntentClientSecret();
      if (!clientSecret) return;

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: { billingDetails: { email: emailProvider } },
      });

      if (error) {
        console.log('Payment confirmation error:', error);
      } else if (paymentIntent) {
        console.log('Success from promise:', paymentIntent);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  return (
    <View>
      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{ backgroundColor: '#FFFFFF', textColor: '#000000' }}
        style={{ width: '100%', height: 50, marginVertical: 30 }}
        onCardChange={(cardDetails) => console.log('cardDetails', cardDetails)}
        onFocus={(focusedField) => console.log('focusField', focusedField)}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
}

export default CheckoutScreen;
