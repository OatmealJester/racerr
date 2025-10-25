var Track = /** @class */ (function () {
    function Track(creator, UID, best_time, best_racer, track_name) {
        this.creator = creator;
        this.UID = UID;
        this.best_time = best_time;
        this.best_racer = best_racer;
        this.track_name = track_name;
    }
    return Track;
}());
var TrackBuilder = /** @class */ (function () {
    function TrackBuilder() {
        this.creator = "";
        this.UID = "";
        this.best_time = 0;
        this.best_racer = "";
        this.track_name = "";
    }
    TrackBuilder.prototype.setCreator = function (creator) {
        this.creator = creator;
        return this;
    };
    TrackBuilder.prototype.setUID = function (UID) {
        this.UID = UID;
        return this;
    };
    TrackBuilder.prototype.setBestTime = function (best_time) {
        this.best_time = best_time;
        return this;
    };
    TrackBuilder.prototype.setBestRacer = function (best_racer) {
        this.best_racer = best_racer;
        return this;
    };
    TrackBuilder.prototype.setTrackName = function (track_name) {
        this.track_name = track_name;
        return this;
    };
    TrackBuilder.prototype.build = function () {
        return new Track(this.creator, this.UID, this.best_time, this.best_racer, this.track_name);
    };
    return TrackBuilder;
}());
// ✅ Example usage:
var track = new TrackBuilder()
    .setCreator("Luis")
    .setUID("UID123")
    .setBestTime(92.5)
    .setBestRacer("SpeedyRacer")
    .setTrackName("Sunset Circuit")
    .build();
console.log(track);
