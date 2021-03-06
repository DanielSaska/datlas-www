import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import {ConfigService } from "../config.service";

export interface BehSeqElem {
	details: string[];
	name: string;
	img: string;
}

export interface SummaryEntry {
	icon: string;
	name: string;
	value: string;
	list: boolean;
}

export interface Summary {
	entries: SummaryEntry[];
	sequence: BehSeqElem[];
	youtube_reg_dfof: string;
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
	exp_name: string;
	commit: string;
	data: AnalysisData;

}

export interface Tag {
	name: string;
	description: string;
	n_recordings: number;
	analysis: string[];
	_id: string;

	ana: Visualization[];
}

export interface Recording {
	_id: string;
	commit: string;
	data_types: string[];
	summary: Summary;
	custom: object;
	tags: string[];
	human_id: string;
	experiment: string;
}

export interface Response {
	recordings: Recording[];
	start: number;
	next: number;
	pg_size: number;
	max_pg: number;
	n_entries: number;

}

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.css']
})
export class TagDetailsComponent implements OnInit {
	dispCols: string[];
	userCols: object[] = [];
	recordings: Response = null;
	loading: boolean = true;
	tag: Tag;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private cfg : ConfigService, private http: HttpClient,private route: ActivatedRoute,private _sanitizer: DomSanitizer, private snackBar: MatSnackBar) {
		this.route.params.subscribe(params => {
			this.http.get<Tag>(this.cfg.apiUrl()+"/v1/tag/"+params.id).subscribe(async (res: Tag) => {
				res.ana = [];
				for (let a of res.analysis) {
					res.ana.push(null);
				}

				this.tag = res;

				if (res.analysis) {
					for (let ai = 0; ai < res.analysis.length; ++ai) {
						let a = res.analysis[ai];
						let url = this.cfg.apiUrl()+"/v1/tag/analysis/"+a;
						let r = await this.http.get<Visualization>(url).toPromise();
						res.ana[ai] = r;
					}
				}
				if (res.n_recordings > 0) {
					let url = this.cfg.apiUrl()+"/v1/tag/"+this.tag._id+"/recordings/0";
					this.http.get<Response>(url).subscribe((res: Response) => {
						this.updateTable(res);
					});
				}
				this.loading = false;
			}, (err: any) => {
				this.loading = false;
				this.snackBar.open("Error loading the resource", "OK", {
					duration: 15000,
					verticalPosition: "top",
				});
			});
		});
	}

	updateTable(res) {
		this.dispCols = ['id', 'experiment', 'tags'];
		this.userCols = [];
		this.recordings = null;

		for (let r of res.recordings) {
			if (!r.custom) { r.custom = {}; }
			if (r.summary && r.summary.entries) {
				for (let e of r.summary.entries) {
					if (e.list) {
						if (!r.custom[e.name]) { r.custom[e.name] = e.value.toString(); }
						else {r.custom[e.name] += ", " + e.value.toString(); };

						if (!this.dispCols.includes("usr"+e.name)) {
							this.userCols.push({def:"usr"+e.name,name:e.name});
							this.dispCols.splice(this.dispCols.length-2,0,"usr"+e.name);
						}
					}
				}
			}
		}
		//console.log(this.userCols);
		//console.log(this.dispCols);
		this.recordings = res;
		//console.log(res);
	}

	flipPage() {
		let start = this.paginator.pageIndex * <number>this.recordings.pg_size;
		this.recordings = null;
		this.http.get<Response>(this.cfg.apiUrl()+"/v1/tag/"+this.tag._id+"/recordings/"+start.toString()).subscribe((res: Response) => {
			this.updateTable(res);
		});
	}

	ngAfterViewInit() {
		this.paginator.page
			.pipe(
				tap(() => this.flipPage())
			)
			.subscribe();
	}



	ngOnInit() {
	}


}
