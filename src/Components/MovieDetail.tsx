import { useQuery } from "react-query";
import styled from "styled-components";
import {
	getImagePath,
	ICredits,
	IMovie,
	IMovieDetail,
	getMovieDetail,
	getMovieCredits,
	IDefaultMoviesResult,
	getSimilarMovies,
} from "../api";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import Person from "./Person";
import Similar from "./Similar";

const Wrapper = styled(motion.div)`
	position: fixed;
	width: clamp(20rem, 50vw, 36rem);
	height: 80vh;
	background-color: ${(props) => props.theme.black.dark};
	top: 10vh;
	left: calc(50% - clamp(10rem, 25vw, 18rem));
	border-radius: 0.75rem;
	padding: 1.5rem;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
	overflow-y: overlay;

	&::-webkit-scrollbar {
		width: 0.8rem;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 0.4rem;
		background-clip: padding-box;
		border: 0.3rem solid transparent;
	}
`;

const CloseButton = styled.button`
	position: absolute;
	top: 0.75rem;
	right: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.25rem;
	height: 2.25rem;
	border-radius: 0.5rem;
	z-index: 1;
	color: ${(props) => props.theme.white.light};
	background-color: transparent;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: rgba(255, 255, 255, 0.25);
	}
`;

const BigCover = styled.div<{ bgpath: string }>`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	aspect-ratio: 16/9;
	background: linear-gradient(
			#18181815,
			#181818af,
			${(props) => props.theme.black.dark}
		),
		url(${(props) => props.bgpath});
	background-size: cover;
	background-position: center;
	border-radius: 0.75rem 0.75rem 0 0;
	filter: saturate(2) grayscale(0.6);
`;

const DetailContainer = styled.div`
	margin-top: clamp(2.5rem, 6.25vw, 4.5rem);
	left: 0;
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
`;

const BigPoster = styled.img`
	left: 35%;
	width: 30%;
	aspect-ratio: 2/3;
	object-fit: cover;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
	border-radius: 1rem;
	margin-bottom: clamp(1rem, 2.5vw, 1.8rem);
`;

const BigTitle = styled.h2`
	width: 100%;
	font-size: 2.5rem;
	font-weight: 600;
	text-align: center;
	line-height: 1.35;
	word-break: keep-all;
	margin-bottom: clamp(0.2rem, 0.5vw, 0.36rem);
`;

const SmallTitle = styled.h3`
	width: 100%;
	font-size: 1.2rem;
	font-weight: 400;
	text-align: center;
	line-height: 1.35;
	word-break: keep-all;
	margin-bottom: clamp(0.4rem, 1vw, 0.72rem);
	color: ${(props) => props.theme.white.dark};
`;

const Genres = styled.ul`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	justify-content: center;
	gap: 0.5rem;
	margin-top: clamp(0.4rem, 1vw, 0.72rem);
	margin-bottom: clamp(1rem, 2.5vw, 1.8rem);
`;

const Genre = styled.li`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	font-weight: 600;
	padding: 0.5rem 0.55rem;
	border-radius: 0.5rem;
	background-color: ${(props) => props.theme.black.light};
	color: ${(props) => props.theme.white.dark};
`;

const Rating = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: clamp(0.8rem, 2vw, 1.44rem);

	& > :first-child {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		gap: 0.75rem;
		color: ${(props) => props.theme.gold};
	}

	& > :last-child {
		color: ${(props) => props.theme.white.dark};
	}
`;

const DetailOverview = styled.p`
	width: 100%;
	font-size: 1rem;
	line-height: 1.5;
	text-align: justify;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: keep-all;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 7;
	color: ${(props) => props.theme.white.darker};
	margin-bottom: clamp(1.2rem, 3vw, 2.16rem);
`;

const Stars = styled.div`
	color: ${(props) => props.theme.black.light};
	position: relative;
	width: max-content;
	font-size: 2rem;

	& > div:first-child {
		color: ${(props) => props.theme.gold};
		padding: 0;
		position: absolute;
		z-index: 1;
		display: flex;
		top: 0px;
		left: 0;
		overflow: hidden;
	}

	& > div:last-child {
		padding: 0;
		z-index: 0;
	}

	& svg {
		margin: -0.2rem;
		width: 2.5rem;
		height: 2.5rem;
	}
`;

const SectionTitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: clamp(0.8rem, 2vw, 1.44rem);
	font-size: 1.4rem;
	color: ${(props) => props.theme.white.dark};

	& > :first-child {
		font-weight: 700;
	}

	& > :last-child {
		font-size: 1rem;
		color: ${(props) => props.theme.white.darkest};
	}
`;

const HorizontalScroll = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	width: 100%;
	overflow-x: auto;
	padding-bottom: 0.5rem;

	&:not(:last-child) {
		margin-bottom: clamp(1.2rem, 3vw, 2.16rem);
	}

	&::-webkit-scrollbar {
		width: 0.8rem;
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${(props) => props.theme.black.light};
		border-radius: 0.5rem;
		background-clip: padding-box;
		border: 0.3rem solid transparent;
	}
