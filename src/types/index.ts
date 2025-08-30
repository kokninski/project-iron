// Global type definitions for Project Iron

// SEO Props interface - used across the application
export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogImageAlt?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

// Layout Props interfaces
export interface BaseLayoutProps {
  seo?: SEOProps;
  bodyClass?: string;
}

// Site configuration
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: string;
  locale: string;
  ogImage: string;
}

// Common component props
export interface ComponentProps {
  class?: string;
  id?: string;
}

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'warn';

// Chip variants
export type ChipVariant = 'default' | 'success' | 'warn' | 'danger' | 'accent';

// Card variants
export type CardVariant = 'default' | 'dark' | 'accent' | 'success' | 'warn' | 'danger' | 'hover';

// Theme colors from Tailwind config
export type ThemeColor = 'charcoal' | 'steel' | 'accent' | 'offwhite' | 'success' | 'warn' | 'danger';

// Responsive breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Font families
export type FontFamily = 'inter' | 'oswald' | 'sans' | 'display';

// Animation types
export type AnimationType = 'fade-in' | 'slide-up' | 'scale' | 'none';

// Navigation item structure
export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

// Form field types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// API Response generic
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
