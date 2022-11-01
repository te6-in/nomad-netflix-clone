import {
	AnimatePresence,
	motion,
	useScroll,
	useTransform,
} from "framer-motion";
import { useQuery } from "react-query";
import {
	getImagePath,
	getNowplayingShows,
	INowplayingShowsResult,
	getGenreShows,
	IDefaultShowsResult,
	getTopratedShows,
	getPopularShows,
} from "../api";
import { useMatch, useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import Slider from "../Components/Slider";
import { useEffect, useState } from "react";
import { clickedShowState, clickedSliderState } from "../atoms";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ShowDetail from "../Components/ShowDetail";

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	background-color: black;
`;

const Banner = styled(motion.div)<{ bgpath: string }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-inline: 8vw;
	gap: 1.5rem;
	background-image: linear-gradient(
			rgba(0, 0, 0, 0.75),
			rgba(0, 0, 0, 0.25),
			rgba(0, 0, 0, 0.75),
			rgba(0, 0, 0, 1)
		),
		url(${(props) => props.bgpath});
	background-size: cover;
	background-position: center;
	pointer-events: none;

	& > * {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		text-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
		pointer-events: auto;
	}
`;

const Sliders = styled.div`
	margin-top: 90vh;
	left: 0;
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: clamp(8.25rem, 17.6vw, 22rem);
`;

const Title = styled(motion.h2)`
	font-size: 4rem;
	-webkit-line-clamp: 1;
	font-weight: 100;
	width: 55vw;
`;

const Overview = styled(motion.p)`
	font-size: 1.25rem;
	line-height: 1.5;
	-webkit-line-clamp: 4;
	width: 40vw;
	word-break: keep-all;
	opacity: 0.85;
`;

const Button = styled(motion.button)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1rem;
	font-size: 1.25rem;
	font-weight: 400;
	width: fit-content;
	border-radius: 0.75rem;
	gap: 0.5rem;
	border: 0.2rem solid ${(props) => props.theme.white.light};
	background-color: transparent;
	color: ${(props) => props.theme.white.light};
	box-shadow: 0 0.15rem 0.3rem rgba(0, 0, 0, 0.15);
	transition: background-color 0.3s, color 0.3s;
	cursor: pointer;
	margin-top: 1rem;
	user-select: none;

	&:hover {
		background-color: ${(props) => props.theme.white.light};
		color: ${(props) => props.theme.black.dark};
	}
`;

const GoToTop = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1rem;
	margin: calc(clamp(8.25rem, 17.6vw, 22rem) + 5rem) auto
		clamp(8.25rem, 17.6vw, 22rem) auto;
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

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.65);
	opacity: 0;
`;

function Tv() {
	const navigate = useNavigate();
	const tvMatch = useMatch("/show/:showId");
	const showId = tvMatch
		? tvMatch.params.showId
			? parseInt(tvMatch.params.showId)
			: 0
		: 0;

	const { scrollY } = useScroll();
	const bgOpacity = useTransform(scrollY, [0, 360], [1, 0.25]);
	const titleOpacity = useTransform(scrollY, [0, 360], [1, 0]);
	const overviewOpacity = useTransform(scrollY, [0, 360], [0.85, 0]);

	const [clickedSlider, setClickedSlider] = useRecoilState(clickedSliderState);
	const [clickedShow, setClickedShow] = useRecoilState(clickedShowState);
	const [isScrolledEnough, setIsScrolledEnough] = useState(false);

	useEffect(() => {
		tvMatch
			? (document.body.style.overflowY = "hidden")
			: (document.body.style.overflowY = "auto");
	}, [tvMatch]);

	useEffect(() => {
		return scrollY.onChange((y) => {
			if (y > 360) {
				setIsScrolledEnough(true);
			} else {
				setIsScrolledEnough(false);
			}
		});
	});

	const { data: nowplayingData, isLoading: isNowplayingLoading } =
		useQuery<INowplayingShowsResult>(
			["shows", "now-playing"],
			getNowplayingShows
		);

	const { data: popularData, isLoading: isPopularLoading } =
		useQuery<IDefaultShowsResult>(["shows", "trending"], getPopularShows);

	const { data: topratedData, isLoading: isTopratedLoading } =
		useQuery<IDefaultShowsResult>(["shows", "top-rated"], getTopratedShows);

	const { data: criminalData, isLoading: isCriminalLoading } =
		useQuery<IDefaultShowsResult>(["shows", "criminial"], () =>
			getGenreShows(80)
		);

	const { data: familyData, isLoading: isFamilyLoading } =
		useQuery<IDefaultShowsResult>(["shows", "family"], () =>
			getGenreShows(10751)
		);

	const onBannerClick = () => {
		if (nowplayingData) {
			setClickedSlider("banner");
			setClickedShow(nowplayingData.results[0]);
			navigate(`/show/${nowplayingData.results[0].id}`);
		}
	};

	const onOverlayClick = () => {
		navigate("/show");
	};

	const onScrollToTopClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return isNowplayingLoading ||
		isPopularLoading ||
		isTopratedLoading ||
		isCriminalLoading ||
		isFamilyLoading ? (
		<Loader style={{ marginTop: "45vh" }}>로딩 중...</Loader>
	) : (
		<Wrapper>
			<>
				<Banner
					bgpath={getImagePath(
						nowplayingData?.results[0].backdrop_path ||
							nowplayingData?.results[0].poster_path ||
							""
					)}
					style={{ opacity: bgOpacity }}
				>
					<Title style={{ opacity: titleOpacity }}>
						{nowplayingData?.results[0].name}
					</Title>
					<Overview style={{ opacity: overviewOpacity }}>
						{nowplayingData?.results[0].overview}
					</Overview>
					<Button
						onClick={onBannerClick}
						style={{
							opacity: titleOpacity,
							display: isScrolledEnough ? "none" : "flex",
						}}
					>
						더 알아보기
						<ArrowForwardRoundedIcon />
					</Button>
				</Banner>
				<Sliders>
					<Slider
						title="지금 방영 중인 프로그램"
						sliderId="now-playing"
						contents={nowplayingData ? nowplayingData.results.slice(1) : []}
					/>
					<Slider
						title="지금 인기 있는 프로그램"
						sliderId="popular-today"
						contents={popularData ? popularData.results : []}
					/>
					<Slider
						title="평가가 좋은 프로그램"
						sliderId="top-rated"
						contents={topratedData ? topratedData.results : []}
					/>
					<Slider
						title="범죄 드라마"
						sliderId="genre-action"
						contents={criminalData ? criminalData.results : []}
					/>
					<Slider
						title="가족 프로그램"
						sliderId="genre-comedy"
						contents={familyData ? familyData.results : []}
					/>
				</Sliders>
				<AnimatePresence>
					{tvMatch && (
						<>
							<Overlay
								onClick={onOverlayClick}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							/>
							<ShowDetail
								sliderId={clickedSlider}
								showId={showId}
								passedShowData={clickedShow!}
							/>
						</>
					)}
				</AnimatePresence>
				<GoToTop onClick={onScrollToTopClick}>
					맨 위로 올라가기
					<ArrowUpwardRoundedIcon />
				</GoToTop>
			</>
		</Wrapper>
	);
}

export default Tv;
