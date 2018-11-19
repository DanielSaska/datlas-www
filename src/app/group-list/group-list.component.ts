import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import cfg from '../../config';

export interface GroupDetails {
	name: string;
	description: string;
	count: Number;
	_id: string;
}


export interface Response {
	groups: GroupDetails[];
	start: Number;
	next: Number;
	pg_size: Number;
	max_pg: Number;
	n_entries: Number;

}


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
	displayedColumns: string[] = ['name', 'count'];
	response: Response = null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private http: HttpClient) {
		this.http.get<Response>(cfg.apiUrl+"/v1/groups/0").subscribe((res: Response) => {
			this.response = res;

		});

	}


	loadLessonsPage() {
		let start = this.paginator.pageIndex * <number>this.response.pg_size;
		this.http.get<Response>(cfg.apiUrl+"/v1/groups/"+start.toString()).subscribe((res: Response) => {
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
