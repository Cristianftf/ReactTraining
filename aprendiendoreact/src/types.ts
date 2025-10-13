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
  role: 'admin' | 'user' | 'guest';
}
export type UserDto=Omit<User,'id'|'role'>;

export interface LoginCredentials{
  email:string;
  password:string;
}