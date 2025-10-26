export class Track {
    private _creator: string;
    private _UUID: string;
    private _best_time: number;
    private _best_racer: string;
    private _track_name: string;
    private _map_geometry: string

    constructor(
        creator: string,
        UUID: string,
        best_time: number,
        best_racer: string,
        track_name: string,
        map_geometry: string
    ) {
        this._creator = creator;
        this._UUID = UUID;
        this._best_time = best_time;
        this._best_racer = best_racer;
        this._track_name = track_name;
        this._map_geometry = map_geometry
    }

    public get creator(): string {
        return this._creator;
    }
    public set creator(value: string) {
        this._creator = value;
    }

    public get UUID(): string {
        return this._UUID;
    }
    public set UUID(value: string) {
        this._UUID = value;
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

    public get map_geometry(): string {
        return this.map_geometry;
    }
    public set map_geometry(value: string) {
        this._map_geometry = value;
    }
}

export class TrackBuilder {
    private creator: string = "";
    private UUID: string = "";
    private track_name: string = "";
    private best_time: number = 0;
    private best_racer: string = "";
    private map_geometry: string = ""

    public withCreator(creator: string): TrackBuilder {
        this.creator = creator;
        return this;
    }

    public withUUID(UUID: string): TrackBuilder {
        this.UUID = UUID;
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

    public withMapGeomtry(map_geometry: string): TrackBuilder {
        this.map_geometry = map_geometry;
        return this;
    }

    public build(): Track {
        return new Track(this.creator, 
                         this.UUID, 
                         this.best_time, 
                         this.best_racer, 
                         this.track_name,
                         this.map_geometry );
    }
}