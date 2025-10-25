export const createCoordPayload = (locationQueue): string => {
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