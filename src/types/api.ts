// User Types
export interface User {
  id: string;
  email: string;
  email_confirmed: boolean;
  last_sign_in: string;
  created_at: string;
  full_name: string;
  avatar_url: string;
  country: string;
  country_code: string;
  currency: string;
  timezone: string;
  language: string;
  role: string;
  credit_balance: number;
  lemonsqueezy_customer_id: string | null;
  updated_at: string;
  phone?: string;
}

// Auth Types
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface OtpVerificationPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

// Credit Types
export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  source: string;
  balance_after: number;
  created_at: string;
}

export interface CreditTransactionResponse {
  transactions: CreditTransaction[];
  pagination: Pagination;
}

// Image Generation Types
export interface GenerationModel {
  id: string;
  name: string;
}

export interface Resolution {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface GenerationType {
  id: string;
  name: string;
  description: string;
  defaultResolution: string;
}

export interface GenerationOptions {
  models: GenerationModel[];
  resolutions: Resolution[];
  generationTypes: GenerationType[];
}

export interface GenerateImagePayload {
  prompt: string;
  negativePrompt?: string;
  generationType: string;
  modelId: string;
  resolution: string;
  aspectRatio?: string;
  cfgScale?: number;
  steps?: number;
  style?: string | null;
  numberOfImages?: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  original_prompt: string;
  negative_prompt?: string;
  generation_type: string;
  model_id: string;
  resolution: string;
  width: number;
  height: number;
  cloudinary_url: string;
  credit_cost: number;
  created_at: string;
  style?: string;
  seed?: number;
  cfg_scale?: number;
  steps?: number;
  finish_reason?: string;
  cloudinary_public_id?: string;
}

export interface GeneratedImageResponse {
  images: GeneratedImage[];
  creditCost: number;
}

export interface UserImagesResponse {
  images: GeneratedImage[];
  pagination: Pagination;
}



// Poster Types
export interface AspectRatio {
  id: string;
  name: string;
  width?: number;
  height?: number;
}

export interface PosterGenerationPayload {
  title: string;
  slogan?: string;
  additionalText?: string;
  websiteUrl?: string;
  posterType: string;
  stylePreference: string;
  colorPalette?: string[];
  aspectRatio: string;
  customDimensions?: {
    width: number;
    height: number;
  };
  logo?: File;
  productImage?: File;
}

export interface Poster {
  id: string;
  title: string;
  slogan?: string;
  additional_text?: string;
  website_url?: string;
  poster_type: string;
  style_preference: string;
  color_palette?: string[];
  aspect_ratio: string;
  image_url: string;
  width: number;
  height: number;
  credit_cost: number;
  created_at: string;
}

export interface PostersResponse {
  success: boolean;
  message: string;
  data: {
    posters: Poster[];
    pagination: Pagination;
  };
}

export interface PosterResponse {
  success: boolean;
  message: string;
  data: Poster;
}

// Common Types
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
    details: any;
  };
} 