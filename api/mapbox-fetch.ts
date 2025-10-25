import { TEST_PAYLOAD_URL } from "../test/example-payload"

export const getMapMatch = async () => {

    // Temporarily disabled for development
 // const url = createPayloadURL()
    const url = TEST_PAYLOAD_URL

    try {
        const response = await fetch(url)

        if(!response.ok) {
            throw new Error("HTTP error")
        }

        // Entire data payload -- we need to extract geometry only
        const responseData = await response.json()

        // Extract geometry data
        const geometryData = responseData.matching[0].geometry

        return geometryData

    }
    catch(error) {
        console.error("Failed to fetch MapBox match")
        return null
    }

}