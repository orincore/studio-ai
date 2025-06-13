// Credit costs by operation type and resolution
export const CREDIT_COSTS = {
  // Text-to-Image Generation: 10 credits
  TEXT_TO_IMAGE: 10,
  // Logo Generation: 25 credits
  LOGO: 25,
  // Poster Generation: 50 credits
  POSTER: 50,

  // Wallpaper Generation: 50 credits
  WALLPAPER: 50,
  // Image-to-Image Generation: 10 credits
  IMAGE_TO_IMAGE: 10
};

// Resolution dimensions
export const RESOLUTIONS = {
  NORMAL: { width: 512, height: 512 },
  HD: { width: 768, height: 768 },
  SQUARE: { width: 1024, height: 1024 },
  LANDSCAPE: { width: 1344, height: 768 },
  PORTRAIT: { width: 768, height: 1344 },
  WIDESCREEN: { width: 1024, height: 576 },
  WALLPAPER_HD: { width: 1920, height: 1080 },
  WALLPAPER_4K: { width: 3840, height: 2160 },
  MOBILE_WALLPAPER: { width: 1080, height: 1920 },
  POSTER_LANDSCAPE: { width: 1280, height: 720 },

  LOGO: { width: 1024, height: 1024 }, // Updated to match Stability AI requirements
  PRODUCT: { width: 1000, height: 1000 },
  // Additional Stability AI allowed dimensions
  SDXL_1152x896: { width: 1152, height: 896 },
  SDXL_1216x832: { width: 1216, height: 832 },
  SDXL_1344x768: { width: 1344, height: 768 },
  SDXL_1536x640: { width: 1536, height: 640 },
  SDXL_640x1536: { width: 640, height: 1536 },
  SDXL_768x1344: { width: 768, height: 1344 },
  SDXL_832x1216: { width: 832, height: 1216 },
  SDXL_896x1152: { width: 896, height: 1152 },
};

// Generation types from FR.md
export const GENERATION_TYPES = {
  // Text-to-Image Generator
  GENERAL: {
    id: 'GENERAL',
    name: '🎨 Text-to-Image Generator',
    description: 'Generate images from text descriptions',
    defaultResolution: 'SQUARE', // 1024x1024
    creditCost: 10
  },
  // AI Anime Generator
  ANIME: {
    id: 'ANIME',
    name: '🔥 AI Anime Generator',
    description: 'Anime style generations',
    defaultResolution: 'NORMAL', // 512x512
    creditCost: 10
  },
  // AI Realistic Generator
  REALISTIC: {
    id: 'REALISTIC',
    name: '🏞 AI Realistic Generator',
    description: 'Real-life like generations',
    defaultResolution: 'HD', // 768x768
    creditCost: 10
  },
  // AI Logo Maker
  LOGO: {
    id: 'LOGO',
    name: '🐾 AI Logo Maker',
    description: 'Business / brand logos',
    defaultResolution: 'SQUARE', // 1024x1024 (updated to match Stability AI requirements)
    creditCost: 25
  },
  // AI Poster Creator
  POSTER: {
    id: 'POSTER',
    name: '📊 AI Poster Creator',
    description: 'Professional posters',
    defaultResolution: 'POSTER_LANDSCAPE', // 1280x720
    creditCost: 50
  },

  // AI Concept Generator
  CONCEPT: {
    id: 'CONCEPT',
    name: '💡 AI Concept Generator',
    description: 'Unique artistic ideas',
    defaultResolution: 'HD', // 768x768
    creditCost: 10
  },
  // AI Game Character Generator
  GAME_CHARACTER: {
    id: 'GAME_CHARACTER',
    name: '🎮 AI Game Character Generator',
    description: 'Gaming avatars & characters',
    defaultResolution: 'HD', // 768x768
    creditCost: 10
  },
  // AI Product Image Generator
  PRODUCT: {
    id: 'PRODUCT',
    name: '📸 AI Product Image Generator',
    description: 'Ecommerce product shots',
    defaultResolution: 'PRODUCT', // 1024x1024
    creditCost: 10
  },
  // AI Fantasy Art Generator
  FANTASY: {
    id: 'FANTASY',
    name: '🌌 AI Fantasy Art Generator',
    description: 'Sci-fi & fantasy world art',
    defaultResolution: 'HD', // 768x768
    creditCost: 10
  },
  // AI Wallpaper Generator
  WALLPAPER: {
    id: 'WALLPAPER',
    name: '🖼️ AI Wallpaper Generator',
    description: 'High-resolution wallpapers',
    defaultResolution: 'WALLPAPER_HD', // 1920x1080
    creditCost: 50
  },
  // Image-to-Image Generator
  IMAGE_TO_IMAGE: {
    id: 'IMAGE_TO_IMAGE',
    name: '🔄 Image-to-Image Generator',
    description: 'Transform existing images',
    defaultResolution: 'SQUARE', // 1024x1024
    creditCost: 10
  }
};

