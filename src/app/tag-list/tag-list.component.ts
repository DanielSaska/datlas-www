import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {ConfigService } from "../config.service";

export interface TagDetails {
	name: string;
	count: Number;
	_id: string;
}


export interface Response {
	tags: TagDetails[];
	start: Number;
	next: Number;
	pg_size: Number;
	max_pg: Number;
	n_entries: Number;

}

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
	displayedColumns: string[] = ['name', 'count'];
	response: Response = null;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(private cfg : ConfigService, private http: HttpClient) {
		this.http.get<Response>(this.cfg.apiUrl()+"/v1/tags/0").subscribe((res: Response) => {
			this.response = res;

		});

	}


	loadLessonsPage() {
		let start = this.paginator.pageIndex * <number>this.response.pg_size;
		this.http.get<Response>(this.cfg.apiUrl()+"/v1/tags/"+start.toString()).subscribe((res: Response) => {
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
