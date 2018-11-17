import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';

import cfg from '../../config';


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

export interface GroupDetails {
	name: string;
	description: string;
	recordings: RecordingDetails[];
	analysis: AnalysisDetails;
	_id: string;
}


@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
	displayedColumns: string[] = ['id', 'date', 'tags', 'duration'];
	group_name : string = "";
	group_description : string = "";
	count : number = 0;
	plotly_velocity: any;
	analysis_addons: any;
	group_details: GroupDetails;

	constructor(private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer) {
		this.route.params.subscribe(params => {
			this.http.get<GroupDetails>(cfg.apiUrl+"/v1/group/"+params.id+"/details").subscribe((res: GroupDetails) => {
				this.group_name = res.name;
				this.group_description = res.description;
				this.count = res.recordings.length;

				for (let r of res.recordings) {
					r.datetime = new Date(r.datetime);
				}
				this.group_details = res;

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
