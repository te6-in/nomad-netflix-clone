const API_KEY: string = process.env.REACT_APP_API_KEY ?? "";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KR";

export interface IMovie {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface INowplayingMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface IDefaultMoviesResult {
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface IMovieDetail {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: {
		id: number;
		name: string;
		poster_path: string;
		backdrop_path: string;
	};
	budget: number;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string;
	id: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: {
		id: number;
		logo_path: string;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: {
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface IPersonImages {
	id: number;
	profiles: {
		file_path: string;
		aspect_ratio: number;
		height: number;
		iso_639_1: string;
		vote_average: number;
		vote_count: number;
		width: number;
	}[];
}

export interface IShow {
	original_name: string;
	genre_ids: number[];
	name: string;
	popularity: number;
	origin_country: string[];
	vote_count: number;
	first_air_date: string;
	backdrop_path: string;
	original_language: string;
	id: number;
	vote_average: number;
	overview: string;
	poster_path: string;
}

export interface INowplayingShowsResult {
	page: number;
	results: IShow[];
	total_pages: number;
	total_results: number;
}

export interface IDefaultShowsResult {
	page: number;
	results: IShow[];
	total_pages: number;
	total_results: number;
}

export interface IShowDetail {
	backdrop_path: string;
	created_by: {
		id: number;
		credit_id: string;
		name: string;
		gender: number;
		profile_path: string;
	}[];
	episode_run_time: number[];
	first_air_date: string;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: {
		air_date: string;
		episode_number: number;
		id: number;
		name: string;
		overview: string;
		production_code: string;
		season_number: number;
		still_path: string;
		vote_average: number;
		vote_count: number;
	};
	name: string;
	next_episode_to_air: null;
	networks: {
		name: string;
		id: number;
		logo_path: string;
		origin_country: string;
	}[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: {
		id: number;
		logo_path: string;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	seasons: {
		air_date: string;
		episode_count: number;
		id: number;
		name: string;
		overview: string;
		poster_path: string;
		season_number: number;
	}[];
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface ICredits {
	id: number;
	cast: {
		adult: boolean;
		gender: number;
		id: number;
		known_for_department: string;
		name: string;
		original_name: string;
		popularity: number;
		profile_path: string;
		cast_id: number;
		character: string;
		credit_id: string;
		order: number;
	}[];
	crew: {
		adult: boolean;
		gender: number;
		id: number;
		known_for_department: string;
		name: string;
		original_name: string;
		popularity: number;
		profile_path: string;
		credit_id: string;
		department: string;
		job: string;
	}[];
}

export function isMovie(data: IMovie | IShow): data is IMovie {
	return (data as IMovie).title !== undefined;
}

export function getImagePath(imageId: string | null, format?: string): string {
	if (imageId === null) return "";
	return `https://image.tmdb.org/t/p/${format ? format : "original"}${imageId}`;
}

export function getPersonImages(personId: number) {
	return fetch(
		`${BASE_PATH}/person/${personId}/images?api_key=${API_KEY}`
	).then((res) => res.json());
}

export function getNowplayingMovies() {
	return fetch(
		`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getPopularMovies() {
	return fetch(
		`${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getTopratedMovies() {
	return fetch(
		`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getGenreMovies(genreId: number) {
	return fetch(
		`${BASE_PATH}/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=popularity.desc&with_genres=${genreId}`
	).then((response) => response.json());
}

export function getMovieDetail(movieId: number) {
	return fetch(
		`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`
	).then((response) => response.json());
}

export function getMovieCredits(movieId: number) {
	return fetch(
		`${BASE_PATH}/movie/${movieId}/credits?api_key=${API_KEY}&language=${LANGUAGE}`
	).then((response) => response.json());
}

export function getSimilarMovies(movieId: number) {
	return fetch(
		`${BASE_PATH}/movie/${movieId}/similar?api_key=${API_KEY}&language=${LANGUAGE}&page=1`
	).then((response) => response.json());
}

export function getNowplayingShows() {
	return fetch(
		`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getPopularShows() {
	return fetch(
		`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getTopratedShows() {
	return fetch(
		`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&page=1&region=kr`
	).then((response) => response.json());
}

export function getGenreShows(genreId: number) {
	return fetch(
		`${BASE_PATH}/discover/tv?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=popularity.desc&with_genres=${genreId}`
	).then((response) => response.json());
}

export function getShowDetail(showId: number) {
	return fetch(
		`${BASE_PATH}/tv/${showId}?api_key=${API_KEY}&language=${LANGUAGE}`
	).then((response) => response.json());
}

export function getShowCredits(showId: number) {
	return fetch(
		`${BASE_PATH}/tv/${showId}/credits?api_key=${API_KEY}&language=${LANGUAGE}`
	).then((response) => response.json());
}

export function getSimilarShows(showId: number) {
	return fetch(
		`${BASE_PATH}/tv/${showId}/similar?api_key=${API_KEY}&language=${LANGUAGE}&page=1`
	).then((response) => response.json());
}

export function getMovieSearchResults(keyword: string) {
	return fetch(
		`${BASE_PATH}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${keyword}&page=1&include_adult=false`
	).then((response) => response.json());
}

export function getShowSearchResults(keyword: string) {
	return fetch(
		`${BASE_PATH}/search/tv?api_key=${API_KEY}&language=${LANGUAGE}&query=${keyword}&page=1&include_adult=false`
	).then((response) => response.json());
}
