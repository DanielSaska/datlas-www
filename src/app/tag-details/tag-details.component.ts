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

export interface TagDetails {
	name: string;
	recordings: RecordingDetails[];
	analysis: AnalysisDetails;
	_id: string;
}


@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {
	displayedColumns: string[] = ['id', 'date', 'tags', 'duration'];
	tag_name : string = "";
	count : number = 0;
	plotly_velocity: any;
	analysis_addons: any;
	tag_details: TagDetails;

	constructor(private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer) {
		this.route.params.subscribe(params => {
			this.http.get<TagDetails>("https://api.e-zfish.org/api/v1/tag/"+params.id+"/details").subscribe((res: TagDetails) => {
				this.tag_name = res.name;
				this.count = res.recordings.length;

				for (let r of res.recordings) {
					r.datetime = new Date(r.datetime);
				}
				this.tag_details = res;

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
