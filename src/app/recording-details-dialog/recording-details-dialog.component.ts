import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-recording-details-dialog',
	templateUrl: './recording-details-dialog.component.html',
	styleUrls: ['./recording-details-dialog.component.css']
})
export class RecordingDetailsDialogComponent implements OnInit {

	constructor(private dialogRef: MatDialogRef<RecordingDetailsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
	}

	ngOnInit() {
	}

	close() {
		console.log(this.data);
		this.dialogRef.close();
	}

}