`;

interface IMovieDetailProps {
	movieId: number;
	sliderId?: string;
	passedMovieData: IMovie;
	from?: string;
}

function MovieDetail({
	movieId,
	sliderId = "",
	passedMovieData,
	from = "",
}: IMovieDetailProps) {
	const navigate = useNavigate();

	const { data: movieDetail, isLoading: isMovieDetailLoading } =
		useQuery<IMovieDetail>(
			["movie-detail", movieId],
			() => getMovieDetail(movieId),
			{ enabled: movieId !== 0 }
		);

	const { data: movieCredits, isLoading: isMovieCreditsLoading } =
		useQuery<ICredits>(
			["movie-credits", movieId],
			() => getMovieCredits(movieId),
			{ enabled: movieId !== 0 }
		);

	const { data: similarMovies, isLoading: isSimilarMoviesLoading } =
		useQuery<IDefaultMoviesResult>(
			["similar-movies", movieId],
			() => getSimilarMovies(movieId),
			{
				enabled: movieId !== 0,
			}
		);

	return (
		<Wrapper
			layoutId={"slider_" + sliderId + "_backdrop_" + movieId}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ y: window.innerHeight }}
			transition={{ type: "tween", duration: 0.5 }}
		>
			<CloseButton
				onClick={() => {
					navigate(`/${from}`);
				}}
			>
				<CloseRoundedIcon />
			</CloseButton>
			<BigCover
				bgpath={getImagePath(
					passedMovieData
						? passedMovieData.backdrop_path || passedMovieData.poster_path
						: movieDetail
						? movieDetail.backdrop_path || movieDetail.poster_path
						: ""
				)}
			/>
			<DetailContainer>
				<BigPoster
					src={getImagePath(
						passedMovieData
							? passedMovieData.poster_path || passedMovieData.backdrop_path
							: movieDetail
							? movieDetail.poster_path || movieDetail.backdrop_path
							: ""
					)}
					alt={`${
						passedMovieData
							? passedMovieData.title
							: movieDetail
							? movieDetail.title
							: ""
					} 포스터`}
				/>
				<BigTitle>
					{passedMovieData
						? passedMovieData.title
						: movieDetail
						? movieDetail.title
						: ""}
				</BigTitle>
				{isMovieDetailLoading || !movieDetail ? (
					<Loader>로딩 중...</Loader>
				) : (
					<>
						{movieDetail.tagline ? (
							<SmallTitle>{movieDetail.tagline}</SmallTitle>
						) : null}
						<Genres>
							{movieDetail.genres &&
								movieDetail.genres.map((genre) => (
									<Genre key={genre.id}>{genre.name}</Genre>
								))}
						</Genres>
					</>
				)}
				{passedMovieData && passedMovieData.vote_count > 0 && (
					<Rating>
						<div>
							<Stars>
								<div style={{ width: `${passedMovieData.vote_average * 10}%` }}>
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
								</div>
								<div>
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
									<StarRateRoundedIcon />
								</div>
							</Stars>
							{passedMovieData.vote_average.toFixed(1)}
						</div>
						<div>
							{Number(passedMovieData.vote_count).toLocaleString()}명이 투표함
						</div>
					</Rating>
				)}
				<DetailOverview>
					{passedMovieData
						? passedMovieData.overview
						: movieDetail
						? movieDetail.overview.trim()
							? movieDetail.overview.trim()
							: "이 영화에는 소개가 등록되지 않았습니다."
						: "이 영화에는 소개가 등록되지 않았습니다."}
				</DetailOverview>
				{!isMovieCreditsLoading && movieCredits && (
					<>
						{movieCredits.cast.slice(0, 16).length !== 0 && (
							<>
								<SectionTitle>
									<h3>출연진</h3>
									<h3>총 {movieCredits.cast.length}명</h3>
								</SectionTitle>
								<HorizontalScroll>
									{movieCredits.cast.slice(0, 16).map((cast, index) => (
										<Person
											key={index}
											id={cast.id}
											name={cast.name}
											role={cast.character}
										/>
									))}
								</HorizontalScroll>
							</>
						)}
						{movieCredits.crew.slice(0, 16).length !== 0 && (
							<>
								<SectionTitle>
									<h3>제작진</h3>
									<h3>총 {movieCredits.crew.length}명</h3>
								</SectionTitle>
								<HorizontalScroll>
									{movieCredits.crew.slice(0, 16).map((crew, index) => (
										<Person
											key={index}
											id={crew.id}
											name={crew.name}
											role={crew.known_for_department}
										/>
									))}
								</HorizontalScroll>
							</>
						)}
					</>
				)}
				{!isSimilarMoviesLoading &&
					similarMovies &&
					similarMovies.results.length > 0 && (
						<>
							<SectionTitle>
								<h3>비슷한 영화</h3>
								<h3>총 {similarMovies.results.length}편</h3>
							</SectionTitle>
							<HorizontalScroll>
								{similarMovies.results.map((movie, index) => (
									<Similar
										key={index}
										type="movie"
										title={movie.title}
										id={movie.id}
										backdropPath={movie.backdrop_path || movie.poster_path}
										from={from}
									/>
								))}
							</HorizontalScroll>
						</>
					)}
			</DetailContainer>
		</Wrapper>
	);
}

export default MovieDetail;
