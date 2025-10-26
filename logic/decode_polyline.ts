let polyline = require("@mapbox/polyline")

export const decodeGeometry = (geometryData: string) => {
    return polyline.decode(geometryData)
}