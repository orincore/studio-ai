import api, { handleApiError } from '../client';
import { ENDPOINTS } from '../config';
import { 
  GenerationOptions, 
  GenerateImagePayload, 
  GeneratedImageResponse,
  UserImagesResponse,
  GeneratedImage,
  Pagination
} from '../../types/api';

// Get available generation options
export const getGenerationOptions = async (): Promise<GenerationOptions> => {
  try {
    console.log("Getting generation options from:", ENDPOINTS.IMAGES.OPTIONS);
    const response = await api.get<{success?: boolean, data?: GenerationOptions} | GenerationOptions>(ENDPOINTS.IMAGES.OPTIONS);
    console.log("Generation options response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as GenerationOptions;
  } catch (error) {
    console.error("Error getting generation options:", error);
    throw handleApiError(error);
  }
};

// Generate custom image
export const generateImage = async (payload: GenerateImagePayload): Promise<GeneratedImageResponse> => {
  try {
    // Validate payload before sending
    if (!payload.prompt || payload.prompt.trim() === '') {
      throw new Error('Prompt cannot be empty. Please provide a description of what you want to generate.');
    }
    
    // Ensure the prompt is trimmed and not empty
    const validatedPayload = {
      ...payload,
      prompt: payload.prompt.trim()
    };
    
    console.log("Generating image with payload:", validatedPayload);
    
    const response = await api.post<any>(
      ENDPOINTS.IMAGES.GENERATE, 
      validatedPayload
    );
    
    console.log("Generate image response:", JSON.stringify(response.data));
    
    // Handle the actual API response format which has a single 'image' object instead of 'images' array
    if (response.data && response.data.image) {
      // Convert the single image object to the expected format with an images array
      return {
        images: [response.data.image],
        creditCost: response.data.image.credit_cost || 0
      };
    }
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      if (response.data.data.image) {
        // Handle nested single image format
        return {
          images: [response.data.data.image],
          creditCost: response.data.data.image.credit_cost || 0
        };
      } else if (response.data.data.images && Array.isArray(response.data.data.images)) {
        // Handle nested images array format
        return response.data.data;
      }
    }
    
    // Fallback: try to handle any other format
    const responseData = response.data as any;
    
    // If we have an images array, use it
    if (responseData.images && Array.isArray(responseData.images)) {
      return {
        images: responseData.images,
        creditCost: responseData.creditCost || 0
      };
    }
    
    // If we have a single image object, convert it to an array
    if (responseData.image) {
      return {
        images: [responseData.image],
        creditCost: responseData.image.credit_cost || 0
      };
    }
    
    // Last resort: return empty array to avoid errors
    console.error('Unexpected API response format:', responseData);
    return {
      images: [],
      creditCost: 0
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw handleApiError(error);
  }
};

// NEW: Analyze prompt
export const analyzePrompt = async (prompt: string): Promise<{
  enhancedPrompt: string;
  suggestions: Array<{
    category: string;
    suggestion: string;
    examples: string[];
  }>;
}> => {
  try {
    console.log("Analyzing prompt:", prompt);
    
    try {
      // Try to call the actual API
      const response = await api.post<{success?: boolean, data?: any} | any>(ENDPOINTS.IMAGES.ANALYZE_PROMPT, { prompt });
      console.log("Analyze prompt response:", response.data);
      
      // Check if response has a nested data structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
        return response.data.data;
      }
      
      // Original structure
      return response.data;
    } catch (apiError) {
      console.warn("API not available, using fallback mock implementation for analyzePrompt:", apiError);
      
      // Fallback implementation when API is not available
      // This provides a mock response with suggestions based on the prompt
      const enhancedPrompt = prompt + ", detailed lighting, high resolution, photorealistic";
      
      const suggestions = [
        {
          category: "Lighting",
          suggestion: "Consider adding lighting details for better image quality",
          examples: ["natural lighting", "dramatic shadows", "soft glow"]
        },
        {
          category: "Style",
          suggestion: "Adding a specific art style can improve results",
          examples: ["photorealistic", "oil painting", "watercolor"]
        },
        {
          category: "Detail",
          suggestion: "More specific details can lead to better generations",
          examples: ["intricate details", "fine textures", "high resolution"]
        }
      ];
      
      // Artificial delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        enhancedPrompt,
        suggestions
      };
    }
  } catch (error) {
    console.error("Error analyzing prompt:", error);
    throw handleApiError(error);
  }
};

