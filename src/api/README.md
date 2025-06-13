# Orincore AI Studio API Integration

This directory contains the API client and services for interacting with the Orincore AI Studio API backend.

## Base URL

The API base URL is set to `https://studioapi.orincore.com/api`.

## Structure

- `client.ts` - Base API client with authentication handling
- `config.ts` - Configuration constants and values
- `index.ts` - Main export file for easy importing
- `services/` - API service modules for specific endpoints
  - `authService.ts` - Authentication operations
  - `userService.ts` - User profile and credit operations
  - `imageService.ts` - AI image generation operations
  - `thumbnailService.ts` - YouTube thumbnail generation operations
  - `posterService.ts` - Poster generation operations
- `utils/` - Utility functions for working with the API
  - `validations.ts` - Input validation functions
  - `errorHandler.ts` - Error handling utilities

## Authentication

The API client handles authentication tokens automatically. When a user logs in, the tokens are stored in local storage. The client will:

1. Add the authentication token to requests
2. Refresh tokens when they expire
3. Redirect to login when authentication fails

## Usage Examples

### Authentication

```typescript
import { services } from '../api';

// Register a new user
const registerUser = async () => {
  try {
    const result = await services.authService.register({
      email: 'user@example.com',
      password: 'securePassword123',
      full_name: 'John Doe'
    });
    console.log('Registration successful', result);
  } catch (error) {
    console.error('Registration failed', error);
  }
};

// Login
const loginUser = async () => {
  try {
    const result = await services.authService.login({
      email: 'user@example.com',
      password: 'securePassword123'
    });
    console.log('Login successful', result.user);
  } catch (error) {
    console.error('Login failed', error);
  }
};
```

### User Profile

```typescript
import { services } from '../api';

// Get current user profile
const getUserProfile = async () => {
  try {
    const user = await services.userService.getCurrentUser();
    console.log('User profile', user);
  } catch (error) {
    console.error('Failed to fetch user profile', error);
  }
};

// Update user profile
const updateProfile = async () => {
  try {
    const updatedUser = await services.userService.updateUserProfile({
      full_name: 'Updated Name',
      country: 'Canada'
    });
    console.log('Profile updated', updatedUser);
  } catch (error) {
    console.error('Failed to update profile', error);
  }
};
```

### Image Generation

```typescript
import { services, utils } from '../api';

// Generate an AI image
const generateImage = async () => {
  const payload = {
    prompt: 'A beautiful landscape with mountains and a lake',
    negativePrompt: 'people, text, watermark',
    generationType: 'GENERAL',
    modelId: 'stable-diffusion-v1-5',
    resolution: 'NORMAL',
    cfgScale: 7,
    steps: 30
  };

  // Validate the payload
  const validation = utils.validateImageGenerationPayload(payload);
  if (!validation.isValid) {
    console.error(validation.errorMessage);
    return;
  }

  try {
    const result = await services.imageService.generateImage(payload);
    console.log('Image generated', result.images[0].cloudinary_url);
  } catch (error) {
    console.error('Image generation failed', error);
  }
};
```

### Error Handling

```typescript
import { services, utils } from '../api';

const handleApiRequest = async () => {
  try {
    const user = await services.userService.getCurrentUser();
    return user;
  } catch (error) {
    // Format the error
    const formattedError = utils.formatApiError(error);
    
    // Check specific error types
    if (utils.isAuthenticationError(formattedError)) {
      console.error('Authentication error, please login again');
      // Redirect to login
    } else if (utils.isInsufficientCreditsError(formattedError)) {
      console.error('Insufficient credits for this operation');
      // Show purchase credits dialog
    } else {
      console.error('Operation failed:', formattedError.message);
    }
    
    return null;
  }
};
``` 