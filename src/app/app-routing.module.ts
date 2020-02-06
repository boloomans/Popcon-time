import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesOverviewComponent } from './movies-overview/movies-overview.component';
import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { MoviesDetailComponent} from './movies-overview/movies-detail/movies-detail.component';

const AppRoutingModule: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MoviesOverviewComponent},
  { path: 'detail/:title', component: MoviesDetailComponent },
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
  exports: [RouterModule]
})
export class RoutingModule {}
