// src/types.ts

export interface FooterLink {
  name: string;
  url: string;
  external?: boolean; // Para enlaces externos
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface User{
  id: number;
  name: string;
  email: string;
  password: string;
  rol: 'admin' | 'user' ;
}
export type UserDto = Omit<User, 'id'>;

export interface LoginCredentials{
  email:string;
  password:string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'admin' | 'user';
}