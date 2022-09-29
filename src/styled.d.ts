import "styled-components";

declare module "styled-components" {
	export interface DefaulTheme {
		red: string;
		black: {
			darker: string;
			dark: string;
			light: string;
		};
		white: {
			dark: string;
			light: string;
		};
	}
}
