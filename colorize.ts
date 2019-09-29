const colorBoxContainer = document.getElementById('colorBoxContainer');
const colorBox_high = document.getElementById('colorBox_high');
const colorBox_mid = document.getElementById('colorBox_mid');
const colorBox_low = document.getElementById('colorBox_low');
let frequencyLevels, frequencyValues, maxLevel = {
    low: 0,
    mid: 0,
    high: 0,
};

let audio, volume, frequency, audioContext, analyser,
    microphone, waveform, amplitude, source, frequencyData;

const subBassUpperLimit = 60;
const bassUpperLimit = 250;
const midUpperLimit = 4000;
const highUpperLimit = 20000;
const sampleRate = 44100;
const triggerTreshhold = 0;
const frequencyLevelBuffer = {
    low: [],
    mid: [],
    high: []
};

function colorBoxes(frequencyData) {
    let min = 0;
    let max = -99999; 

    max = Math.max(...frequencyData) > max ? Math.max(...frequencyData) : max;
    min = Math.min(...frequencyData) < min ? Math.min(...frequencyData) : min;

    console.log(min, max);

    colorBox_low.style.backgroundColor = "hsl(" + 255 + "," + 100 + "%," + 255 + "%)";
    colorBox_mid.style.backgroundColor = "hsl(" + 0 + "," + 100 + "%," + 0 + "%)";
    colorBox_high.style.backgroundColor = "hsl(" + 0 + "," + 100 + "%," + 0 + "%)";
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
        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {
    // 60fps
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(frequencyData);
    colorBoxes(frequencyData);

    // console.log('render frame', frequencyData);
}
