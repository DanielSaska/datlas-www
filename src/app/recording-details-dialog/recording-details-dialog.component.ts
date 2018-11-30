import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfigService } from '../config.service';

@Component({
	selector: 'app-recording-details-dialog',
	templateUrl: './recording-details-dialog.component.html',
	styleUrls: ['./recording-details-dialog.component.css']
})
export class RecordingDetailsDialogComponent implements OnInit {

	constructor(private cfg : ConfigService, private dialogRef: MatDialogRef<RecordingDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
	}

	ngOnInit() {
	}

	close() {
		this.dialogRef.close();
	}

}
