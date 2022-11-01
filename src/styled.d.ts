import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		red: string;
		gold: string;
		black: {
			darkest: string;
			darker: string;
			dark: string;
			light: string;
		};
		white: {
			light: string;
			dark: string;
			darker: string;
			darkest: string;
		};
	}
}
