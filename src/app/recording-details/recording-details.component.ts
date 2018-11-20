import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { RecordingDetailsDialogComponent } from '../recording-details-dialog/recording-details-dialog.component';

import cfg from '../../config';

export interface SummarySequenceElem {
	details: string[];
	name: string;
	img: string;
}

export interface AnalysisData {
	title: string;
	subtitle: string;
	html: string;
	plot: object;
	priority: number;
}


export interface Visualization {
	_id: string;
	rec_id: string;
	data_type: string;
	commit: string;
	data: AnalysisData;

}
export interface SummaryEntry {
	icon: string;
	name: string;
	value: string;
}

export interface Summary {
	entries: SummaryEntry[];
	sequence: SummarySequenceElem[];
	youtube: string;
	youtube_safe: object;
}

export interface DataType {
	_id: string;
	rec_id: string;
	name: string;
	short_name: string;
	data_type: string;
	summary: Summary;
	visualizations: Visualization[];
	vis: object[];
	err: string[];
}

export interface Recording {
	_id: string;
	commit: string;
	data_types: [string];
	summary: Summary;
	analysis: string;
	ana: Visualization[];
	tags: string[];
	err: string[];
	human_id: string;
	experiment: string;
}

@Component({
	selector: 'app-recording-details',
	templateUrl: './recording-details.component.html',
	styleUrls: ['./recording-details.component.css']
})
export class RecordingDetailsComponent implements OnInit {
	loading = true;
	recording: Recording;
	data_types: DataType[] = [];
	data_url: string = cfg.dataUrl;
	detailsDialogRef: MatDialogRef<RecordingDetailsDialogComponent>;


	constructor(private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer, private snackBar: MatSnackBar, private dialog: MatDialog) {
		this.route.params.subscribe(params => {

			this.http.get<Recording>(cfg.apiUrl+"/v1/recording/"+params.id).subscribe(async (res: Recording) => {
				res.ana = [];
				for (let a of res.analysis) {
					res.ana.push(null);
				}
				if (res.summary.youtube) {
					res.summary.youtube_safe = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+res.summary.youtube);
				}
				this.recording = res;
				//console.log(res);
				for (let dtype of res.data_types) {
					let url = cfg.apiUrl+"/v1/recording/"+params.id+"/"+dtype;
					this.http.get<DataType>(url).subscribe(async (dt: DataType) => {
						//console.log(dt);
						dt.vis = [];
						if (dt.summary.youtube) {
							dt.summary.youtube_safe = this._sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+dt.summary.youtube);
						}

						for (let v of dt.visualizations) {
							dt.vis.push(null);
						}

						this.data_types.push(dt);
						for (let vi = 0; vi < dt.visualizations.length; ++vi) {
							let v = dt.visualizations[vi];
							let url = cfg.apiUrl+"/v1/visualization/"+v;
							let r = await this.http.get<Visualization>(url).toPromise();
							dt.vis[vi] = r;
						}
					});
				}
				this.loading = false;

				for (let ai = 0; ai < res.analysis.length; ++ai) {
					let a = res.analysis[ai];
					let url = cfg.apiUrl+"/v1/recording/analysis/"+a;
					let r = await this.http.get<Visualization>(url).toPromise();
					res.ana[ai] = r;
				}
			}, (err: any) => {
				this.loading = false;
				this.snackBar.open("Error loading the resource", "OK", {
					duration: 15000,
					verticalPosition: "top",
				});
			});
		});
	}

	ngOnInit() {
	}

	getShortName(dt: DataType) {
		if (dt.short_name) {
			return dt.short_name;
		}
		return dt.name;
	}

	showDetails(dt) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.data = dt.meta;
		this.detailsDialogRef = this.dialog.open(RecordingDetailsDialogComponent,dialogConfig);
	}

}
