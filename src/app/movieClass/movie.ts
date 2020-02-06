import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Movie {
    isFavorite = false;
    id: number;
    Title: string;
    Poster: string;
    Lore: string;
    Year: string;
    Rating: string;
    Genre: string;
    Response: string;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    shortTitle: string;
}

