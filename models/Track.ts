export class Track {
    constructor(
        public creator: string,
        public UID: string,
        public best_time: number,
        public best_racer: string,
        public track_name: string
    ) { }
}

export class TrackBuilder {
    private creator: string = "";
    private UID: string = "";
    private track_name: string = "";
    private best_time: number = 0;
    private best_racer: string = "";

    public withCreator(creator: string): TrackBuilder {
        this.creator = creator;
        return this;
    }

    public withUID(UID: string): TrackBuilder {
        this.UID = UID;
        return this;
    }

    public withBestTime(best_time: number): TrackBuilder {
        this.best_time = best_time;
        return this;
    }

    public withBestRacer(best_racer: string): TrackBuilder {
        this.best_racer = best_racer;
        return this;
    }

    public withTrackName(track_name: string): TrackBuilder {
        this.track_name = track_name;
        return this;
    }

    public build(): Track {
        return new Track(this.creator, this.UID, this.best_time, this.best_racer, this.track_name);
    }
}