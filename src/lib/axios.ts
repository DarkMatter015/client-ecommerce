import axios from "axios";

// BACK-END API
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use(
	function (config) {
		const token = localStorage.getItem("token");

		if (token) {
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error(`Erro na requisição ${error.config.url}:`, error);
		return Promise.reject(error);
	}
);

// CHAT AI SERVICE
export const apiChat = axios.create({
	baseURL: import.meta.env.VITE_API_CHAT_URL || "http://localhost:8000",
});

apiChat.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		config.headers.Authorization = token ? `Bearer ${token}` : "Bearer 123";

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

apiChat.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error(`Erro na requisição ${error.config.url}:`, error);
		return Promise.reject(error);
	}
);