// Get style suggestions based on prompt
export const getSuggestions = async (prompt: string): Promise<string[]> => {
  try {
    console.log("Getting style suggestions for prompt:", prompt);
    
    try {
      // Try to call the actual API
      const response = await api.post<{success?: boolean, data?: {styles: string[]}} | {styles: string[]}>(ENDPOINTS.IMAGES.SUGGEST_STYLES, { prompt });
      console.log("Style suggestions response:", response.data);
      
      // Check if response has a nested data structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
        return response.data.data.styles;
      }
      
      // Original structure
      return (response.data as {styles: string[]}).styles;
    } catch (apiError) {
      console.warn("API not available, using fallback mock implementation for getSuggestions:", apiError);
      
      // Fallback implementation when API is not available
      // Return appropriate style suggestions based on the prompt content
      const lowerPrompt = prompt.toLowerCase();
      
      // Default styles to choose from
      const availableStyles = [
        'photographic', 'digital-art', 'anime', 'comic-book', 'fantasy-art', 
        'cinematic', '3d-model', 'pixel-art', 'neon-punk'
      ];
      
      // Select styles based on prompt keywords
      if (lowerPrompt.includes('anime') || lowerPrompt.includes('cartoon') || lowerPrompt.includes('manga')) {
        return ['anime', 'comic-book'];
      } else if (lowerPrompt.includes('realistic') || lowerPrompt.includes('photo') || lowerPrompt.includes('portrait')) {
        return ['photographic', 'cinematic'];
      } else if (lowerPrompt.includes('fantasy') || lowerPrompt.includes('magical') || lowerPrompt.includes('dragon')) {
        return ['fantasy-art', 'digital-art'];
      } else if (lowerPrompt.includes('pixel') || lowerPrompt.includes('game') || lowerPrompt.includes('retro')) {
        return ['pixel-art', 'isometric'];
      } else if (lowerPrompt.includes('neon') || lowerPrompt.includes('cyberpunk') || lowerPrompt.includes('futuristic')) {
        return ['neon-punk', 'digital-art'];
      } else if (lowerPrompt.includes('3d') || lowerPrompt.includes('model') || lowerPrompt.includes('render')) {
        return ['3d-model', 'low-poly'];
      }
      
      // Default: return two random styles if no keywords match
      const shuffled = [...availableStyles].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 2);
    }
  } catch (error) {
    console.error("Error getting style suggestions:", error);
    throw handleApiError(error);
  }
};

// Get user's generated images
export const getUserImages = async (
  page: number = 1,
  limit: number = 20,
  generationType?: string
): Promise<UserImagesResponse> => {
  try {
    let url = `${ENDPOINTS.IMAGES.LIST}?page=${page}&limit=${limit}`;
    
    if (generationType) {
      url += `&generationType=${generationType}`;
    }
    
    console.log("Getting user images from:", url);
    const response = await api.get<{success?: boolean, data?: UserImagesResponse} | UserImagesResponse>(url);
    console.log("User images response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as UserImagesResponse;
  } catch (error) {
    console.error("Error getting user images:", error);
    throw handleApiError(error);
  }
};

// Get image by ID
export const getImageById = async (imageId: string): Promise<GeneratedImage> => {
  try {
    const endpoint = ENDPOINTS.IMAGES.DETAIL.replace(':id', imageId);
    console.log("Getting image details from:", endpoint);
    const response = await api.get<{success?: boolean, data?: GeneratedImage} | GeneratedImage>(endpoint);
    console.log("Image details response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as GeneratedImage;
  } catch (error) {
    console.error("Error getting image details:", error);
    throw handleApiError(error);
  }
};

// Delete image
export const deleteImage = async (imageId: string): Promise<{ message: string }> => {
  try {
    const endpoint = ENDPOINTS.IMAGES.DELETE.replace(':id', imageId);
    console.log("Deleting image at:", endpoint);
    const response = await api.delete<{success?: boolean, data?: { message: string }} | { message: string }>(endpoint);
    console.log("Delete image response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as { message: string };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw handleApiError(error);
  }
};

/**
 * Unlock HD version of an image after successful payment
 * @param imageId - ID of the image to unlock HD version
 * @returns The updated image with HD URL
 */
export const unlockHdImage = async (imageId: string): Promise<GeneratedImage> => {
  try {
    const endpoint = ENDPOINTS.IMAGES.UNLOCK_HD.replace(':id', imageId);
    const response = await api.post<{data: GeneratedImage}>(endpoint);
    return response.data.data;
  } catch (error) {
    console.error('Failed to unlock HD image:', error);
    throw handleApiError(error);
  }
}; 