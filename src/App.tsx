import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import { useScroll, useTransform } from "framer-motion";

function App() {
	const { scrollY } = useScroll();
	const headerBackground = useTransform(
		scrollY,
		[0, 360],
		[
			"linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0))",
			"linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
		]
	);

	return (
		<Router>
			<Header headerBackground={headerBackground} />
			<Routes>
				<Route path="/" element={<Home />}>
					<Route path="/movie/:movieId" element={<Home />} />
				</Route>
				<Route path="show" element={<Tv />}>
					<Route path="/show/:showId" element={<Tv />} />
				</Route>
				<Route path="search" element={<Search />}>
					<Route path="/search/movie/:id" element={<Search />} />
					<Route path="/search/show/:id" element={<Search />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
