import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import cfg from '../../config';

export interface ExperimentDetails {
	name: string;
	count: Number;
	_id: string;
}


export interface Response {
	experiments: ExperimentDetails[];
	start: Number;
	next: Number;
	pg_size: Number;
	max_pg: Number;
	n_entries: Number;

}


@Component({
	selector: 'app-experiment-list',
	templateUrl: './experiment-list.component.html',
	styleUrls: ['./experiment-list.component.css']
})
export class ExperimentListComponent implements OnInit {
	displayedColumns: string[] = ['name','count'];
	response: Response = null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private http: HttpClient) {
		this.http.get<Response>(cfg.apiUrl+"/v1/experiments/0").subscribe((res: Response) => {
			this.response = res;
		});

	}


	loadLessonsPage() {
		let start = this.paginator.pageIndex * <number>this.response.pg_size;
		this.http.get<Response>(cfg.apiUrl+"/v1/experiments/"+start.toString()).subscribe((res: Response) => {
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
