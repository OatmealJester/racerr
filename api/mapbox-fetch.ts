import { TEST_PAYLOAD_URL } from "../test/example-payload"

export const getMapMatch = async () : Promise<string> => {

    // Temporarily disabled for development
 // const url = createPayloadURL()
    const url = TEST_PAYLOAD_URL

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })

        if(!response.ok) {
            throw new Error("HTTP error")
        }

        // Entire data payload -- we need to extract geometry only
        const responseData = await response.json()

        if (!responseData.matchings || !responseData.matchings[0]) {
            throw new Error('No matching data found in response')
        }

        // Extract geometry data
        const geometryData: string = responseData.matchings[0].geometry

        console.log("Geometry data:", geometryData)

        return geometryData

    }
    catch(error) {
        console.error("Failed to fetch MapBox match:", error)
        if (error instanceof Error) {
            console.error("Error details:", error.message)
        }
        if (error instanceof Response) {
            console.error("Response status:", error.status)
            console.error("Response text:", await error.text())
        }
        return null
    }

}