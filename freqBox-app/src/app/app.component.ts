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
    return upperBound / 20000 * this.frequencyData.length;
  }

  getLowerBoundIndex(lowerBound: number) {
    return lowerBound / 20000 * this.frequencyData.length;
  }

  getVolume(boxContext: BoxContext): number {
    let count = this.frequencyData.length;
    let values = this.frequencyData.reduce((previous, current) => current += previous);
    return (values /= count) - 50;
  }

  getFrequency(boxContext: BoxContext): number {
    return Math.max(...Array.from(this.frequencyData).slice(boxContext.lowerBoundIndex, boxContext.upperBoundIndex));
  }

  colorBoxes() {
    let min = 255;
    let max = 0;

    max = Math.max(...Array.from(this.frequencyData)) > max ? Math.max(...Array.from(this.frequencyData)) : max;
    min = Math.min(...Array.from(this.frequencyData)) < min ? Math.min(...Array.from(this.frequencyData)) : min;

    this.boxContextHigh.volume = this.getVolume(this.boxContextHigh);
    this.boxContextMid.volume = this.getVolume(this.boxContextMid);
    this.boxContextLow.volume = this.getVolume(this.boxContextLow);

    this.boxContextHigh.frequency = this.getFrequency(this.boxContextHigh);
    this.boxContextMid.frequency = this.getFrequency(this.boxContextMid);
    this.boxContextLow.frequency = this.getFrequency(this.boxContextLow);

    // colorBoxHigh.frequency = Math.max(...Array.from(frequencyData));
    // colorBoxMid.frequency = Math.max(...Array.from(frequencyData));
    // colorBoxLow.frequency = Math.max(...Array.from(frequencyData));

    this.ref.detectChanges();
  }

}
