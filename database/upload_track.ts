import { doc, setDoc } from "firebase/firestore";
import { Track } from "../models/Track";
import { database } from "./firebase";

export const uploadTrack = async (newTrack: Track) => {
    
    const trackRef = doc(database, "tracks", newTrack.UUID);

    try {
        await setDoc(trackRef, {
            geometry_data: newTrack.map_geometry,
            creator: newTrack.creator,
            track_name: newTrack.track_name,
            best_time: newTrack.best_time,
            best_racer: newTrack.best_racer
        });

        console.log("Finished uploading track ID", newTrack.UUID);

    } catch (error) {
        console.error("Error uploading track:", error);
    }
}