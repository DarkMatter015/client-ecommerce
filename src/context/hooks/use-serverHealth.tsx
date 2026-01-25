import { useContext } from "react";
import { ServerHealthContext } from "../ServerHealthContext";

export const useServerHealth = () => {
  const context = useContext(ServerHealthContext);
  if (!context) {
    throw new Error('useServerHealth deve ser usado dentro de um ServerHealthProvider');
  }
  return context;
};