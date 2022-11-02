import styled from "styled-components";
import { useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { motion, MotionValue, useAnimation } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useForm } from "react-hook-form";

const Navigation = styled(motion.nav)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: fixed;
	width: 100%;
	height: 5rem;
	top: 0;
	left: 0;
	color: ${(props) => props.theme.white.light};
	z-index: 1;

	& > *:first-child {
		margin-left: 8vw;
	}
	& > *:last-child {
		margin-right: 8vw;
	}
`;

const Column = styled.div`
	display: flex;
	align-items: center;
	gap: 3rem;
`;

const Logo = styled(motion.svg)`
	width: 8rem;
	margin-top: 0.5rem;
	fill: ${(props) => props.theme.red};
`;

const Item = styled.li`
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	color: ${(props) => props.theme.white.light};
	transition: color 0.3s;
`;

const Indicator = styled(motion.span)`
	position: absolute;
	width: 1rem;
	height: 0.2rem;
	border-radius: 0.1rem;
	bottom: -0.75rem;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-color: ${(props) => props.theme.white.light};
`;

const Items = styled.ul`
	display: flex;
	align-items: center;
	gap: 1.5rem;

	${Item}:hover {
		color: ${(props) => props.theme.white.dark};
		${Indicator} {
			background-color: ${(props) => props.theme.white.dark};
		}
	}
`;

const Search = styled.form`
	display: flex;
	align-items: center;
	position: relative;
	cursor: pointer;
`;

const Input = styled(motion.input)`
	transform-origin: right center;
	position: absolute;
	right: 0px;
	width: 14rem;
	padding: 0.6rem 0.6rem 0.6rem 2.2rem;
	z-index: -1;
	border: none;
	border-radius: 0.5rem;
	box-shadow: 0 0.1rem 0.3rem rgba(0, 0, 0, 0.2);
`;

const SearchIcon = motion(SearchRoundedIcon);

interface ISearchForm {
	keyword: string;
}

function Header({
	headerBackground,
}: {
	headerBackground: MotionValue<string>;
}) {
	const homeMatch = useMatch("/");
	const tvMatch = useMatch("/show");

	const navigate = useNavigate();

	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const inputAnimation = useAnimation();

	const { register, handleSubmit, setFocus } = useForm<ISearchForm>();
	const onValid = (data: ISearchForm) => {
		navigate(`/search?keyword=${data.keyword}`);
		toggleSearch();
	};

	const toggleSearch = () => {
		if (isSearchOpen) {
			inputAnimation.start({ scaleX: 0, scaleY: 0 });
		} else {
			inputAnimation.start({ scaleX: 1, scaleY: 1 });
			setFocus("keyword");
		}

		setIsSearchOpen((prev) => !prev);
	};

	return (
		<Navigation initial="top" style={{ background: headerBackground }}>
			<Column>
				<Link to="/">
					<Logo xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 276.742">
						<motion.path
							d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
							fill="#d81f26"
						/>
					</Logo>
				</Link>
				<Items>
					<Item>
						<Link to="/">
							홈{homeMatch && <Indicator layoutId="indicator" />}
						</Link>
					</Item>
					<Link to="show">
						<Item>
							TV 프로그램{tvMatch && <Indicator layoutId="indicator" />}
						</Item>
					</Link>
				</Items>
			</Column>
			<Search onSubmit={handleSubmit(onValid)}>
				<SearchIcon
					onClick={toggleSearch}
					animate={{
						x: isSearchOpen ? "-12rem" : 0,
						fill: isSearchOpen ? "#000000" : "#ffffff",
					}}
					transition={{ type: "tween" }}
				/>
				<Input
					{...register("keyword", { required: true, minLength: 2 })}
					onKeyDown={(event) => {
						event.key === "Escape" && toggleSearch();
					}}
					placeholder="영화나 TV 쇼를 검색해보세요..."
					initial={{ scaleX: 0 }}
					animate={inputAnimation}
					transition={{ type: "tween" }}
				/>
			</Search>
		</Navigation>
	);
}

export default Header;
