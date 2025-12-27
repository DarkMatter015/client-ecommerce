import { Link } from "react-router-dom";

interface AuthHeaderProps {
	title: string;
	subtitle?: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
	return (
		<header className="text-center">
			<Link to="/" aria-label="Ir para página inicial">
				<img
					src="/assets/images/logo/logo_riffhouse_red.png"
					alt="Logo Riff House"
					className="w-12rem"
				/>
			</Link>
			<h1 className="text-900 text-5xl font-medium mb-3 mt-0">{title}</h1>
			{subtitle && (
				<p className="text-600 font-medium line-height-3">{subtitle}</p>
			)}
		</header>
	);
};
