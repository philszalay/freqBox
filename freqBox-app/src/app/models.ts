export class Box {
    constructor(el: HTMLElement, lowerBoundIndex: number, upperBoundIndex: number) {
        this.el = el;
        this.lowerBoundIndex = lowerBoundIndex;
        this.upperBoundIndex = upperBoundIndex;
    }

    public el: HTMLElement;
    public upperBoundIndex: number;
    public lowerBoundIndex: number;
    private _volume: number = 0;
    private _frequency: number = 0;
    private _color: string = "hsl(" + 0 + "," + 100 + "%," + 0 + "%)";

    get volume(): number {
        return this._volume;
    }

    set volume(volume: number) {
        this._volume = volume;
        this._color = "hsl(" + this._volume + "," + 100 + "%," + this._frequency + "%)";
        this.el.style.backgroundColor = this._color;
        console.log(this._color);
    }

    get frequency(): number {
        return this._frequency;
    }

    set frequency(frequency: number) {
        this._frequency = this.frequency;
        this._color = "hsl(" + this._volume + "," + 100 + "%," + this._frequency + "%)";
        this.el.style.backgroundColor = this._color;
    }
}