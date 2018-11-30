import { Component, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import { ConfigService } from "./config.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	@ViewChild(MatSidenav) sidenav: MatSidenav;
	version: string = "0.2.1";
	year: string = "2018";
	title = this.cfg.title();

	constructor(private cfg : ConfigService){
	}

	toggleMenu() {
		this.sidenav.toggle();
	}
}
