import type {
  IResponse,
  IUserLogin,
  IUserRegister,
  IUser,
  IChangePassword,
  IForgotPassword,
  IResetPassword,
} from "@/commons/types/types";
import { api } from "@/lib/axios";

const route = "/auth";

/**
 * Função para realizar uma requisição HTTP para API para cadastrar um novo usuário
 * @param user - Dados do usuário que será cadastrado do tipo IUserRegister
 * @returns - Retorna a resposta da API
 */
const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/users", user);
    response = {
      status: data.status,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Usuário não pode ser cadastrado",
      data: err.response.data,
    };
  }
  return response;
};

/**
 * Função para realizar a autenticação do usuário
 * @param user - Dados do usuário que será autenticado do tipo IUserLogin (username e password)
 * @returns - Retorna a resposta da API
 * Além disso salva o token no localStorage e adiciona o token no cabeçalho da requisição
 */
const login = async (user: IUserLogin) => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${route}/login`, user);
    response = {
      status: data.status,
      success: true,
      message: "Login bem-sucedido",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Usuário ou senha inválidos",
      data: err.response.data,
    };
  }
  return response;
};

const validateToken = async (token: string | null): Promise<IResponse> => {
  if (!token) {
    return {
      status: 401,
      success: false,
      message: "Token ausente",
    };
  }

  try {
    const response = await api.get(`${route}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      status: response.status,
      success: true,
      message: "Token válido",
      data: response.data,
    };
  } catch (err: any) {
    const status = err?.response?.status ?? 500;
    const message =
      status === 401 ? "Token inválido ou expirado" : "Erro ao validar o token";

    return {
      status,
      success: false,
      message,
      data: err?.response?.data ?? null,
    };
  }
};

const updateProfile = async (user: IUser): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.patch(`/users/${user.id}`, {
      displayName: user.displayName ? user.displayName : null,
      password: user.password ? user.password : null,
    });
    response = {
      status: data.status,
      success: true,
      message: "Perfil atualizado com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 500,
      success: false,
      message: "Erro ao atualizar o perfil",
      data: err.response?.data,
    };
  }
  return response;
};

const changePassword = async (changePassword: IChangePassword ): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${route}/change-password`, changePassword);
    response = {
      status: data.status,
      success: true,
      message: "Senha alterada com sucesso",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 500,
      success: false,
      message: err.response?.data.message || "Erro ao alterar a senha",
      data: err.response?.data,
    };
  }
  return response;
};

const forgotPassword = async (forgotPassword: IForgotPassword): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${route}/forgot-password`, forgotPassword);
    response = {
      status: data.status,
      success: true,
      message: "Se o email existir, um email de redefinição de senha será enviado.",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 500,
      success: false,
      message: err.response?.data.message || "Erro ao enviar email. Tente novamente mais tarde.",
      data: err.response?.data,
    };
  }
  return response;
};

const validateResetToken = async (token: string): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${route}/validate-reset-token?token=${token}`);
    response = {
      status: data.status,
      success: true,
      message: response.message || "Token válido.",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 500,
      success: false,
      message: err.response?.data.message || "Token inválido.",
      data: err.response?.data,
    };
  }
  return response;
};

const resetPassword = async (resetPassword: IResetPassword): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(`${route}/reset-password`, resetPassword);
    response = {
      status: data.status,
      success: true,
      message: response.message || "Senha redefinida com sucesso. Faça login com sua nova senha.",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response?.status ?? 500,
      success: false,
      message: err.response?.data.message || "Erro ao redefinir a senha.",
      data: err.response?.data,
    };
  }
  return response;
};

const AuthService = {
  signup,
  login,
  validateToken,
  updateProfile,
  changePassword,
  forgotPassword,
  validateResetToken,
  resetPassword
};
export default AuthService;
