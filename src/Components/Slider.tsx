import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getImagePath, IMovie, IShow, isMovie } from "../api";
import {
	clickedMovieState,
	clickedShowState,
	clickedSliderState,
} from "../atoms";
import { useSetRecoilState } from "recoil";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const MARGIN_BETWEEN_POSTERS = 1;
const NUMBER_OF_POSTERS = 5;

const Wrapper = styled.div`
	position: relative;
	display: flex;
`;

const Title = styled.h3`
	font-size: 1.6rem;
	font-weight: 700;
	padding: 0 8vw;
	margin-bottom: 1rem;
	color: white;
	top: 0rem;
`;

const Buttons = styled.div`
	width: 100%;
	padding: 0 2.75vw;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: absolute;
	top: calc(4rem + 1vw);
`;

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${(props) => props.theme.black.dark};
	background-color: ${(props) => props.theme.white.light};
	border: none;
	border-radius: 50%;
	width: 2.5vw;
	height: 2.5vw;
	opacity: 0.5;
	transition: opacity 0.3s;

	&:hover {
		opacity: 1;
	}

	& > svg {
		width: 1.5vw;
		height: 1.5vw;
	}
`;

const Row = styled(motion.div)`
	position: absolute;
	display: grid;
	width: 100%;
	grid-template-columns: repeat(${NUMBER_OF_POSTERS}, 1fr);
	gap: ${MARGIN_BETWEEN_POSTERS}rem;
	padding-inline: 8vw;
	top: 3rem;
	pointer-events: none;

	& > * {
		pointer-events: auto;
	}
`;

const Box = styled(motion.div)`
	aspect-ratio: 16 / 9;
	overflow: hidden;
	border-radius: 0.75rem;
	box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
	cursor: pointer;
	position: relative;

	& > img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}

	& > h3 {
		background-color: ${(props) => props.theme.black.darkest};
		display: flex;
		justify-content: center;
		align-items: center;
	}

	&:first-child {
		transform-origin: center left;
	}

	&:last-child {
		transform-origin: center right;
	}
`;

const Info = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: flex-end;
	position: absolute;
	padding: 1rem;
	background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
	border-radius: 0 0 0.75rem 0.75rem;
	height: 100%;
	aspect-ratio: 16 / 9;
	bottom: 0;
	opacity: 0;

	h4 {
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.25;
		text-align: center;
		word-break: keep-all;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
`;

const rowVariants = {
	hidden: (custom: boolean) => ({
		x: custom
			? -window.innerWidth + MARGIN_BETWEEN_POSTERS * 16
			: window.innerWidth + MARGIN_BETWEEN_POSTERS * 16,
	}),
	visible: { x: 0 },
	exit: (custom: boolean) => ({
		x: custom
			? window.innerWidth - MARGIN_BETWEEN_POSTERS * 16
			: -window.innerWidth - MARGIN_BETWEEN_POSTERS * 16,
	}),
};

const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.2,
		y: -16,
		boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",
		transition: {
			type: "tween",
			duration: 0.5,
			delay: 0.25,
		},
	},
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			type: "tween",
			duration: 0.5,
			delay: 0.25,
		},
	},
};

interface ISliderProps {
	title: string;
	sliderId: string;
	contents: IMovie[] | IShow[];
}

function Slider({ title, sliderId, contents }: ISliderProps) {
	const navigate = useNavigate();

	const [leaving, setLeaving] = useState(false);
	const [index, setIndex] = useState(0);
	const [goingBack, setGoingBack] = useState(false);

	const setClickedSlider = useSetRecoilState(clickedSliderState);
	const setClickedMovie = useSetRecoilState(clickedMovieState);
	const setClickedShow = useSetRecoilState(clickedShowState);

	contents = contents.sort((a, b) => b.vote_average - a.vote_average);

	const toggleLeaving = () => setLeaving((prev) => !prev);
	const increaseIndex = () => {
		if (contents) {
			if (leaving) return;
			toggleLeaving();
			setGoingBack(false);
			const maxIndex = Math.floor(contents.length / NUMBER_OF_POSTERS) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
		}
	};

	const decreaseIndex = () => {
		if (contents) {
			if (leaving) return;
			toggleLeaving();
			setGoingBack(true);
			const maxIndex = Math.floor(contents.length / NUMBER_OF_POSTERS) - 1;
			setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
		}
	};

	const onBoxClick = (contentData: IMovie | IShow, movieId: number) => {
		setClickedSlider(sliderId);

		if (isMovie(contentData)) {
			setClickedMovie(contentData);
			navigate(`/movie/${movieId}`);
		} else {
			setClickedShow(contentData);
			navigate(`/show/${movieId}`);
		}
	};

	return (
		<Wrapper>
			{contents && (
				<>
					<Title>{title}</Title>
					<AnimatePresence
						custom={goingBack}
						initial={false}
						onExitComplete={toggleLeaving}
					>
						<Buttons>
							<Button onClick={decreaseIndex}>
								<ArrowBackIosRoundedIcon />
							</Button>
							<Button onClick={increaseIndex}>
								<ArrowForwardIosRoundedIcon />
							</Button>
						</Buttons>
						<Row
							key={index}
							custom={goingBack}
							variants={rowVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							transition={{ type: "tween", duration: 0.5 }}
						>
							{contents
								.slice(
									NUMBER_OF_POSTERS * index,
									NUMBER_OF_POSTERS * (index + 1)
								)
								.map((content) => (
									<Box
										onClick={() => onBoxClick(content, content.id)}
										key={content.id}
										layoutId={"slider_" + sliderId + "_backdrop_" + content.id}
										variants={boxVariants}
										initial="normal"
										whileHover="hover"
										transition={{
											type: "tween",
											duration: 0.5,
										}}
									>
										{content.backdrop_path || content.poster_path ? (
											<img
												src={getImagePath(
													content.backdrop_path || content.poster_path
												)}
												alt={`${
													isMovie(content) ? content.title : content.name
												} 장면 이미지`}
											/>
										) : (
											<h3>이미지 없음</h3>
										)}
										<Info variants={infoVariants}>
											<h4>{isMovie(content) ? content.title : content.name}</h4>
										</Info>
									</Box>
								))}
						</Row>
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}

export default Slider;
