// import { Box } from './models';
class Box {
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
        this._color = "hsl(" + this.volume + "," + 100 + "%," + this.frequency + "%)";
        this.el.style.backgroundColor = this._color;
    }
    get frequency() {
        return this._frequency;
    }
    set frequency(frequency) {
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
let audio, volume, frequency, audioContext, analyser, microphone, waveform, amplitude, source;
let frequencyData;
let colorBoxLow;
let colorBoxMid;
let colorBoxHigh;
function getVolume(colorBox) {
    return Math.max(...Array.from(frequencyData).slice(colorBox.lowerBoundIndex, colorBox.upperBoundIndex));
}
function colorBoxes(colorBoxLow, colorBoxMid, colorBoxHigh) {
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
function getUpperBoundIndex(upperBound) {
    return upperBound / 20000 * frequencyData.length;
}
function getLowerBoundIndex(lowerBound) {
    return lowerBound / 20000 * frequencyData.length;
}
navigator.getUserMedia({
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
}, function (error) { console.log(error); });
function renderFrame() {
    // 60fps
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(frequencyData);
    colorBoxes(colorBoxLow, colorBoxMid, colorBoxHigh);
    // console.log('render frame', frequencyData);
}
