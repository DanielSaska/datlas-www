import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";

import { AppComponent } from './app.component';
import { RecordingListComponent } from './recording-list/recording-list.component';
import { RecordingDetailsComponent } from './recording-details/recording-details.component';
import { ExperimentListComponent } from './experiment-list/experiment-list.component';
import { ExperimentDetailsComponent } from './experiment-details/experiment-details.component';
import { TagDetailsComponent } from './tag-details/tag-details.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupListComponent } from './group-list/group-list.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
	{ path: 'landing', component: LandingComponent },
	{ path: 'recordings', component: RecordingListComponent },
	{ path: 'tags', component: TagListComponent },
	{ path: 'groups', component: GroupListComponent },
	{ path: 'experiments', component: ExperimentListComponent },
	{ path: 'recording/:id', component: RecordingDetailsComponent },
	{ path: 'tag/:id', component: TagDetailsComponent },
	{ path: 'group/:id', component: GroupDetailsComponent },
	{ path: 'experiment/:id', component: ExperimentDetailsComponent },
	{ path: '',
		redirectTo: '/landing',
		pathMatch: 'full'
	}//,
	//{ path: '**', component: PageNotFoundComponent }
];



export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);


