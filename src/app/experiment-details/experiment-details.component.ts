import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';

export interface RecordingDetails {
	human_id: string;
	datetime: Date;
	duration: Number;
	tags: string[];
	_id: string;
}

export interface AnaAddon {
	title: string;
	subtitle: string;
	html: string;
	plot: Object;
	priority: Number;
}

export interface AnalysisDetails {
	addons: AnaAddon[];
}

export interface ExperimentDetails {
	name: string;
	recordings: RecordingDetails[];
	analysis: AnalysisDetails;
	_id: string;
}

@Component({
  selector: 'app-experiment-details',
  templateUrl: './experiment-details.component.html',
  styleUrls: ['./experiment-details.component.css']
})
export class ExperimentDetailsComponent implements OnInit {
	displayedColumns: string[] = ['id', 'date', 'tags', 'duration'];
	experiment_name : string = "";
	count : number = 0;
	plotly_velocity: any;
	analysis_addons: any;
	experiment_details: ExperimentDetails;

	constructor(private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer) {
		this.route.params.subscribe(params => {
			this.http.get<ExperimentDetails>("https://api.e-zfish.org/api/v1/experiment/"+params.id+"/details").subscribe((res: ExperimentDetails) => {
				this.experiment_name = res.name;
				this.count = res.recordings.length;

				for (let r of res.recordings) {
					r.datetime = new Date(r.datetime);
				}
				this.experiment_details = res;

				if (res.analysis && res.analysis.addons) {
					let addons = [];
					for (let a of res.analysis.addons) {
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
				}

			});
		});
	}

	ngOnInit() {
	}


}
