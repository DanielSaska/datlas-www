import { Component, OnInit } from '@angular/core';
import cfg from '../../config';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
	title = cfg.title;


  constructor() { }

  ngOnInit() {
  }

}
