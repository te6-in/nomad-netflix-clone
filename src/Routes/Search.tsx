import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
	getImagePath,
	getMovieSearchResults,
	getShowSearchResults,
	IDefaultMoviesResult,
	IDefaultShowsResult,
	IMovie,
	IShow,
	isMovie,
} from "../api";
import Loader from "../Components/Loader";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import { Overlay } from "./Home";
import ShowDetail from "../Components/ShowDetail";
import { AnimatePresence } from "framer-motion";
import MovieDetail from "../Components/MovieDetail";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { clickedMovieState, clickedShowState } from "../atoms";
import { useEffect } from "react";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 8rem 8vw 8rem 8vw;
	gap: 5rem;
`;

const Container = styled.section`
	display: flex;
	flex-direction: column;
	gap: 2rem;

	& > h1 {
		font-size: 1.5rem;
		font-weight: 600;
	}
`;

const Results = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
	gap: 3rem;
	align-items: flex-start;
`;

const Result = styled(motion.div)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	cursor: pointer;

	& > img,
	& > div {
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.75rem;
		background-color: ${(props) => props.theme.black.darkest};
		object-fit: cover;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: transform 0.3s, box-shadow 0.3s;
	}

	& > h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-align: center;
		width: 100%;
		line-height: 1.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 7;
		color: ${(props) => props.theme.white.dark};
		transition: transform 0.3s, color 0.3s;
	}

	&:hover > img,
	&:hover > div {
		transform: scale(1.2);
		box-shadow: 0 0.2rem 0.8rem rgba(120, 120, 120, 0.25);
	}

	&:hover > h2 {
		transform: translateY(1rem);
		color: ${(props) => props.theme.white.light};
	}
`;

const Line = styled.hr`
	width: 100%;
	border-color: ${(props) => props.theme.white.darkest};
`;

const GoToTop = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	font-weight: 400;
	border: none;
	gap: 0.5rem;
	background-color: transparent;
	color: ${(props) => props.theme.white.light};
	box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.15);
	transition: color 0.3s;
	cursor: pointer;

	&:hover {
		color: ${(props) => props.theme.white.dark};
	}
`;

function Search() {
	const location = useLocation();
	const keyword =
		new URLSearchParams(location.search).get("keyword") ||
		(location.state as { keyword: string }).keyword ||
		"";
	const navigate = useNavigate();
	const match = useMatch("/search/:type/:id");

	const [clickedMovie, setClickedMovie] = useRecoilState(clickedMovieState);
	const [clickedShow, setClickedShow] = useRecoilState(clickedShowState);

	const onScrollToTopClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const onContentClick = (content: IMovie | IShow) => {
		if (isMovie(content)) {
			setClickedMovie(content);
			navigate(`/search/movie/${content.id}`, { state: { keyword } });
		} else {
			setClickedShow(content);
			navigate(`/search/show/${content.id}`, { state: { keyword } });
		}
	};

	const onOverlayClick = () => {
		navigate(`/search?keyword=${keyword}`);
	};

	useEffect(() => {
		match
			? (document.body.style.overflowY = "hidden")
			: (document.body.style.overflowY = "auto");
	}, [match]);

	const { data: movieSearch, isLoading: isMovieSearchLoading } =
		useQuery<IDefaultMoviesResult>(
			["movie-search", keyword],
			() => getMovieSearchResults(keyword!),
			{
				enabled: !!keyword,
			}
		);

	const { data: showSearch, isLoading: isShowSearchLoading } =
		useQuery<IDefaultShowsResult>(
			["show-search", keyword],
			() => getShowSearchResults(keyword!),
			{
				enabled: !!keyword,
			}
		);

	return (
		<Wrapper>
			{!keyword ? (
				<Loader>검색 버튼을 클릭하여 검색해보세요.</Loader>
			) : (
				<>
					<AnimatePresence>
						<Container>
							<h1>{keyword}에 대한 영화 검색 결과</h1>
							{isMovieSearchLoading || !movieSearch ? (
								<Loader>로딩 중...</Loader>
							) : movieSearch.results.length === 0 ? (
								<Loader>
									검색 결과가 없습니다. 다른 검색어를 시도해보세요.
								</Loader>
							) : (
								<Results>
									{movieSearch.results.map((movie) => (
										<Result
											onClick={() => onContentClick(movie)}
											layoutId={"slider_search-movie_backdrop_" + movie.id}
										>
											{movie.backdrop_path || movie.poster_path ? (
												<img
													src={getImagePath(
														movie.backdrop_path || movie.poster_path || ""
													)}
													alt={`${movie.title} 장면 이미지`}
												/>
											) : (
												<div>이미지 없음</div>
											)}
											<h2 key={movie.id}>{movie.title}</h2>
										</Result>
									))}
								</Results>
							)}
						</Container>
						<Line />
						<Container>
							<h1>{keyword}에 대한 TV 프로그램 검색 결과</h1>
							{isShowSearchLoading || !showSearch ? (
								<Loader>로딩 중...</Loader>
							) : showSearch.results.length === 0 ? (
								<Loader>
									검색 결과가 없습니다. 다른 검색어를 시도해보세요.
								</Loader>
							) : (
								<Results>
									{showSearch.results.map((show) => (
										<Result
											onClick={() => onContentClick(show)}
											layoutId={"slider_search-show_backdrop_" + show.id}
										>
											{show.backdrop_path || show.poster_path ? (
												<img
													src={getImagePath(
														show.backdrop_path || show.poster_path
													)}
													alt={`${show.name} 장면 이미지`}
												/>
											) : (
												<div>이미지 없음</div>
											)}
											<h2 key={show.id}>{show.name}</h2>
										</Result>
									))}
								</Results>
							)}
						</Container>
					</AnimatePresence>
					<AnimatePresence>
						{match &&
							match.params &&
							match.params.type === "movie" &&
							match.params.id && (
								<>
									<Overlay
										onClick={onOverlayClick}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									/>
									<MovieDetail
										sliderId={"search-movie"}
										movieId={+match.params.id}
										passedMovieData={clickedMovie!}
										from={`search?keyword=${keyword}`}
									/>
								</>
							)}
					</AnimatePresence>
					<AnimatePresence>
						{match &&
							match.params &&
							match.params.type === "show" &&
							match.params.id && (
								<>
									<Overlay
										onClick={onOverlayClick}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									/>
									<ShowDetail
										sliderId={"search-show"}
										showId={+match.params.id}
										passedShowData={clickedShow!}
										from={`search?keyword=${keyword}`}
									/>
								</>
							)}
					</AnimatePresence>
					<GoToTop onClick={onScrollToTopClick}>
						맨 위로 올라가기
						<ArrowUpwardRoundedIcon />
					</GoToTop>
				</>
			)}
		</Wrapper>
	);
}

export default Search;
