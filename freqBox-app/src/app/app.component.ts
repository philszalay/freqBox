import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BoxContext } from './models';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'freqBox-app';
  private frequencyData: Uint8Array;
  private analyser: any;
  private boxContextLow: BoxContext;
  private boxContextMid: BoxContext;
  private boxContextHigh: BoxContext;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    navigator.getUserMedia(
      {
        audio: true,
        video: false
      }, (stream) => {
        // sample rate is 44100
        let audioContext = new AudioContext();
        let source = audioContext.createMediaStreamSource(stream);
        this.analyser = audioContext.createAnalyser();
        source.connect(this.analyser);
        // analyser.fftSize = 2048 default
        // container for current frequencyData
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        // const colorBoxContainer: HTMLElement = new Box(document.getElementById('colorBoxContainer') ,0 ,0, 0, 0);
        this.boxContextHigh = new BoxContext(this.getLowerBoundIndex(environment.midUpperBound), this.getUpperBoundIndex(environment.highUpperBound));
        this.boxContextMid = new BoxContext(this.getLowerBoundIndex(environment.bassUpperBound), this.getUpperBoundIndex(environment.midUpperBound));
        this.boxContextLow = new BoxContext(this.getLowerBoundIndex(0), this.getUpperBoundIndex(environment.bassUpperBound));

        this.renderFrame();
      }, (error) => { console.log(error) });
  };

  renderFrame() {
    // 60fps
    requestAnimationFrame(this.renderFrame.bind(this));
    this.analyser.getByteFrequencyData(this.frequencyData);

    this.colorBoxes();

    // console.log('render frame', this.frequencyData);
  }

  getUpperBoundIndex(upperBound: number) {
    return (upperBound / environment.highUpperBound) * this.frequencyData.length;
  }

  getLowerBoundIndex(lowerBound: number) {
    return (lowerBound / environment.highUpperBound) * this.frequencyData.length;
  }

  getVolume(boxContext: BoxContext): number {
    let count = Array.from(this.frequencyData).slice(boxContext.lowerBoundIndex, boxContext.upperBoundIndex).length;
    let values = Array.from(this.frequencyData).slice(boxContext.lowerBoundIndex, boxContext.upperBoundIndex).reduce((previous, current) => current += previous);
    return 100 * (values /= count) / 255 - environment.volumeThreshold;
  }

  getFrequency(boxContext: BoxContext): number {
    let max = Math.max(...Array.from(this.frequencyData).slice(boxContext.lowerBoundIndex, boxContext.upperBoundIndex));

    function isLargeNumber(element) {
      return element === max;
    }

    let index = 360 * (Array.from(this.frequencyData).slice(boxContext.lowerBoundIndex, boxContext.upperBoundIndex).findIndex(isLargeNumber) + boxContext.lowerBoundIndex) / this.frequencyData.length;

    if (index > boxContext.maxFrequency) {
      boxContext.maxFrequency = index;
    } else if(index < boxContext.minFrequency && index > 0) {
      boxContext.minFrequency = index;
    }

    return index;
  }

  colorBoxes() {
    this.boxContextHigh.volume = this.getVolume(this.boxContextHigh);
    this.boxContextMid.volume = this.getVolume(this.boxContextMid);
    this.boxContextLow.volume = this.getVolume(this.boxContextLow);

    this.boxContextHigh.frequency = this.getFrequency(this.boxContextHigh);
    this.boxContextMid.frequency = this.getFrequency(this.boxContextMid);
    this.boxContextLow.frequency = this.getFrequency(this.boxContextLow);

    this.ref.detectChanges();
  }

}
