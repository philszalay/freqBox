var colorBoxContainer = document.getElementById('colorBoxContainer');
var colorBox_high = document.getElementById('colorBox_high');
var colorBox_mid = document.getElementById('colorBox_mid');
var colorBox_low = document.getElementById('colorBox_low');
var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;

var subBassLimit = 60;
var bassLimit = 250;
var midLimit = 4000;
var highLimit = 20000;

function freqDataToBoxFreqs (frequencyData) {
    return {
        low: (frequencyData[0] + frequencyData[1]) / 2,
        mid: (frequencyData[2] + frequencyData[3] + frequencyData[4]) / 3,
        high: (frequencyData[5] + frequencyData[6] + frequencyData[7]) / 3,
    }
}

function random_bg_color(frequency, box) {
    var r = Math.floor(Math.random() * 256);
    return "rgb(" + (frequency) + "," + (frequency) + "," + (frequency) + ")";  
}
    
navigator.getUserMedia(
    {
    audio: true, 
    video: false
    }, function (stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 32;
        frequencyData = new Uint8Array(analyser.frequencyBinCount);

        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {
    analyser.getByteFrequencyData(frequencyData);

    frequencies ? oldFrequencies = frequencies : null;
    frequencies = freqDataToBoxFreqs(frequencyData);
    
    console.log(frequencies);

    colorBox_low.style.backgroundColor = random_bg_color(frequencies.low, 'low');
    colorBox_mid.style.backgroundColor = random_bg_color(frequencies.mid, 'mid');
    colorBox_high.style.backgroundColor = random_bg_color(frequencies.high, 'high');
    
    requestAnimationFrame(renderFrame);
}