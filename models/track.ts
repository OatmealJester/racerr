class Track {
    constructor(
        public creator: string,
        public UID: string,
        public best_time: number,
        public best_racer: string,
        public track_name: string
    ) { }
}

class TrackBuilder {
    private creator: string = "";
    private UID: string = "";
    private best_time: number = 0;
    private best_racer: string = "";
    private track_name: string = "";

    public setCreator(creator: string): TrackBuilder {
        this.creator = creator;
        return this;
    }

    public setUID(UID: string): TrackBuilder {
        this.UID = UID;
        return this;
    }

    public setBestTime(best_time: number): TrackBuilder {
        this.best_time = best_time;
        return this;
    }

    public setBestRacer(best_racer: string): TrackBuilder {
        this.best_racer = best_racer;
        return this;
    }

    public setTrackName(track_name: string): TrackBuilder {
        this.track_name = track_name;
        return this;
    }

    public build(): Track {
        return new Track(this.creator, this.UID, this.best_time, this.best_racer, this.track_name);
    }
}