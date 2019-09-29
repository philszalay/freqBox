import { Component, OnInit, Input } from '@angular/core';
import { Box } from '../models';

@Component({
  selector: 'box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  @Input()
  color: string;

  constructor() {
    
  }

  ngOnInit() {

  }
}
