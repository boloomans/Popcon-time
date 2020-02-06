import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MoviesOverviewComponent } from './movies-overview/movies-overview.component';
import {FormsModule} from '@angular/forms';
import { RoutingModule } from './app-routing.module';
import {MovieApiService} from './movieApi/movie-api.service';
import { MoviesDetailComponent } from './movies-overview/movies-detail/movies-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    MoviesOverviewComponent,
    MoviesDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    RoutingModule
  ],
  providers: [MovieApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
