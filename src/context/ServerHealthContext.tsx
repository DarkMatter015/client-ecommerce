import { healthCheck } from "@/services/health.service";
import React, { createContext, useEffect, useState, useCallback } from "react";

export type ServerStatus =
	| "idle"
	| "checking"
	| "waking_up"
	| "online"
	| "offline";

interface ServerHealthContextData {
	status: ServerStatus;
	runHealthCheck: () => Promise<void>;
}

const ServerHealthContext = createContext<ServerHealthContextData>(
	{} as ServerHealthContextData,
);

const COLD_START_THRESHOLD = 1500;

export const ServerHealthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [status, setStatus] = useState<ServerStatus>("idle");

	const runHealthCheck = useCallback(async () => {
		setStatus("checking");

		const slowResponseTimer = setTimeout(() => {
			setStatus((prev) => (prev === "checking" ? "waking_up" : prev));
		}, COLD_START_THRESHOLD);

		try {
			await healthCheck();
			setStatus("online");
		} catch (error) {
			console.error("Health Check Failed:", error);
			setStatus("offline");
		} finally {
			clearTimeout(slowResponseTimer);
		}
	}, []);

	useEffect(() => {
		runHealthCheck();
	}, [runHealthCheck]);

	return (
		<ServerHealthContext value={{ status, runHealthCheck }}>
			{children}
		</ServerHealthContext>
	);
};

export { ServerHealthContext };
