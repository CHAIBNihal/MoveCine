import { Alert } from "react-native";

export const AddToFavoriteList = async (userId, filmId, token) => {
  try {
    if (!userId) {
      Alert.alert("You have to log in first.");
      return; // Arrêter l'exécution si l'utilisateur n'est pas connecté
    }

    const res = await fetch('http://192.168.11.121:4242/wishList', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, filmId }),
    });

    const data = await res.json();

    if (res.ok) {
      Alert.alert("Success", "Film added to your favorites list!");
      console.log("Film added successfully:", data);
    } else {
      Alert.alert("Error", data.message || "Failed to add to favorites.");
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};


export const createTicket = async(userId, filmId, email, token )=>{
  try {
    const amount = "5"
    if (!userId) {
      Alert.alert('You have to log in first');
      return;
    }
    
    if (!userId || !email || !token || !filmId) {
      Alert.alert('All params are required');
      return;
    }
    
    const res = await fetch('http://192.168.11.121:4242/booking',{
      method : 'POST',
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}`
      },
      body : JSON.stringify({userId, email, filmId, amount})
    })
    console.log("Processs is make it ")
    console.log(userId, filmId, email, token)
    const data = await res.json()
    if(data.success){
      Alert.alert('ticket reservation made by success')
    }else{
      Alert.alert("Error", data.message || "Failed to booke it .");
    }

  } catch (error) {
    console.error("Error creating ticket:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
}