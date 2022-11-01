import { useQuery } from "react-query";
import styled from "styled-components";
import { getImagePath, getPersonImages, IPersonImages } from "../api";

const Wrapper = styled.div`
	width: 5rem;
	background-color: ${(props) => props.theme.black.dark};
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: column;

	& > img,
	& > div:first-child {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 50%;
		background-color: ${(props) => props.theme.black.darkest};
		color: ${(props) => props.theme.white.darker};
		word-break: keep-all;
		text-align: center;
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
	}

	& > h4 {
		width: 5rem;
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
	}

	& > :last-child {
		color: ${(props) => props.theme.white.darkest};
		margin-top: 0.2rem;
	}
`;

interface IPersonProps {
	id: number;
	name: string;
	role: string;
}

function Person({ id, name, role }: IPersonProps) {
	const { data: images, isLoading: isImagesLoading } = useQuery<IPersonImages>(
		["images", id],
		() => getPersonImages(id)
	);

	return (
		<Wrapper>
			{!isImagesLoading && images && images.profiles && images.profiles[0] ? (
				<img
					src={getImagePath(images.profiles[0].file_path)}
					alt={`${name}의 프로필 사진`}
				/>
			) : (
				<div>이미지 없음</div>
			)}
			<h4>{name}</h4>
			<h4>{role}</h4>
		</Wrapper>
	);
}

export default Person;
