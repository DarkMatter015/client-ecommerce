import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

export function RequireAuth() {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	return isAuthenticated ? (
		<>
			<Outlet />
		</>
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
}
