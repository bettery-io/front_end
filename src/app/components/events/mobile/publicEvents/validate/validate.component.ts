import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.sass']
})
export class ValidateComponent implements OnInit {
  @Input() eventData;

  constructor() { }

  ngOnInit(): void {
  }

}
