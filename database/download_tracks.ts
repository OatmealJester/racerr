import { collection, getDocs } from "firebase/firestore";
import { database } from "./firebase"; // Your firestore db instance

export const getTracksList = async () => {
    
    const tracksCollectionRef = collection(database, "tracks");
    
    try {
        const querySnapshot = await getDocs(tracksCollectionRef);
        
        const tracksList = [];
        
        querySnapshot.forEach((doc) => {
            // 'doc.id' is the document ID (e.g., your UUID)
            // 'doc.data()' is the object containing the data (e.g., { geometry_data: "..." })
            tracksList.push({
                id: doc.id,
                ...doc.data() // Spreads the document data fields
            });
        });
        
        console.log(tracksList);
        return tracksList;
        
    } catch (error) {
        console.error("Error getting documents: ", error);
        return []; 
    }
}