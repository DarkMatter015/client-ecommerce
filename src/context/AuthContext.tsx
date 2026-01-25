import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
	IAuthenticatedUser,
	IAuthenticationResponse,
} from "@/commons/types/types";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { validateToken } from "@/services/auth.service";
import { LoadingScreenAuth } from "@/components/Auth/LoadingScreenAuth";

interface AuthContextType {
	isAuthenticated: boolean;
	user?: IAuthenticatedUser;
	handleLogin: (
		authenticationResponse: IAuthenticationResponse,
	) => Promise<any>;
	handleLogout: () => void;
	updateUserProfile: (user: IAuthenticatedUser) => void;
}

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IAuthenticatedUser | undefined>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(() => {
		const token = localStorage.getItem("token");
		return !!token; // Se tem token, começa true (carregando validação). Se não tem, começa false.
	});

	const isAuthenticated = !!user;

	useEffect(() => {
		const initSession = async () => {
			const storedToken = localStorage.getItem("token");

			if (!storedToken) {
				setLoading(false);
				return;
			}

			try {
				const userResponse = await validateToken(storedToken);

				setUser(userResponse);

				localStorage.setItem("user", JSON.stringify(userResponse));
			} catch (error) {
				console.warn("Sessão inválida ou expirada:", error);
				handleLogout();
			} finally {
				setLoading(false);
			}
		};

		initSession();
	}, []);

	const handleLogin = async ({ token, user }: IAuthenticationResponse) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));

		setUser(user);
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		localStorage.removeItem("cartItems");

		delete api.defaults.headers.common["Authorization"];
		setUser(undefined);

		navigate("/", { replace: true });
	};

	const updateUserProfile = (newUser: IAuthenticatedUser) => {
		setUser(newUser);
		localStorage.setItem("user", JSON.stringify(newUser));
	};

	const contextValue = useMemo(
		() => ({
			isAuthenticated,
			user,
			loading,
			handleLogin,
			handleLogout,
			updateUserProfile,
		}),
		[user, loading, isAuthenticated],
	);

	if (loading) {
		return <LoadingScreenAuth />;
	}

	return <AuthContext value={contextValue}>{children}</AuthContext>;
};

export { AuthContext };
