import { LocationEntry } from "../models/LocationEntry";

const createLocationEntry = ( newTimestamp: number,
                              newLatitude: number, 
                              newLongitude: number, 
                              newAccuracy: number ) : LocationEntry => {
    return {
        timestamp: newTimestamp,
        lat: newLatitude,
        long: newLongitude,
        accuracy: newAccuracy
    }
}




