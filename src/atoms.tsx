import { atom } from "recoil";
import { IMovie, IShow } from "./api";

export const clickedSliderState = atom<string>({
	key: "clickedSliderState",
	default: "",
});

export const clickedMovieState = atom<IMovie | null>({
	key: "clickedMovieState",
	default: null,
});

export const clickedShowState = atom<IShow | null>({
	key: "clickedShowState",
	default: null,
});
