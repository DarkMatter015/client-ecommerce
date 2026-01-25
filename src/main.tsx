import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App.tsx";

import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; //flex utilities
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { ServerHealthProvider } from "./context/ServerHealthContext";

import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<PrimeReactProvider>
				<ServerHealthProvider>
					<AuthProvider>
						<ToastProvider>
							<CartProvider>
								<App />
							</CartProvider>
						</ToastProvider>
					</AuthProvider>
				</ServerHealthProvider>
			</PrimeReactProvider>
		</BrowserRouter>
	</StrictMode>,
);
