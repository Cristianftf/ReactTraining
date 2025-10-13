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