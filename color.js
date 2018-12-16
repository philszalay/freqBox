var colorBoxContainer = document.getElementById('colorBoxContainer');
var colorBox_high = document.getElementById('colorBox_high');
var colorBox_mid = document.getElementById('colorBox_mid');
var colorBox_low = document.getElementById('colorBox_low');
var frequencies = {
    low: 255,
    mid: 255,
    high: 255,
};
var audio, volume, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;

var subBassLimit = 60;
var bassLimit = 250;
var midLimit = 4000;
var highLimit = 20000;
var sampleRate = 44100;
var maxDiff = 5;
var minDiff = 0;
var maximum = {
    low: 0,
    mid: 0,
    high: 0
}

function normalize255(val) {
    return (Math.exp(val) - Math.exp(minDiff)) * 255 / (Math.exp(maxDiff) - Math.exp(minDiff));
}

// function to determine if box color is updated.
function trigger(frequencyLevel, lastFrequencyLevel) {
    return Math.abs(lastFrequencyLevel - frequencyLevel) > minDiff;
}

function calcAverage(frequencyData, from, to) {
    var sum = 0;
    for(var i = from; i < to; i++) {
        sum = sum + frequencyData[i];
    }
    return sum / (to - from);
}

function calcMax(frequencyData, from, to) {
    return Math.max(frequencyData.slice(from, to));
}

function freqDataToBoxFreqs (frequencyLevel) {
    return {
        low: calcAverage(frequencyLevel, 0, 11),
        mid: calcAverage(frequencyLevel, 12, 185),
        high: calcAverage(frequencyLevel, 186, 1023)
    }
}

function random_bg_color(frequencyLevel, box) {
    maximum[box] = maximum[box] - 1;

    console.log(maximum[box]);
    
    frequencyLevel > maximum[box] ? console.log('newmaximum ' + frequencyLevel) :null;
    frequencyLevel > maximum[box] ? maximum[box] = frequencyLevel : null;
    
    
    var r = Math.floor(Math.random() * 256);
    return "rgb(" + maximum[box] + "," + maximum[box] + "," + maximum[box] + ")";  
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
        analyser.fftSize = 2048;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);

        // for(var i = 0; i < 1024; i++) {
        //     console.log(i*sampleRate/analyser.fftSize);
        // }

        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {    
    requestAnimationFrame(renderFrame);

    lastFrequencies = frequencies;

    // copies current data streaming trough the analyser to frequencyData Uint8Array
    analyser.getByteFrequencyData(frequencyData);

    frequencies = freqDataToBoxFreqs(frequencyData);

    trigger(frequencies.low, lastFrequencies.low) ? colorBox_low.style.backgroundColor = random_bg_color(frequencies.low, 'low') : null;
    trigger(frequencies.mid, lastFrequencies.mid) ? colorBox_mid.style.backgroundColor = random_bg_color(frequencies.mid, 'mid') : null;
    trigger(frequencies.high, lastFrequencies.high) ? colorBox_high.style.backgroundColor = random_bg_color(frequencies.high, 'high') : null; 
}