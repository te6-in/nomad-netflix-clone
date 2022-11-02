import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { getImagePath } from "../api";
import { clickedMovieState, clickedShowState } from "../atoms";

const Wrapper = styled.div`
	width: 9rem;
	background-color: ${(props) => props.theme.black.dark};
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: column;
	cursor: pointer;

	& > img {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 0.5rem;
		background-color: ${(props) => props.theme.black.darkest};
		color: ${(props) => props.theme.white.darker};
		word-break: keep-all;
		text-align: center;
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
		transition: box-shadow 0.3s;
	}

	&:hover > img {
		box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.3);
	}

	&:hover > h4 {
		color: ${(props) => props.theme.white.darker};
	}

	& > h4 {
		width: 9rem;
		font-size: 1rem;
		color: ${(props) => props.theme.white.dark};
		text-align: center;
		line-height: 1.25;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: keep-all;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		transition: color 0.3s;
	}
`;

interface ISimilarProps {
	type: "movie" | "show";
	title: string;
	id: number;
	backdropPath: string;
	from?: string;
}

function Similar({ type, title, id, backdropPath, from = "" }: ISimilarProps) {
	const navigate = useNavigate();

	const setClickedMovieState = useSetRecoilState(clickedMovieState);
	const setClickedShowState = useSetRecoilState(clickedShowState);

	const onClick = () => {
		setClickedMovieState(null);
		setClickedShowState(null);
		if (from.startsWith("search")) {
			navigate(`/${from}&type=${type}&id=${id}`);
		} else {
			navigate(`/${type}/${id}`);
		}
	};

	return (
		<Wrapper onClick={onClick}>
			<img src={getImagePath(backdropPath)} alt={`${title} 장면 이미지`} />
			<h4>{title}</h4>
		</Wrapper>
	);
}

export default Similar;
