import { LocationEntry } from "../models/LocationEntry";

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




