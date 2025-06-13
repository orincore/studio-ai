import api, { handleApiError } from '../client';
import { ENDPOINTS } from '../config';
import { 
  Category, 
  Style,
  AspectRatio,
  PosterGenerationPayload,
  Poster,
  PostersResponse,
  PosterResponse
} from '../../types/api';

interface PosterTypesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

interface StylesResponse {
  success: boolean;
  message: string;
  data: Style[];
}

interface AspectRatiosResponse {
  success: boolean;
  message: string;
  data: AspectRatio[];
}

// Get poster types
export const getPosterTypes = async (): Promise<Category[]> => {
  try {
    const response = await api.get<PosterTypesResponse>(ENDPOINTS.POSTERS.TYPES);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get style preferences
export const getStylePreferences = async (): Promise<Style[]> => {
  try {
    const response = await api.get<StylesResponse>(ENDPOINTS.POSTERS.STYLES);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get aspect ratios
export const getAspectRatios = async (): Promise<AspectRatio[]> => {
  try {
    const response = await api.get<AspectRatiosResponse>(ENDPOINTS.POSTERS.ASPECT_RATIOS);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Generate poster
export const generatePoster = async (payload: PosterGenerationPayload): Promise<Poster> => {
  try {
    console.log("Generating poster with payload:", payload);
    const response = await api.post<{success?: boolean, data?: Poster} | {data: Poster}>(ENDPOINTS.POSTERS.GENERATE, payload);
    console.log("Generate poster response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as Poster;
  } catch (error) {
    console.error("Error generating poster:", error);
    throw handleApiError(error);
  }
};

// Get user's posters
export const getUserPosters = async (
  page: number = 1,
  limit: number = 20
): Promise<PostersResponse> => {
  try {
    const url = `${ENDPOINTS.POSTERS.LIST}?page=${page}&limit=${limit}`;
    console.log("Getting user posters from:", url);
    const response = await api.get<{success?: boolean, data?: PostersResponse} | PostersResponse>(url);
    console.log("User posters response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as PostersResponse;
  } catch (error) {
    console.error("Error getting user posters:", error);
    throw handleApiError(error);
  }
};

// Get poster by ID
export const getPosterById = async (posterId: string): Promise<Poster> => {
  try {
    const endpoint = ENDPOINTS.POSTERS.DETAIL.replace(':id', posterId);
    console.log("Getting poster details from:", endpoint);
    const response = await api.get<{success?: boolean, data?: Poster} | Poster>(endpoint);
    console.log("Poster details response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as Poster;
  } catch (error) {
    console.error("Error getting poster details:", error);
    throw handleApiError(error);
  }
};

// Delete poster
export const deletePoster = async (posterId: string): Promise<{ message: string }> => {
  try {
    const endpoint = ENDPOINTS.POSTERS.DELETE.replace(':id', posterId);
    console.log("Deleting poster at:", endpoint);
    const response = await api.delete<{success?: boolean, data?: { message: string }} | { message: string }>(endpoint);
    console.log("Delete poster response:", response.data);
    
    // Check if response has a nested data structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && response.data.data) {
      return response.data.data;
    }
    
    // Original structure
    return response.data as { message: string };
  } catch (error) {
    console.error("Error deleting poster:", error);
    throw handleApiError(error);
  }
}; 