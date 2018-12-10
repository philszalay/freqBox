var colorBoxContainer = document.getElementById('colorBoxContainer');
var colorBox_high = document.getElementById('colorBox_high');
var colorBox_mid = document.getElementById('colorBox_mid');
var colorBox_low = document.getElementById('colorBox_low');
var audio, volume, frequencies, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;
var outputHigh = 3000;
var inputLow = 100;

var subBassLimit = 60;
var bassLimit = 250;
var midLimit = 4000;
var highLimit = 20000;

function sig2hz (frequencies, options) {
    var rate = 22050 / 1024; // defaults in audioContext.
  
    if (options) {
      if (options.rate) {
        rate = options.rate;
      }
    }
  
    var maxI, max = frequencies[0];
    
    for (var i=0; frequencies.length > i; i++) {
      var oldmax = parseFloat(max);
      var newmax = Math.max(max, frequencies[i]);
      if (oldmax != newmax) {
        max = newmax;
        maxI = i;
      } 
    }
    return maxI * rate;
}

function random_bg_color(frequency) {
    var r = Math.floor(Math.random() * 256);
    x = y = z = ((frequency -inputLow) / (outputHigh) * 255); 
    console.log(x);
    return "rgb(" + (x) + "," + (y) + "," + (z) + ")";  
}
    
navigator.getUserMedia(
    {
    audio: true, 
    video: false
    }, function (stream) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        frequencies = new Float32Array(analyser.frequencyBinCount);
        amplitude = new Uint8Array(analyser.frequencyBinCount);
        
        volume = audioContext.createGain();
        
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(volume);
        microphone.connect(analyser);

        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {
    lastFrequency = frequency;
    requestAnimationFrame(renderFrame);
    analyser.getFloatFrequencyData(frequencies);
    analyser.getByteTimeDomainData(amplitude);
    
    frequency = sig2hz(frequencies);

    // console.log(frequency);

    if (frequency !== lastFrequency) {
        frequency < bassLimit ? colorBox_low.style.backgroundColor = random_bg_color(frequency) : null;
        frequency >= bassLimit && frequency < midLimit ? colorBox_mid.style.backgroundColor = random_bg_color(frequency): null;
        frequency >= midLimit && frequency <= highLimit ? colorBox_high.style.backgroundColor = random_bg_color(frequency): null;
    }
}