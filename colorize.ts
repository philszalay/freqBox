// import { Box } from './models';

class Box {
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
        this._color = "hsl(" + this.volume + "," + 100 + "%," + this.frequency + "%)";
        this.el.style.backgroundColor = this._color;
    }

    get frequency(): number {
        return this._frequency;
    }

    set frequency(frequency: number) {
        this._frequency = frequency;
        this._color = "hsl(" + this.volume + "," + 100 + "%," + this.frequency + "%)";
        this.el.style.backgroundColor = this._color;
    }
}

const subBassUpperBound = 60;
const bassUpperBound = 250;
const midUpperBound = 4000;
const highUpperBound = 20000;
const sampleRate = 44100;

let audio, volume, frequency, audioContext, analyser,
    microphone, waveform, amplitude, source;

let frequencyData: Uint8Array;
let colorBoxLow: Box;
let colorBoxMid: Box;
let colorBoxHigh: Box;

function getVolume(colorBox: Box): number {
    return Math.max(...Array.from(frequencyData).slice(colorBox.lowerBoundIndex, colorBox.upperBoundIndex));
}

function colorBoxes(colorBoxLow: Box, colorBoxMid: Box, colorBoxHigh: Box) {
    let min = 255;
    let max = 0;

    max = Math.max(...Array.from(frequencyData)) > max ? Math.max(...Array.from(frequencyData)) : max;
    min = Math.min(...Array.from(frequencyData)) < min ? Math.min(...Array.from(frequencyData)) : min;

    colorBoxHigh.volume = getVolume(colorBoxHigh);
    colorBoxMid.volume = getVolume(colorBoxMid);
    colorBoxLow.volume = getVolume(colorBoxLow);

    // colorBoxHigh.frequency = Math.max(...Array.from(frequencyData));
    // colorBoxMid.frequency = Math.max(...Array.from(frequencyData));
    // colorBoxLow.frequency = Math.max(...Array.from(frequencyData));
}

function getUpperBoundIndex(upperBound: number) {
    return upperBound / 20000 * frequencyData.length;
}

function getLowerBoundIndex(lowerBound: number) {
    return lowerBound / 20000 * frequencyData.length;
}

navigator.getUserMedia(
    {
        audio: true,
        video: false
    }, function (stream) {
        // sample rate is 44100
        audioContext = new AudioContext();
        source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        source.connect(analyser);
        // analyser.fftSize = 2048 default
        // container for current frequencyData
        frequencyData = new Uint8Array(analyser.frequencyBinCount);

        // const colorBoxContainer: HTMLElement = new Box(document.getElementById('colorBoxContainer') ,0 ,0, 0, 0);
        colorBoxHigh = new Box(document.getElementById('colorBox_high'), getLowerBoundIndex(midUpperBound), getUpperBoundIndex(highUpperBound));
        colorBoxMid = new Box(document.getElementById('colorBox_mid'), getLowerBoundIndex(bassUpperBound), getUpperBoundIndex(midUpperBound));
        colorBoxLow = new Box(document.getElementById('colorBox_low'), getLowerBoundIndex(0), getUpperBoundIndex(bassUpperBound));

        console.log(colorBoxHigh, colorBoxMid, colorBoxLow);

        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {
    // 60fps
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(frequencyData);

    colorBoxes(colorBoxLow, colorBoxMid, colorBoxHigh);

    // console.log('render frame', frequencyData);
}
