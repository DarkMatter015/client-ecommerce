import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type {
	IAuthenticatedUser,
	IAuthenticationResponse,
} from "@/commons/types/types";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/services/auth.service";

interface AuthContextType {
	authenticated: boolean;
	authenticatedUser?: IAuthenticatedUser;
	handleLogin: (
		authenticationResponse: IAuthenticationResponse
	) => Promise<any>;
	handleLogout: () => void;
	setAuthenticatedUser: (user: IAuthenticatedUser) => void;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [authenticated, setAuthenticated] = useState(false);
	const [authenticatedUser, setAuthenticatedUser] = useState<
		IAuthenticatedUser | undefined
	>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const validateUserSession = async () => {
			try {
				const storedUser = localStorage.getItem("user");
				const storedToken = localStorage.getItem("token");

				if (!storedToken) {
					setAuthenticated(false);
					setAuthenticatedUser(undefined);
					setLoading(false);
					return;
				}

				const response = await validateToken(storedToken);

				if (response && storedUser) {
					const parsedUser = JSON.parse(storedUser);
					setAuthenticatedUser(parsedUser);
					setAuthenticated(true);
				}
			} catch (err) {
				// falha de rede ou erro inesperado: deixar não autenticado, mas não navegar
				console.error("Erro validando sessão:", err);
				setAuthenticated(false);
				setAuthenticatedUser(undefined);
			} finally {
				setLoading(false);
			}
		};

		validateUserSession();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("cartItems");
		delete api.defaults.headers.common["Authorization"];

		setAuthenticated(false);
		setAuthenticatedUser(undefined);

		navigate("/", { replace: true });
	};

	const handleLogin = async (
		authenticationResponse: IAuthenticationResponse
	) => {
		try {
			const { token, user } = authenticationResponse;
			localStorage.setItem("token", token);

			localStorage.setItem("user", JSON.stringify(user));

			setAuthenticatedUser(user);
			setAuthenticated(true);
		} catch (err) {
			console.log("Erro no login: ", err);
			handleLogout();
		}
	};

	const handleSetAuthenticatedUser = (user: IAuthenticatedUser) => {
		setAuthenticatedUser(user);
		localStorage.setItem("user", JSON.stringify(user));
	};

	if (loading) {
		return <div>Validando sessão ...</div>;
	}

	return (
		<AuthContext.Provider
			value={{
				authenticated,
				authenticatedUser,
				handleLogin,
				handleLogout,
				setAuthenticatedUser: handleSetAuthenticatedUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext };
