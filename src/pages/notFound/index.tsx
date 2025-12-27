import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./not-found.style.css";

export const NotFoundPage = () => {
	const [timer, setTimer] = useState<number>(5);
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prevTimer) => {
				if (prevTimer <= 1) {
					clearInterval(interval);
					return 0;
				}
				return prevTimer - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (timer === 0) {
			navigate("/", { replace: true });
		}
	}, [timer, navigate]);

	return (
		<div className="not-found-container">
			<h1> 404 - Página não encontrada</h1>
			<p>
				Voltando para página inicial em {timer} segundos ...{" "}
				<i className="pi pi-spin pi-spinner"></i>
			</p>
			<img
				src="./assets/images/common/not_found.svg"
				alt="Página não encontrada"
			/>
		</div>
	);
};
