import { Component, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import cfg from '../config';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	@ViewChild(MatSidenav) sidenav: MatSidenav;
	version: string = "0.2.0";
	year: string = "2018";
	title = cfg.title;

	constructor(){
	}

	toggleMenu() {
		this.sidenav.toggle();
	}
}
