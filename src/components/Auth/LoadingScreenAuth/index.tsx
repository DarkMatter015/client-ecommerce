import './loading-screen-auth.style.css';

interface LoadingScreenAuthProps {
  message?: string;
}

export const LoadingScreenAuth = ({ message = "Validando sessão..." }: LoadingScreenAuthProps) => {
  return (
    <div className="auth-loading-overlay" role="alert" aria-busy="true">
      <div className="auth-loading-content">
        <div className="auth-spinner"></div>
        <p className="auth-loading-text">{message}</p>
      </div>
    </div>
  );
};