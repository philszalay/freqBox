import { Component, OnInit, Input } from '@angular/core';
import { BoxContext } from '../models';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  private _boxContext: BoxContext;
  public color: string;

  @Input()
  set boxContextVolume(volume: number) {
    if (this._boxContext) {
      this._boxContext.volume = volume;
      this.color = "hsl(" + this._boxContext.frequency + "," + 100 + "%," + this._boxContext.volume + "%)";
    }
  }

  @Input()
  set boxContextFrequency(frequency: number) {
    if (this._boxContext) {
      this._boxContext.frequency = frequency;
      this.color = "hsl(" + this._boxContext.frequency + "," + 100 + "%," + this._boxContext.volume + "%)";
    }
  }

  @Input()
  set boxContext(boxContext: BoxContext) {
    if (boxContext) {
      this.color = "hsl(" + boxContext.frequency + "," + 100 + "%," + boxContext.volume + "%)";
      this._boxContext = boxContext;
    }
  }

  get boxContext(): BoxContext {
    return this._boxContext;
  }

  constructor() { }

  ngOnInit() {
  }
}
