import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private appConfig;

	constructor(private http: HttpClient) { }

	loadConfig() {
		return this.http.get('/assets/config.json')
			.toPromise()
			.then(data => {
				this.appConfig = data;
			});
	}

	apiUrl() {
		return this.appConfig.apiUrl;
	}
	dataUrl() {
		return this.appConfig.dataUrl;
	}
	title() {
		return this.appConfig.title;
	}
}
