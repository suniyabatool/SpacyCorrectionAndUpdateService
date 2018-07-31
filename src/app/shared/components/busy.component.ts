import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'tgo-busy',
  template: '<div class="loader"></div>',
})
export class BusyComponent implements OnInit {

  constructor(@Inject('message') public message: string) {};

  ngOnInit() {
  }

}
