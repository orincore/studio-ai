import api, { getAccessToken } from '../client';

export interface LogoGenerationPayload {
  name: string;
  description?: string;
  colorTheme?: string;
  style?: string;
  industry?: string;
  width?: number;
  height?: number;
  modelId?: string;
}

export interface LogoResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    prompt: string;
    name: string;
    style: string;
    colorTheme: string;
    industry: string;
    imageUrl: string;
    publicId: string;
  };
  creditCost: number;
}

// Function to manually set a token (for testing purposes)
export const setTestToken = (token: string) => {
  localStorage.setItem('access_token', token);
  console.log("Test token set:", token.substring(0, 15) + "...");
};

// Test function to check token validity
export const checkToken = async (): Promise<boolean> => {
  const token = getAccessToken();
  console.log("Current token:", token ? `${token.substring(0, 15)}...` : "No token");
  
  if (!token) {
    console.error("No authentication token found");
    return false;
  }
  
  try {
    // Make a simple request to check token validity
    // Let the API client handle the Authorization header
    const response = await api.get('/api/users/me');
    console.log("Token is valid, user data:", response.data);
    return true;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

export const generateLogo = async (payload: LogoGenerationPayload): Promise<LogoResponse> => {
  try {
    // Check token validity
    const isTokenValid = await checkToken();
    if (!isTokenValid) {
      // Redirect to login page if token is invalid
      window.location.href = '/login?redirect=logo-maker';
      throw new Error('Session expired. Please log in again.');
    }
    
    const token = getAccessToken();
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }
    // Try a completely different approach - use the image generation API directly
    // with logo-specific settings instead of the logo API
    const imageGenerationPayload = {
      prompt: `Professional logo for ${payload.name}. ${payload.description || ''} ${payload.industry ? `Industry: ${payload.industry}.` : ''} ${payload.colorTheme ? `Color scheme: ${payload.colorTheme}.` : ''} High quality, professional, vector style, minimalist, clean lines.`,
      negativePrompt: "text, words, letters, blurry, complex, busy, noisy, cluttered, ugly, deformed, pixelated",
      generationType: "LOGO",
      modelId: "stable-diffusion-xl-1024-v1-0",
      resolution: "SQUARE",
      width: 1024,  // Must be 1024 for SDXL
      height: 1024, // Must be 1024 for SDXL
      cfgScale: 8,
      steps: 35,
      style: payload.style || "digital-art"
    };
    
    // Force dimensions to be 1024x1024 regardless of what's in the payload
    // Create a new object without the resolution property
    const finalPayload = {
      ...imageGenerationPayload,
      width: 1024,
      height: 1024
    };
    
    // @ts-ignore - Remove resolution to avoid any automatic dimension setting
    delete finalPayload.resolution;
  
    console.log('Using image generation API with payload:', finalPayload);
    
    // Add a timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    
    // Use the image generation API instead
    const response = await api.post<any>(`/api/images/generate?t=${timestamp}`, finalPayload);
    
    console.log('Image generation API response:', response.data);
    
    // Transform the image generation response to match the logo response format
    const imageData = response.data;
    let logoResponse: LogoResponse;
    
    if (imageData && imageData.images && imageData.images.length > 0) {
      const image = imageData.images[0];
      
      logoResponse = {
        success: true,
        message: "Logo generated successfully",
        data: {
          id: image.id,
          prompt: image.prompt,
          name: payload.name,
          style: payload.style || "digital-art",
          colorTheme: payload.colorTheme || "",
          industry: payload.industry || "",
          imageUrl: image.cloudinary_url,
          publicId: image.cloudinary_public_id
        },
        creditCost: 25
      };
    } else {
      throw new Error("Failed to generate logo: No image data returned");
    }
    
    return logoResponse;
  } catch (error: any) {
    console.error('Logo API error:', error);
    
    // Enhanced error logging
    console.error('Detailed error information:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    // Check for CORS errors
    if (error.message && error.message.includes('Network Error')) {
      console.error('Possible CORS issue detected');
      throw new Error('Network error: The server might be unavailable or there might be a CORS issue. Please try again later.');
    }
    
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login page if unauthorized
        window.location.href = '/login?redirect=logo-maker';
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // More detailed error extraction
      const errorMessage = 
        error.response.data?.error?.message || 
        error.response.data?.message || 
        error.response.data?.error || 
        error.message || 
        'Failed to generate logo';
        
      throw new Error(errorMessage);
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
}; 