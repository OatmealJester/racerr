import * as Location from "expo-location";
import { LocationEntry } from "../models/LocationEntry";
import { LocationQueue } from "../models/LocationQueue";

const createLocationEntry = ( newTimestamp: number,
                              newLatitude: number, 
                              newLongitude: number, 
                              newAccuracy: number ) : LocationEntry => {
    return {
        timestamp: newTimestamp,
        latitude: newLatitude,
        longitude: newLongitude,
        accuracy: newAccuracy
    }
}

let locationSubscription: Location.LocationSubscription | null = null

export const startLocationTracking = async ( 
    onLocationUpdate: (coords: Location.LocationObjectCoords) => void
) : Promise<void> => {
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.error('Permission denied');
        return;
    }

    if (locationSubscription)
        await stopLocationTracking()

    locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 500, distanceInterval: 1 },

        (locationObj) => { 
            let newEntry: LocationEntry = createLocationEntry( Date.now(), 
                                                               locationObj.coords.latitude,
                                                               locationObj.coords.longitude,
                                                               Location.Accuracy.Highest )

            LocationQueue.push(newEntry)
            console.log(LocationQueue.length === 0 ? "Queue is empty" : LocationQueue[0])

            onLocationUpdate(locationObj.coords)
        }
    )
}

export function stopLocationTracking() {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
  }
}
