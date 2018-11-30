import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from '@angular/common/http';
import { PlotlyModule } from 'angular-plotly.js';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import {
	MatAutocompleteModule,
	MatBadgeModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatGridListModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
	exports: [
		CdkTableModule,
		CdkTreeModule,
		MatAutocompleteModule,
		MatBadgeModule,
		MatBottomSheetModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatCardModule,
		MatCheckboxModule,
		MatChipsModule,
		MatStepperModule,
		MatDatepickerModule,
		MatDialogModule,
		MatDividerModule,
		MatExpansionModule,
		MatGridListModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatMenuModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatRadioModule,
		MatRippleModule,
		MatSelectModule,
		MatSidenavModule,
		MatSliderModule,
		MatSlideToggleModule,
		MatSnackBarModule,
		MatSortModule,
		MatTableModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,
		MatTreeModule,
	],
	imports: [ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })],
	declarations: [],
})
export class MaterialModule {}


import { AppComponent } from './app.component';
import { RecordingListComponent } from './recording-list/recording-list.component';
import { RecordingDetailsComponent } from './recording-details/recording-details.component';
import { routingModule } from './app.routing';
import { ExperimentDetailsComponent } from './experiment-details/experiment-details.component';
import { ExperimentListComponent } from './experiment-list/experiment-list.component';
import { TagDetailsComponent } from './tag-details/tag-details.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupListComponent } from './group-list/group-list.component';
import { RecordingDetailsDialogComponent } from './recording-details-dialog/recording-details-dialog.component';
import { LandingComponent } from './landing/landing.component';
import { ConfigService } from './config.service';

const appInitializerFn = (cfg: ConfigService) => {
  return () => {
    return cfg.loadConfig();
  };
};

@NgModule({
	declarations: [
		AppComponent,
		RecordingListComponent,
		RecordingDetailsComponent,
		ExperimentDetailsComponent, 
		ExperimentListComponent, 
		TagDetailsComponent, 
		GroupListComponent,
		GroupDetailsComponent,
		RecordingDetailsDialogComponent,
		LandingComponent,
		TagListComponent
	],
	imports: [
		ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MaterialModule,
		FlexLayoutModule,
		PlotlyModule,
		routingModule
	],
	entryComponents: [
		RecordingDetailsDialogComponent
	],

	providers: [
		ConfigService,
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializerFn,
			multi: true,
			deps: [ConfigService]
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
