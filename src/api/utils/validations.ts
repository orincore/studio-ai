import { COMPATIBLE_DIMENSIONS, RESOLUTIONS, ERROR_MESSAGES } from '../config';
import { GenerateImagePayload } from '../../types/api';

/**
 * Validates if the selected resolution is compatible with the chosen model
 * @param modelId The model ID
 * @param resolution The resolution ID
 * @returns Boolean indicating if the resolution is compatible
 */
export const isResolutionCompatibleWithModel = (
  modelId: string,
  resolution: string
): boolean => {
  // Get compatible dimensions for the model
  const compatibleDimensions = COMPATIBLE_DIMENSIONS[modelId as keyof typeof COMPATIBLE_DIMENSIONS] || [];
  
  // Get the dimensions for the requested resolution
  const resolutionDimensions = RESOLUTIONS[resolution as keyof typeof RESOLUTIONS];
  
  if (!resolutionDimensions) {
    return false;
  }
  
  // Check if the resolution dimensions are in the compatible dimensions list
  return compatibleDimensions.some(
    (dimensions) => 
      dimensions.width === resolutionDimensions.width && 
      dimensions.height === resolutionDimensions.height
  );
};

/**
 * Validates an image generation payload
 * @param payload The image generation payload
 * @returns Object with validation status and potential error message
 */
export const validateImageGenerationPayload = (
  payload: GenerateImagePayload
): { isValid: boolean; errorMessage?: string } => {
  // Check if required fields exist
  if (!payload.prompt || !payload.generationType || !payload.modelId || !payload.resolution) {
    return {
      isValid: false,
      errorMessage: 'Missing required fields',
    };
  }
  
  // Check prompt length
  if (payload.prompt.trim().length < 3) {
    return {
      isValid: false,
      errorMessage: 'Prompt must be at least 3 characters long',
    };
  }
  
  // Validate resolution compatibility with model
  if (!isResolutionCompatibleWithModel(payload.modelId, payload.resolution)) {
    // Get more specific error message for Stability AI models
    if (payload.modelId.includes('stable-diffusion-xl-1024')) {
      return {
        isValid: false,
        errorMessage: ERROR_MESSAGES.STABILITY_AI_RESOLUTION,
      };
    }
    
    return {
      isValid: false,
      errorMessage: ERROR_MESSAGES.INVALID_RESOLUTION,
    };
  }
  
  // All validations passed
  return { isValid: true };
};

/**
 * Validates a YouTube thumbnail generation payload
 * @param payload The thumbnail generation form data
 * @returns Object with validation status and potential error message
 */
export const validateThumbnailPayload = (formData: FormData): { isValid: boolean; errorMessage?: string } => {
  // Check if required fields exist
  const title = formData.get('title');
  const contentCategory = formData.get('contentCategory');
  const stylePreference = formData.get('stylePreference');
  
  if (!title || !contentCategory || !stylePreference) {
    return {
      isValid: false,
      errorMessage: 'Missing required fields',
    };
  }
  
  // Check title length
  if (title.toString().trim().length < 3) {
    return {
      isValid: false,
      errorMessage: 'Title must be at least 3 characters long',
    };
  }
  
  // Check file type if provided
  const userAsset = formData.get('userAsset') as File | null;
  
  if (userAsset) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(userAsset.type)) {
      return {
        isValid: false,
        errorMessage: 'Invalid file type. Allowed types: JPG, PNG, GIF, WEBP',
      };
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (userAsset.size > maxSize) {
      return {
        isValid: false,
        errorMessage: 'File size exceeds the maximum allowed (5MB)',
      };
    }
  }
  
  // All validations passed
  return { isValid: true };
};

/**
 * Validates a poster generation payload
 * @param formData The poster generation form data
 * @returns Object with validation status and potential error message
 */
export const validatePosterPayload = (formData: FormData): { isValid: boolean; errorMessage?: string } => {
  // Check if required fields exist
  const title = formData.get('title');
  const posterType = formData.get('posterType');
  const stylePreference = formData.get('stylePreference');
  const aspectRatio = formData.get('aspectRatio');
  
  if (!title || !posterType || !stylePreference || !aspectRatio) {
    return {
      isValid: false,
      errorMessage: 'Missing required fields',
    };
  }
  
  // Check title length
  if (title.toString().trim().length < 3) {
    return {
      isValid: false,
      errorMessage: 'Title must be at least 3 characters long',
    };
  }
  
  // Check custom dimensions if aspectRatio is 'custom'
  if (aspectRatio === 'custom') {
    const customDimensionsStr = formData.get('customDimensions')?.toString();
    
    if (!customDimensionsStr) {
      return {
        isValid: false,
        errorMessage: 'Custom dimensions are required when using custom aspect ratio',
      };
    }
    
    try {
      const customDimensions = JSON.parse(customDimensionsStr);
      
      if (!customDimensions.width || !customDimensions.height) {
        return {
          isValid: false,
          errorMessage: 'Custom dimensions must include width and height',
        };
      }
      
      // Check dimensions range
      if (customDimensions.width < 300 || customDimensions.width > 4000 || 
          customDimensions.height < 300 || customDimensions.height > 4000) {
        return {
          isValid: false,
          errorMessage: 'Custom dimensions must be between 300 and 4000 pixels',
        };
      }
    } catch (error) {
      return {
        isValid: false,
        errorMessage: 'Invalid custom dimensions format',
      };
    }
  }
  
  // Check file types if provided
  const logo = formData.get('logo') as File | null;
  const productImage = formData.get('productImage') as File | null;
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (logo && !allowedTypes.includes(logo.type)) {
    return {
      isValid: false,
      errorMessage: 'Invalid logo file type. Allowed types: JPG, PNG, GIF, WEBP',
    };
  }
  
  if (productImage && !allowedTypes.includes(productImage.type)) {
    return {
      isValid: false,
      errorMessage: 'Invalid product image file type. Allowed types: JPG, PNG, GIF, WEBP',
    };
  }
  
  // Check file sizes (max 5MB each)
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (logo && logo.size > maxSize) {
    return {
      isValid: false,
      errorMessage: 'Logo file size exceeds the maximum allowed (5MB)',
    };
  }
  
  if (productImage && productImage.size > maxSize) {
    return {
      isValid: false,
      errorMessage: 'Product image file size exceeds the maximum allowed (5MB)',
    };
  }
  
  // All validations passed
  return { isValid: true };
}; 