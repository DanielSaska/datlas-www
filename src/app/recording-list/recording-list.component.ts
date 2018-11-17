import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import cfg from '../../config';

export interface SampleDetails {
	expression: string[];
	dpf: Number;
	description: string;
}

export interface RecordingDetails {
	human_id: string;
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


export interface Response {
	recordings: RecordingDetails[];
	start: Number;
	next: Number;
	pg_size: Number;
	max_pg: Number;
	max: Number;

}

@Component({
	selector: 'app-recording-list',
	templateUrl: './recording-list.component.html',
	styleUrls: ['./recording-list.component.css']
})
export class RecordingListComponent implements OnInit {
	displayedColumns: string[] = ['id', 'date', 'experiment', 'tags', 'duration'];
	response: Response = null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private http: HttpClient) {
		this.http.get<Response>(cfg.apiUrl+"/v1/recordings/0").subscribe((res: Response) => {
			for (let r of res.recordings) {
				r.datetime = new Date(r.datetime);
			}
			this.response = res;

		});

	}


    loadLessonsPage() {
		 let start = this.paginator.pageIndex * <number>this.response.pg_size;
		this.http.get<Response>(cfg.apiUrl+"/v1/recordings/"+start.toString()).subscribe((res: Response) => {
			for (let r of res.recordings) {
				r.datetime = new Date(r.datetime);
			}
			this.response = res;

		});
    }

    ngAfterViewInit() {
        this.paginator.page
            .pipe(
                tap(() => this.loadLessonsPage())
            )
            .subscribe();
    }

	ngOnInit() {
	}

}
