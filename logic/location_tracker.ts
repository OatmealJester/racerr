import * as Location from "expo-location";
import { LocationEntry } from "../models/LocationEntry";
import { locationQueue } from "../models/LocationQueue";
import { createCoordPayload } from "./map_matcher";

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

    console.log('Starting tracker')

    locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 500, distanceInterval: 1 },

        (locationObj) => { 
            let newEntry: LocationEntry = createLocationEntry( Date.now(), 
                                                               locationObj.coords.latitude,
                                                               locationObj.coords.longitude,
                                                               Location.Accuracy.Highest )

            locationQueue.push(newEntry)
            console.log(locationQueue.length === 0 ? "Queue is empty" : locationQueue[locationQueue.length-1])

            onLocationUpdate(locationObj.coords)
        }
    )
}

export function stopLocationTracking() {
  if (locationSubscription) {
    console.log("Stopping tracker")
    locationSubscription.remove();
    locationSubscription = null;

    createCoordPayload(locationQueue)

  }
}
