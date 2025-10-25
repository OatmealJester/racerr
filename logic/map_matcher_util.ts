import { MAPBOX_API_KEY } from "../api/key"
import { MAPBOX_PROFILE, MAPBOX_URL } from "../constants/constants"
import { locationQueue } from "../models/LocationQueue"

const createCoordPayload = (locationQueue): string => {
    let requestString: string = ""
    
    while(locationQueue.length !== 0) {
        let current = locationQueue.shift()
        requestString += current.latitude + "," + current.longitude + ";"
    }

    // Remove last semicolon
    requestString = requestString.substring(0,requestString.length-1)

    console.log(requestString)

    return requestString
}

const getApiKeyBody = () => {
    let keyBody = "?access_token="

    keyBody += MAPBOX_API_KEY

    return keyBody
}

export const createPayload = () => {
    let payload = ""
    
    payload += MAPBOX_URL
    payload += MAPBOX_PROFILE
    payload += createCoordPayload(locationQueue)
    payload += getApiKeyBody()

    return payload
}