// Available Style Presets
export const STYLE_PRESETS = [
  { id: 'photographic', name: 'Photographic', description: 'Photorealistic images with natural lighting and textures' },
  { id: 'anime', name: 'Anime', description: 'Japanese animation style with clean lines and vibrant colors' },
  { id: 'digital-art', name: 'Digital Art', description: 'Digital illustration with defined brushstrokes and vibrant colors' },
  { id: 'fantasy-art', name: 'Fantasy Art', description: 'Magical and ethereal fantasy art style' },
  { id: 'comic-book', name: 'Comic Book', description: 'Comic book style with bold lines and action-oriented composition' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie-like quality with dramatic lighting and composition' },
  { id: '3d-model', name: '3D Model', description: '3D rendered look with depth and realistic textures' },
  { id: 'pixel-art', name: 'Pixel Art', description: 'Retro-style pixelated graphics' },
  { id: 'origami', name: 'Origami', description: 'Paper-folded look with clean lines and geometric shapes' },
  { id: 'line-art', name: 'Line Art', description: 'Simple line drawings with minimal details' },
  { id: 'enhance', name: 'Enhance', description: 'Enhanced details and quality boost' },
  { id: 'neon-punk', name: 'Neon Punk', description: 'Cyberpunk aesthetic with neon colors and futuristic elements' },
  { id: 'isometric', name: 'Isometric', description: 'Isometric perspective with 3D-like appearance' },
  { id: 'low-poly', name: 'Low Poly', description: 'Low polygon count 3D style with geometric faces' },
  { id: 'modeling-compound', name: 'Modeling Compound', description: 'Clay or plasticine-like appearance with soft textures' },
  { id: 'tile-texture', name: 'Tile Texture', description: 'Repeating pattern design ideal for textures and backgrounds' }
];

// Model compatibility with resolutions
export const COMPATIBLE_DIMENSIONS = {
  'stable-diffusion-xl-1024-v1-0': [
    { width: 1024, height: 1024 },
    { width: 1152, height: 896 },
    { width: 1216, height: 832 },
    { width: 1344, height: 768 },
    { width: 1536, height: 640 },
    { width: 640, height: 1536 },
    { width: 768, height: 1344 },
    { width: 832, height: 1216 },
    { width: 896, height: 1152 },
  ],
  'stable-diffusion-xl-beta-v2-2-2': [
    { width: 1024, height: 1024 },
    { width: 1152, height: 896 },
    { width: 1216, height: 832 },
    { width: 1344, height: 768 },
    { width: 1536, height: 640 },
    { width: 640, height: 1536 },
    { width: 768, height: 1344 },
    { width: 832, height: 1216 },
    { width: 896, height: 1152 },
  ],
  'stable-diffusion-v1-5': [
    { width: 512, height: 512 },   // NORMAL
    { width: 768, height: 768 },   // HD
  ],
  'sdxl-turbo-1-0': [
    { width: 512, height: 512 },
    { width: 768, height: 768 },
    { width: 1024, height: 1024 },
  ],
  'stable-diffusion-3': [
    { width: 1024, height: 1024 },
    { width: 1152, height: 896 },
    { width: 1216, height: 832 },
    { width: 1344, height: 768 },
    { width: 1536, height: 640 },
    { width: 640, height: 1536 },
    { width: 768, height: 1344 },
    { width: 832, height: 1216 },
    { width: 896, height: 1152 },
  ]
};

// Error messages
export const ERROR_MESSAGES = {
  INSUFFICIENT_CREDITS: 'You do not have enough credits for this operation',
  INVALID_RESOLUTION: 'The selected resolution is not compatible with the chosen model',
  INVALID_MODEL: 'Invalid model ID. Valid options are: stable-diffusion-xl-1024-v1-0, stable-diffusion-xl-beta-v2-2-2, stable-diffusion-v1-5, sdxl-turbo-1-0, stable-diffusion-3',
  STABILITY_AI_RESOLUTION: 'For Stability AI models, the allowed dimensions are: 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, 896x1152',
  UNAUTHORIZED: 'You need to be logged in to perform this action',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
};

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    LOGOUT: '/api/auth/logout',
  },
  USER: {
    PROFILE: '/api/users/me',
    CREDITS: '/api/users/me/credits',
    CREDIT_HISTORY: '/api/users/me/credits/history',
  },
  PAYMENT: {
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payment/verify/:orderId',
    SUCCESS: '/api/payment/success',
    WEBHOOK: '/api/webhooks/cashfree'
  },
  IMAGES: {
    OPTIONS: '/api/images/options',
    GENERATE: '/api/images/generate',
    SUGGEST_STYLES: '/api/images/suggest-styles',
    ANALYZE_PROMPT: '/api/images/analyze-prompt',
    LIST: '/api/images',
    DETAIL: '/api/images/:id',
    DELETE: '/api/images/:id',
  },

  POSTERS: {
    TYPES: '/api/posters/types',
    STYLES: '/api/posters/styles',
    ASPECT_RATIOS: '/api/posters/aspect-ratios',
    GENERATE: '/api/posters/generate',
    LIST: '/api/posters',
    DETAIL: '/api/posters/:id',
    DELETE: '/api/posters/:id',
  },
};