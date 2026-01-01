export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: object;
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface IUserRegister {
  email: string;
  displayName: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Interfaces para os dados de autenticação
export interface IAuthorities {
  authority: string;
}

export interface IAuthenticatedUser {
  id: number;
  email: string;
  displayName: string;
  authorities: IAuthorities[];
}

export interface IUser {
  id?: number;
  displayName?: string | null;
  password?: string | null;
}

export interface IUserUpdate {
  id?: number;
  displayName?: string | null;
  email?: string | null;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAuthenticationResponse {
  token: string;
  user: IAuthenticatedUser;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IPayment {
  id: number;
  name: string;
}

export interface IAddress {
  id?: number;
  street?: string;
  number?: string | undefined;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep: string;
  active?: boolean;
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  urlImage: string;
  quantityAvailableInStock: number;
  category: ICategory;
}

export interface IItem {
  id?: number;
  product: IProduct;
  totalPrice?: number;
  quantity: number;
}

export class Item implements IItem {
  id?: number;
  product: IProduct;
  quantity: number;
  totalPrice?: number;

  constructor(product: IProduct, quantity: number, id?: number) {
    this.product = product;
    this.quantity = quantity;
    this.id = id;
    this.totalPrice = product.price * quantity;
  }
}

export interface IOrderRequest {
  id?: number;
  paymentId: number;
  address: IAddress;
  orderItems: IItem[];
  shipment: IFreightResponse;
}
export interface IOrderResponse {
  id: number;
  payment: IPayment;
  address: IAddress;
  orderItems: IItem[];
  shipment: IFreightResponse;
  status: string;
}


export interface IFreightRequest {
  to: {
    postal_code: string;
  };
  products: {
    id?: number;
    width?: number;
    height?: number;
    length?: number;
    insurance_value?: number;
    quantity?: number;
  }[];
}

export interface IFreightResponse {
    id: number;
    name: string;
    picture: string;
    price: number;
    currency: string;
    delivery_time: number;
    discount: number;
    company: {
        id: number;
        name: string;
        picture: string
    };
}

export interface IAlertRequest {
    email: string;
    productId: number;
}

export interface IAlertResponse {
    id: number;
    email: string;
    productId: number;
    productName: string;
    requestDate: string;
    processedAt: string;
    status: string;
}