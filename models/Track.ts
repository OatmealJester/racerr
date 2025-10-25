export class Track {
    private _creator: string;
    private _UID: string;
    private _best_time: number;
    private _best_racer: string;
    private _track_name: string;

    constructor(
        creator: string,
        UID: string,
        best_time: number,
        best_racer: string,
        track_name: string
    ) {
        this._creator = creator;
        this._UID = UID;
        this._best_time = best_time;
        this._best_racer = best_racer;
        this._track_name = track_name;
    }

    public get creator(): string {
        return this._creator;
    }
    public set creator(value: string) {
        this._creator = value;
    }

    public get UID(): string {
        return this._UID;
    }
    public set UID(value: string) {
        this._UID = value;
    }

    public get best_time(): number {
        return this._best_time;
    }
    public set best_time(value: number) {
        if (value < 0) throw new Error("Best time cannot be negative.");
        this._best_time = value;
    }

    public get best_racer(): string {
        return this._best_racer;
    }
    public set best_racer(value: string) {
        this._best_racer = value;
    }

    public get track_name(): string {
        return this._track_name;
    }
    public set track_name(value: string) {
        this._track_name = value;
    }
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