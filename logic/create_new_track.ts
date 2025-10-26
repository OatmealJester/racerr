import "react-native-get-random-values"
import { v4 as uuidv4 } from "uuid"
import { userName } from "../app/userName"
import { Track, TrackBuilder } from "../models/Track"

export const createNewTrack = (geometryData: string): Track => {

    const uuid: string = uuidv4()

    let newTrack: Track = new TrackBuilder()
                                .withUUID(uuid)
                                .withMapGeomtry(geometryData)
                                .withCreator(userName)
                                .build()
                                
    return newTrack    
}

