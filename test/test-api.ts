import { getMapMatch } from "../api/mapbox-fetch";

async function testAPI() {
    console.log("Testing MapBox API call...");
    const result = await getMapMatch();
    console.log("Result:", result);
}

testAPI();