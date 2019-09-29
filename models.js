export class Box {
    constructor(el, lowerBoundIndex, upperBoundIndex) {
        this._volume = 0;
        this._frequency = 0;
        this._color = "hsl(" + 0 + "," + 100 + "%," + 0 + "%)";
        this.el = el;
        this.lowerBoundIndex = lowerBoundIndex;
        this.upperBoundIndex = upperBoundIndex;
    }
    get volume() {
        return this._volume;
    }
    set volume(volume) {
        this._volume = volume;
        this._color = "hsl(" + this._volume + "," + 100 + "%," + this._frequency + "%)";
        this.el.style.backgroundColor = this._color;
        console.log(this._color);
    }
    get frequency() {
        return this._frequency;
    }
    set frequency(frequency) {
        this._frequency = this.frequency;
        this._color = "hsl(" + this._volume + "," + 100 + "%," + this._frequency + "%)";
        this.el.style.backgroundColor = this._color;
    }
}
