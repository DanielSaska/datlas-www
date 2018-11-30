import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config.service';

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


export interface Recording {
	_id: string;
	commit: string;
	data_types: [string];
	summary: Summary;
	custom: object;
	analysis: string;
	tags: string[];
	err: string[];
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
	selector: 'app-recording-list',
	templateUrl: './recording-list.component.html',
	styleUrls: ['./recording-list.component.css']
})
export class RecordingListComponent implements OnInit {
	dispCols: string[] = ['id', 'experiment', 'tags'];
	userCols: object[] = [];
	response: Response = null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private cfg : ConfigService, private http: HttpClient) {
		this.http.get<Response>(this.cfg.apiUrl()+"/v1/recordings/0").subscribe((res: Response) => {
			this.updateTable(res);
		});

	}

	updateTable(res) {
		this.dispCols = ['id', 'experiment', 'tags'];
		this.userCols = [];
		this.response = null;

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
		this.response = res;
		//console.log(res);
	}

	flipPage() {
		let start = this.paginator.pageIndex * <number>this.response.pg_size;
		this.http.get<Response>(this.cfg.apiUrl()+"/v1/recordings/"+start.toString()).subscribe((res: Response) => {
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
