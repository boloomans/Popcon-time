import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesOverviewComponent } from './movies-overview/movies-overview.component';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';

const AppRoutingModule: Routes = [
  {path: '', component: AppComponent},
  {path: 'home', component: MoviesOverviewComponent}
  // {path: 'add', component: CityAddComponent},
  // {path: 'detail/:id', component: CityDetailComponent}
];

@NgModule({
  // declarations: [],
  // imports: [
  //   CommonModule
  // ]
  imports: [
    RouterModule.forRoot(
        AppRoutingModule,
        // { enableTracing: true } // <-- debugging purposes only
    ),
    CommonModule
  ],
})
export class RoutingModule {}
