import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';

export interface BehSeqElem {
  details: string[];
	name: string;
	img: string;
}
export interface BehSumm {
	sequence: BehSeqElem[];
	youtube_reg_dfof: string;
}



export interface BehAddon {
	title: string;
	subtitle: string;
	html: string;
	plot: Object;
	priority: Number;
}

export interface AnaAddon {
	title: string;
	subtitle: string;
	html: string;
	plot: Object;
	priority: Number;
}

export interface BehaviourDetails {
	summary: BehSumm;
	err: string[];
	_id: string;
	addons: BehAddon[];
}

export interface AnalysisDetails {
	err: string[];
	warn: string[];
	_id: string;
	addons: AnaAddon[];
}

export interface CalciumVolume {
	start: Number;
	end: Number;
	planes: Number;
	flyback: Number;
}

export interface CalciumDetails {
	summary: BehSumm;
	name: string;
	description: string;
	experiment_description: string;
	fps: Number;
	volume: CalciumVolume;
	safe_yt: any;
	yt_url: string;
	_id: string;
}




export interface SampleDetails {
	expression: string[];
	dpf: Number;
	description: string;
}

export interface RecordingDetails {
	human_id: string;
	data_types: [string];
	sample: SampleDetails;
	datetime: Date;
	duration: Number;
	description: string;
	experiment: string;
	tags: string[];
	err: string[];
	warn: string[];
	_id: string;
}

@Component({
	selector: 'app-recording-details',
	templateUrl: './recording-details.component.html',
	styleUrls: ['./recording-details.component.css']
})
export class RecordingDetailsComponent implements OnInit {
	title = 'app';
	recording_id = "";
	yt_url = "https://www.youtube.com/embed/E144tQDdY0M"; 
	safeURL : any;
	behaviour_addons: any;
	analysis_addons: any;
	recording_details: RecordingDetails;
	behaviour_details: BehaviourDetails;
	calcium_details: any;
	log_details: any[] = [];
	custom_addons: any[] = [];
	custom_details: any[] = [];

	constructor(private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer) {
		this.route.params.subscribe(params => {
			console.log(params.id);

			this.http.get<RecordingDetails>("https://api.e-zfish.org/api/v1/recording/"+params.id+"/recording/details").subscribe((res: RecordingDetails) => {
				this.recording_id = res.human_id;
				if (res.datetime) {
					res.datetime = new Date(res.datetime);
				}
				if (!res.sample.expression || res.sample.expression.length == 0) {
					res.sample.expression = ["None"]
				}
				if (res.sample.description == "") {
					res.sample.description = "No description";
				}
				if (res.description == "") {
					res.description = "No description";
				}
				//console.log(res);
				this.recording_details = res;

				//Load summary
				for (let dtype of this.recording_details.data_types) {
					let url = "https://api.e-zfish.org/api/v1/recording/"+params.id+"/"+dtype+"/summary";
					if (dtype == "vr") {
						this.http.get<BehaviourDetails>(url).subscribe((res: BehaviourDetails) => {
							this.behaviour_details = res;
						});
					} else if (dtype == "ca") {
						this.http.get<CalciumDetails>(url).subscribe((res: CalciumDetails) => {
							if (res.summary.youtube_reg_dfof) {
								res.yt_url = "https://www.youtube.com/embed/"+res.summary.youtube_reg_dfof;
								res.safe_yt = this._sanitizer.bypassSecurityTrustResourceUrl(res.yt_url);
							}
							this.calcium_details = res;
						});
					} else if (dtype == "logs") {
					} else {
						this.http.get<any>(url).subscribe((res: any) => {
							console.log(res);
							this.custom_details.push(res);
						//TODO
						});

					}
				}

				//Load details
				for (let dtype of this.recording_details.data_types) {
					let url = "https://api.e-zfish.org/api/v1/recording/"+params.id+"/"+dtype+"/addons";
					if (dtype == "vr") {
						this.http.get<BehaviourDetails>(url).subscribe((res: BehaviourDetails) => {
							let addons = [];

							for (let a of res.addons) {
								let addon = {
									html: this._sanitizer.bypassSecurityTrustHtml(a.html),
									plot: a.plot,
									title: a.title,
									subtitle: a.subtitle,
									priority: a.priority
								}
								addons.push(addon);
							}
							this.behaviour_addons = addons
						});
					} else if (dtype == "ca") {
						//TODO
					} else if (dtype == "logs") {
						this.http.get<any>(url).subscribe((res: any) => {
							//console.log(res);
							this.log_details = [];
							let keys = Object.keys(res);
							for (let k of keys) {
								if (k != "_id") {
									this.log_details.push({
										name: k,
										log: res[k]
									})
								}
							}
						});
					} else {
						this.http.get<any>(url).subscribe((res: any) => {
							console.log(res);
							this.custom_addons.push(res);
						//TODO
						});
					}
				}
			});

			this.http.get<AnalysisDetails>("https://api.e-zfish.org/api/v1/recording/"+params.id+"/analysis/addons").subscribe((res: AnalysisDetails) => {
				console.log(res);
				let addons = [];

				for (let a of res.addons) {
					let addon = {
						html: this._sanitizer.bypassSecurityTrustHtml(a.html),
						plot: a.plot,
						title: a.title,
						subtitle: a.subtitle,
						priority: a.priority
					}
					addons.push(addon);
				}
				this.analysis_addons = addons
			});


		});
	}

	ngOnInit() {
	}

}
