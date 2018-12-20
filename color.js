var colorBoxContainer = document.getElementById('colorBoxContainer');
var colorBox_high = document.getElementById('colorBox_high');
var colorBox_mid = document.getElementById('colorBox_mid');
var colorBox_low = document.getElementById('colorBox_low');
var frequencyLevels, maxLevel = {
    low: 0,
    mid: 0,
    high: 0,
};

var audio, volume, frequency, audioContext, analyser, 
    microphone, waveform, amplitude;

var subBassLimit = 60;
var bassLimit = 250;
var midLimit = 4000;
var highLimit = 20000;
var sampleRate = 44100;
var triggerTreshhold = 0;
var frequencyLevelBuffer = {
    low: [],
    mid: [],
    high: []
}

//************************************//
// - Brightness is defined by volume  //
// - Color is defined by frequency    //
//                                    //
//                                    //
//************************************//

// function to determine if box color is updated.
function trigger(frequencyLevel, lastFrequencyLevel) {
    return Math.abs(lastFrequencyLevel - frequencyLevel) > triggerTreshhold;
}

function normalizeValue(value, from, to) {
    return value / ((analyser.fftSize / 8) / 360);
}

function normalizeLevel(value, from, to) {
    return value / (128 / 100);
}

function calcAverageFrequencyLevel(frequencyLevel, box) {
    if (box !== 'low') {
        frequencyLevelBuffer[box].push(frequencyLevel);
        if (frequencyLevelBuffer[box].length >= 28) {
            console.log('52');
            frequencyLevelBuffer[box].shift();

        }
        var sum = 0;
        for( var i = 0; i < frequencyLevelBuffer[box].length; i++){
            sum += parseInt( frequencyLevelBuffer[box][i], 10); //don't forget to add the base
        }

        var avg = sum/frequencyLevelBuffer[box].length;
        console.log(avg);
        return avg;
    }
    return frequencyLevel;
}

function calcAverage(frequencyData, from, to) {
    var sum = 0;
        var zeros = 0;
    for(var i = from; i < to; i++) {
        if (frequencyData[i] === 0) {
            zeros = zeros + 1;
        }
        sum = sum + frequencyData[i];
    }
    return normalizeLevel(sum / (to - from - zeros));
}

function calcMax(frequencyArray, from, to) {
    return Math.max.apply(null, frequencyArray.slice(from, to));
}


function calcMedian(frequencyData, from, to) {
    frequencyData.slice(from, to).sort(function(a,b) {
        return a - b;
    });

    var half = Math.floor(frequencyData.length/2);

    if(frequencyData.length % 2) {
        return frequencyData[half];
    } else {
        return (frequencyData[half - 1] + frequencyData[half]) / 2.0;
    }
}

function calcFrequencyValue(frequencyData, from, to) {
    return normalizeValue(frequencyData.indexOf(Math.max.apply(null, frequencyData.slice(from, to))), from, to);
}

function getFrequencyLevels(frequencyData) {
    return {
        low: calcAverage(frequencyData, 0, 11) - 150,
        mid: calcAverage(frequencyData, 12, 185),
        high: calcAverage(frequencyData, 186, 1023)
    }
}

function getFrequencyValues(frequencyData) {
    return {
        low: calcFrequencyValue(frequencyData, 0, 11),
        mid: calcFrequencyValue(frequencyData, 12, 185),
        high: calcFrequencyValue(frequencyData, 186, 1023)
    }
}

function colorBoxes(frequencyLevel, frequencyValue, box) {
    maxLevel[box] = maxLevel[box] - 1;
    frequencyLevel > maxLevel[box] - 50 ? maxLevel[box] = frequencyLevel : null;
    
    //console.log(frequencyValue);
    //console.log(box + ' ' + maxLevel[box]);

    return "hsl(" + calcAverageFrequencyLevel(frequencyValue, box) + "," + 100 + "%," + frequencyLevel + "%)";  
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

        renderFrame();
    }, function (error) { console.log(error) });

function renderFrame() {    
    requestAnimationFrame(renderFrame);

    // save frequencyLevels from last frame
    lastfrequencyLevels = frequencyLevels;

    // copies current data streaming trough the analyser to frequencyData Uint8Array
    analyser.getByteFrequencyData(frequencyData);

    frequencyLevels = getFrequencyLevels(frequencyData);
    frequencyValues = getFrequencyValues(frequencyData);

    trigger(frequencyLevels.low, lastfrequencyLevels.low) ? colorBox_low.style.backgroundColor = colorBoxes(frequencyLevels.low/2, frequencyValues.low, 'low') : null;
    trigger(frequencyLevels.mid, lastfrequencyLevels.mid) ? colorBox_mid.style.backgroundColor = colorBoxes(frequencyLevels.mid/2, frequencyValues.mid, 'mid') : null;
    trigger(frequencyLevels.high, lastfrequencyLevels.high) ? colorBox_high.style.backgroundColor = colorBoxes(frequencyLevels.high/2, frequencyValues.high, 'high') : null; 
}