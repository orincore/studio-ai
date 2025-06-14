import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Heart, 
  Share2, 
  Settings, 
  Palette, 
  Layers,
  Zap,
  Upload,
  Play,
  Grid,
  List,
  AlertCircle,
  X,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Type,
  FileImage,
  User,
  Paintbrush,
  Smartphone,
  Monitor,
  Sticker,
  Image,
  Camera,
  Sliders,
  Check,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { 
  GenerationModel, 
  Resolution, 
  GenerationType, 
  GenerateImagePayload,
  GeneratedImage
} from '../types/api';
import { COMPATIBLE_DIMENSIONS, RESOLUTIONS, GENERATION_TYPES, ERROR_MESSAGES } from '../api/config';
import ImageResults from '../components/ImageResults';
import { analyzePrompt } from '../api/services/imageService';
import { getSuggestions } from '../api/services/imageService';
import { generateImage } from '../api/services/imageService';
import { generateLogo, LogoGenerationPayload, checkToken } from '../api/services/logoService';
import { useToast } from '../contexts/ToastContext';
import { useSearchParams } from 'react-router-dom';
import { verifyPayment } from '../api/services/paymentService';

// Define tab types
type GenerationTab = 
  | 'text-to-image'
  | 'face-generator'
  | 'logo-maker';

const Generate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Common state
  const [activeTab, setActiveTab] = useState<GenerationTab>('text-to-image');
  const [viewMode, setViewMode] = useState('grid');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Full-screen image view
  const [fullScreenImage, setFullScreenImage] = useState<GeneratedImage | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
  
  // Image generation state
  const [numImages, setNumImages] = useState(1);
  
  // Text-to-Image state
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState('digital-art'); // Changed default to digital-art which works for both general and logo
  const [aspectRatio, setAspectRatio] = useState('1:1');
  
  // Image-to-Image state (variables kept for compatibility)
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourceImageUrl, setSourceImageUrl] = useState<string | null>(null);
  
  // Face Generator state
  const [ageRange, setAgeRange] = useState('20-30');
  const [gender, setGender] = useState('any');
  const [ethnicity, setEthnicity] = useState('any');
  const [faceFeatures, setFaceFeatures] = useState<string[]>([]);
  
  // Logo Maker state
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [colorTheme, setColorTheme] = useState('blue and gold');
  const [industry, setIndustry] = useState('technology');
  const [logoStyle, setLogoStyle] = useState('minimalist');
  

  
  // Poster Creator state
  const [posterTitle, setPosterTitle] = useState('');
  const [posterDescription, setPosterDescription] = useState('');
  const [posterAsset, setPosterAsset] = useState<File | null>(null);
  const [posterAssetUrl, setPosterAssetUrl] = useState<string | null>(null);
  const [eventType, setEventType] = useState('concert');
  const [posterFont, setPosterFont] = useState('montserrat');
  const [posterTheme, setPosterTheme] = useState('modern');
  
  // Wallpaper Generator state
  const [wallpaperCategory, setWallpaperCategory] = useState('nature');
  const [wallpaperResolution, setWallpaperResolution] = useState('1920x1080');
  const [wallpaperPrompt, setWallpaperPrompt] = useState('');
  
  // API data
  const [models, setModels] = useState<GenerationModel[]>([]);
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [filteredResolutions, setFilteredResolutions] = useState<Resolution[]>([]);
  const [generationTypes, setGenerationTypes] = useState<GenerationType[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('stable-diffusion-xl-1024-v1-0');
  const [selectedResolution, setSelectedResolution] = useState<string>('');
  const [selectedGenerationType, setSelectedGenerationType] = useState<string>('GENERAL');
  const [cfgScale, setCfgScale] = useState<number>(7);
  const [steps, setSteps] = useState<number>(30);
  
  // User's generated images
  const [userImages, setUserImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Style options
  const styleOptions = [
    { id: 'photographic', name: 'Photographic' },
    { id: 'digital-art', name: 'Digital Art' },
    { id: 'anime', name: 'Anime' },
    { id: 'fantasy-art', name: 'Fantasy Art' },
    { id: 'comic-book', name: 'Comic Book' },
    { id: 'cinematic', name: 'Cinematic' },
    { id: '3d-model', name: '3D Model' },
    { id: 'pixel-art', name: 'Pixel Art' },
    { id: 'neon-punk', name: 'Neon Punk' },
    { id: 'isometric', name: 'Isometric' },
    { id: 'low-poly', name: 'Low Poly' }
  ];
  
  // Update aspect ratio options
  const aspectRatioOptions = [
    { id: '1:1', name: 'Square (1:1)', resolution: 'SQUARE' },
    { id: '16:9', name: 'Landscape (16:9)', resolution: 'LANDSCAPE' },
    { id: '9:16', name: 'Portrait (9:16)', resolution: 'PORTRAIT' },
    { id: '4:3', name: 'Standard (4:3)', resolution: 'SDXL_1152x896' }
  ];
  
  // Model options
  const modelOptions = [
    { id: 'stable-diffusion-xl-1024-v1-0', name: 'Stable Diffusion XL v1.0' },
    { id: 'stable-diffusion-xl-beta-v2-2-2', name: 'Stable Diffusion XL Beta v2.2.2' },
    { id: 'stable-diffusion-v1-5', name: 'Stable Diffusion v1.5' },
    { id: 'sdxl-turbo-1-0', name: 'SDXL Turbo' },
    { id: 'stable-diffusion-3', name: 'Stable Diffusion 3' }
  ];
  
  // Industry options for logo maker
  const industryOptions = [
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'food', name: 'Food & Restaurant' },
    { id: 'retail', name: 'Retail' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'travel', name: 'Travel & Tourism' },
    { id: 'art', name: 'Art & Design' }
  ];
  
  // Logo style options
  const logoStyleOptions = [
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'modern', name: 'Modern' },
    { id: 'vintage', name: 'Vintage' },
    { id: '3d', name: '3D' },
    { id: 'flat', name: 'Flat' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'corporate', name: 'Corporate' },
    { id: 'playful', name: 'Playful' },
    { id: 'luxury', name: 'Luxury' }
  ];
  
  // Font options
  const fontOptions = [
    { id: 'roboto', name: 'Roboto' },
    { id: 'montserrat', name: 'Montserrat' },
    { id: 'oswald', name: 'Oswald' },
    { id: 'playfair', name: 'Playfair Display' },
    { id: 'bebas', name: 'Bebas Neue' }
  ];
  

  
  // Event type options
  const eventTypeOptions = [
    { id: 'concert', name: 'Concert' },
    { id: 'conference', name: 'Conference' },
    { id: 'workshop', name: 'Workshop' },
    { id: 'exhibition', name: 'Exhibition' },
    { id: 'party', name: 'Party' },
    { id: 'sale', name: 'Sale' }
  ];
  
  // Wallpaper category options
  const wallpaperCategoryOptions = [
    { id: 'nature', name: 'Nature' },
    { id: 'abstract', name: 'Abstract' },
    { id: '3d-model', name: '3D' },
    { id: 'anime', name: 'Anime' },
    { id: 'city', name: 'City' },
    { id: 'space', name: 'Space' }
  ];
  
  // Wallpaper resolution options
  const wallpaperResolutionOptions = [
    { id: '1920x1080', name: 'Full HD (1920x1080)' },
    { id: '2560x1440', name: 'QHD (2560x1440)' },
    { id: '3840x2160', name: '4K (3840x2160)' },
    { id: '1366x768', name: 'Laptop (1366x768)' },
    { id: '1280x720', name: 'HD (1280x720)' }
  ];
  
  // Sticker size options
  const stickerSizeOptions = [
    { id: 'small', name: 'Small (512x512)' },
    { id: 'medium', name: 'Medium (1024x1024)' },
    { id: 'large', name: 'Large (2048x2048)' }
  ];
  
  // Enhancement options
  const enhancementOptionsList = [
    { id: 'face', name: 'Face Cleanup' },
    { id: 'lighting', name: 'Lighting Correction' },
    { id: 'background', name: 'Background Enhancement' }
  ];
  
  // Upscale factor options
  const upscaleFactorOptions = [
    { id: '2x', name: '2x Upscale' },
    { id: '4x', name: '4x Upscale' },
    { id: '8x', name: '8x Upscale' }
  ];
  
  // Inside the Generate component, add these state variables
  const [isAnalyzingPrompt, setIsAnalyzingPrompt] = useState(false);
  const [promptAnalysis, setPromptAnalysis] = useState<{
    enhancedPrompt: string;
    suggestions: Array<{
      category: string;
      suggestion: string;
      examples: string[];
    }>;
  } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  // Handle image download
  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      
      // Start a download by fetching the image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create an object URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Set up the download link
      link.href = url;
      
      // Create a filename from the prompt
      const filename = prompt
        .substring(0, 30)
        .trim()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
      
      // Set the download attribute with the filename
      link.setAttribute('download', `${filename}_${Date.now()}.png`);
      
      // Append to the document temporarily
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback to direct link if fetch fails
      window.open(imageUrl, '_blank');
    }
  };
  
  // Handle opening the full-screen view
  const openFullScreen = (image: GeneratedImage) => {
    setFullScreenImage(image);
    // Find the index of the image in the userImages array
    const index = userImages.findIndex(img => img.id === image.id);
    setFullScreenImageIndex(index >= 0 ? index : 0);
    setZoomLevel(1); // Reset zoom level
    // Prevent scrolling when fullscreen is open
    document.body.style.overflow = 'hidden';
  };
  
  // Handle closing the full-screen view
  const closeFullScreen = () => {
    setFullScreenImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Handle zoom in
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  // Handle zoom out
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  // Navigate to previous image
  const goToPrevImage = () => {
    if (userImages.length <= 1) return;
    
    const newIndex = (fullScreenImageIndex - 1 + userImages.length) % userImages.length;
    setFullScreenImageIndex(newIndex);
    setFullScreenImage(userImages[newIndex]);
    setZoomLevel(1); // Reset zoom level
  };
  
  // Navigate to next image
  const goToNextImage = () => {
    if (userImages.length <= 1) return;
    
    const newIndex = (fullScreenImageIndex + 1) % userImages.length;
    setFullScreenImageIndex(newIndex);
    setFullScreenImage(userImages[newIndex]);
    setZoomLevel(1); // Reset zoom level
  };
  
  // Handle toggling zoom on image click
  const toggleZoom = () => {
    if (zoomLevel > 1) {
      setZoomLevel(1); // Reset to normal
    } else {
      setZoomLevel(2); // Zoom to 200%
    }
  };
  
  // Close fullscreen when ESC key is pressed and handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!fullScreenImage) return;
      
      switch (event.key) {
        case 'Escape':
          closeFullScreen();
          break;
        case 'ArrowLeft':
          goToPrevImage();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
        case '+':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreenImage, fullScreenImageIndex, userImages]);
  
  // Fetch generation options on component mount
  useEffect(() => {
    const fetchGenerationOptions = async () => {
      try {
        const options = await services.imageService.getGenerationOptions();
        setModels(options.models);
        setResolutions(options.resolutions);
        
        // Convert generation types from config to the expected format
        if (options.generationTypes.length === 0) {
          // If the API doesn't return generation types, use the ones from config
          const configTypes: GenerationType[] = Object.values(GENERATION_TYPES).map(type => ({
            id: type.id,
            name: type.name,
            description: type.description,
            defaultResolution: type.defaultResolution
          }));
          setGenerationTypes(configTypes);
        } else {
          setGenerationTypes(options.generationTypes);
        }
        
        // Valid model IDs
        const validModelIds = [
          'stable-diffusion-xl-1024-v1-0',
          'stable-diffusion-xl-beta-v2-2-2',
          'stable-diffusion-v1-5',
          'sdxl-turbo-1-0',
          'stable-diffusion-3'
        ];
        
        // Set defaults
        if (options.models.length > 0) {
          // Find a valid model ID or use the first one from our valid list
          const defaultModel = options.models.find(model => validModelIds.includes(model.id))?.id || validModelIds[0];
          setSelectedModel(defaultModel);
          
          // Initialize filtered resolutions based on the default model
          const modelCompatibleDimensions = COMPATIBLE_DIMENSIONS[defaultModel as keyof typeof COMPATIBLE_DIMENSIONS] || [];
          const compatible = options.resolutions.filter(resolution => 
            modelCompatibleDimensions.some(
              dimensions => 
                dimensions.width === resolution.width && 
                dimensions.height === resolution.height
            )
          );
          setFilteredResolutions(compatible);
        } else {
          // If no models are returned from API, set a default valid model
          setSelectedModel(validModelIds[0]);
        }
        
        if (options.resolutions.length > 0) {
          setSelectedResolution(options.resolutions[0].id);
        }
        
        // Find the default resolution for the selected generation type
        const defaultType = GENERATION_TYPES.GENERAL;
        if (defaultType) {
          setSelectedResolution(defaultType.defaultResolution);
        }
      } catch (err) {
        console.error('Failed to fetch generation options:', err);
        setError('Failed to load generation options. Please try again later.');
      }
    };
    
    fetchGenerationOptions();
  }, []);
  
  // Fetch user's images on component mount
  useEffect(() => {
    fetchUserImages();
  }, [page, selectedGenerationType]);
  
  const fetchUserImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await services.imageService.getUserImages(page, 12, selectedGenerationType);
      setUserImages(response.images);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error('Failed to fetch user images:', err);
      setError('Failed to load your images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // When generation type changes, update the default resolution
  useEffect(() => {
    // Get the selected generation type from our config
    const selectedType = Object.values(GENERATION_TYPES).find(type => type.id === selectedGenerationType);
    if (selectedType) {
      setSelectedResolution(selectedType.defaultResolution);
    }
  }, [selectedGenerationType]);

  // Filter resolutions based on selected model
  useEffect(() => {
    if (selectedModel && resolutions.length > 0) {
      // Get compatible dimensions for the selected model
      const modelCompatibleDimensions = COMPATIBLE_DIMENSIONS[selectedModel as keyof typeof COMPATIBLE_DIMENSIONS] || [];
      
      // Filter resolutions that are compatible with the selected model
      const compatible = resolutions.filter(resolution => 
        modelCompatibleDimensions.some(
          dimensions => 
            dimensions.width === resolution.width && 
            dimensions.height === resolution.height
        )
      );
      
      setFilteredResolutions(compatible);
      
      // If the currently selected resolution is not compatible with the new model,
      // select the first compatible resolution
      const isCurrentResolutionCompatible = compatible.some(res => res.id === selectedResolution);
      if (!isCurrentResolutionCompatible && compatible.length > 0) {
        setSelectedResolution(compatible[0].id);
      }
    }
  }, [selectedModel, resolutions, selectedResolution]);

  const styles = [
    { id: 'photographic', name: 'Photographic', preview: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 'anime', name: 'Anime', preview: 'https://images.pexels.com/photos/8566481/pexels-photo-8566481.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 'comic-book', name: 'Cartoon', preview: 'https://images.pexels.com/photos/1006231/pexels-photo-1006231.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 'digital-art', name: 'Digital Art', preview: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { id: 'fantasy-art', name: 'Fantasy', preview: 'https://images.pexels.com/photos/1286739/pexels-photo-1286739.jpeg?auto=compress&cs=tinysrgb&w=200' }
  ];

  const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];

  // Update tools based on generation types
  const tools = [
    { id: 'text-to-image', name: 'Text to Image', icon: <ImageIcon className="h-5 w-5" /> },
    
    { id: 'logo', name: GENERATION_TYPES.LOGO.name, icon: <Sparkles className="h-5 w-5" /> },
    { id: 'poster', name: GENERATION_TYPES.POSTER.name, icon: <Layers className="h-5 w-5" /> },
    { id: 'profile', name: 'Profile Picture', icon: <Upload className="h-5 w-5" /> }
  ];

  // Add a function to handle prompt analysis
  const handleAnalyzePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzingPrompt(true);
    try {
      const data = await analyzePrompt(prompt);
      setPromptAnalysis(data);
      
      // Get style suggestions
      try {
        const styleData = await getSuggestions(prompt);
        console.log("Style suggestions received:", styleData);
        
        // Check if styleData exists and has items
        if (styleData && Array.isArray(styleData) && styleData.length > 0) {
          setStyle(styleData[0]);
        }
      } catch (styleError) {
        console.error("Error getting style suggestions:", styleError);
        // Continue with execution even if style suggestions fail
      }
    } catch (error) {
      console.error('Failed to analyze prompt:', error);
      // Show error toast
      toast({
        title: "Prompt Analysis Failed",
        description: "We couldn't analyze your prompt. Please try again.",
        variant: "error",
      });
    } finally {
      setIsAnalyzingPrompt(false);
    }
  };

  // Add a function to handle image download
  const handleImageDownload = (image: GeneratedImage) => {
    // Use the original HD URL if available (for purchased images), otherwise use the regular URL
    const downloadUrl = image.cloudinary_original_url || image.cloudinary_url;
    // Debug free generation status
    console.log("Image details:", {
      id: image.id,
      is_free_generation: image.is_free_generation,
      has_watermark: image.has_watermark,
      cloudinary_original_url: image.cloudinary_original_url
    });
    handleDownload(downloadUrl, image.prompt);
  };

    const handleGenerate = async () => {
    console.log('handleGenerate called, activeTab:', activeTab);
    setIsGenerating(true);
    setError(null);
    
    // Check for empty inputs based on active tab
    if (activeTab === 'logo-maker' && !brandName.trim()) {
      console.log('Logo maker tab active, brand name is empty');
      setError('Brand name cannot be empty. Please enter a brand name.');
      setIsGenerating(false);
      
      // Focus on the brand name field
      setTimeout(() => {
        const brandNameField = document.querySelector('input[placeholder="Enter your brand name"]');
        if (brandNameField) {
          (brandNameField as HTMLInputElement).focus();
        }
      }, 100);
      
      return;
    } else if (activeTab !== 'face-generator' && activeTab !== 'logo-maker' && (!prompt || prompt.trim() === '')) {
      setError('Prompt cannot be empty. Please enter a description of what you want to generate.');
      setIsGenerating(false);
      return;
    }
    
    // Valid model IDs
    const validModelIds = [
      'stable-diffusion-xl-1024-v1-0',
      'stable-diffusion-xl-beta-v2-2-2',
      'stable-diffusion-v1-5',
      'sdxl-turbo-1-0',
      'stable-diffusion-3'
    ];
    
    // Check if selected model is valid
    if (!validModelIds.includes(selectedModel)) {
      setError(ERROR_MESSAGES.INVALID_MODEL);
      setIsGenerating(false);
      return;
    }
    
    try {
      // For logo maker, use the new logo API
      if (activeTab === 'logo-maker') {
        try {
          setIsGenerating(true);
          
          // Check token validity before proceeding
          console.log("Checking token validity before logo generation...");
          const isTokenValid = await checkToken();
          if (!isTokenValid) {
            setError("Your session has expired. Please log in again.");
            setIsGenerating(false);
            return;
          }
          
          // Call the new logo API instead of the general image API
          const logoPayload: LogoGenerationPayload = {
            name: brandName,
            description: description,
            colorTheme: colorTheme,
            style: logoStyle,
            industry: industry,
            width: 1024,
            height: 1024,
            modelId: 'stable-diffusion-xl-1024-v1-0'
          };
          
          console.log('Generating logo with payload:', logoPayload);
          
          // Call the logo generation API using our service
          const data = await generateLogo(logoPayload);
          
          console.log('Logo generation successful:', data);
          
          // Show success toast notification
          toast({
            title: "Logo Generated!",
            description: `Successfully created logo for ${brandName}.`,
            variant: "success",
          });
          
          // Update the generated images state with the logo
          setGeneratedImages([{
            id: data.data.id,
            prompt: data.data.prompt,
            original_prompt: data.data.name,
            cloudinary_url: data.data.imageUrl,
            cloudinary_public_id: data.data.publicId,
            width: 1024,
            height: 1024,
            model_id: 'logo-generator',
            steps: 30,
            cfg_scale: 7,
            resolution: 'SQUARE',
            style: data.data.style,
            generation_type: 'LOGO',
            credit_cost: data.creditCost || 25,
            created_at: new Date().toISOString()
          }]);
          
          // Refresh the user's images
          fetchUserImages();
          
          setIsGenerating(false);
          return;
        } catch (err: any) {
          console.error('Logo generation failed:', err);
          setError(err.message || 'Failed to generate logo. Please try again.');
          setIsGenerating(false);
          return;
        }
      }
      
      // Prepare the request payload based on active tab
      let generatedPrompt = prompt.trim();
      
      // For face generator, construct a prompt from the selected attributes
      if (activeTab === 'face-generator') {
        // Set generation type to REALISTIC for faces
        setSelectedGenerationType('REALISTIC');
        
        // Generate a detailed prompt based on selected face attributes
        const genderText = gender === 'any' ? '' : `${gender}`;
        const ageText = ageRange;
        const ethnicityText = ethnicity === 'any' ? '' : `${ethnicity}`;
        const featuresText = faceFeatures.join(', ');
        
        generatedPrompt = `professional portrait of a ${ageText} year old ${ethnicityText} ${genderText} person`;
        
        if (featuresText) {
          generatedPrompt += ` with ${featuresText}`;
        }
        
        generatedPrompt += `, high quality, photorealistic, detailed facial features, professional lighting`;
        
        console.log('Generated face prompt:', generatedPrompt);
      }
      
      // Validation for brand name has already been done at the beginning of the function
      
      const payload: GenerateImagePayload = {
        prompt: generatedPrompt,
        negativePrompt: (() => {
          if (activeTab === 'face-generator') {
            return 'deformed, ugly, bad anatomy, blurry, pixelated, disfigured, poor quality, low resolution, distorted face, poor facial features';
          } else {
            return negativePrompt;
          }
        })(),
        generationType: (() => {
          if (activeTab === 'face-generator') return 'REALISTIC';
          return selectedGenerationType;
        })(),
        modelId: selectedModel,
        resolution: selectedResolution,
        aspectRatio: aspectRatio, // Include aspect ratio
        cfgScale: (() => {
          if (activeTab === 'face-generator') return 9; // Higher CFG for faces
          return 7;
        })(),
        steps: (() => {
          if (activeTab === 'face-generator') return 40; // More steps for faces
          return 30;
        })(),
        style: (() => {
          if (activeTab === 'face-generator') return 'photographic';
          // For logo-maker, we're already using valid API styles directly
          return style;
        })()
      };
      
      console.log('Generating image with payload:', payload);
      console.log('Using style:', payload.style, 'for tab:', activeTab);
      
      // Call the image generation API
      const result = await generateImage(payload);
      
      console.log('Generation successful:', JSON.stringify(result));
      setIsGenerating(false);
      
      // Validate the result structure
      if (!result) {
        console.error('Empty result received from generateImage');
        setError('Failed to generate image. Please try again.');
        return;
      }
      
      // Show success toast notification
      let successTitle = "Images Generated!";
      let itemType = "image";
      
      if (activeTab === 'face-generator') {
        successTitle = "Faces Generated!";
        itemType = "face";
      }
      
      // Add null check for result.images
      const imageCount = result.images && Array.isArray(result.images) && result.images.length ? result.images.length : 0;
      
      toast({
        title: successTitle,
        description: `Successfully created ${imageCount} ${itemType}${imageCount > 1 ? 's' : ''}.`,
        variant: "success",
      });
      
      // Refresh the user's images
      fetchUserImages();
      
      // Update the generated images state with null check
      if (result.images && Array.isArray(result.images)) {
        console.log('Setting generated images:', result.images.length);
        setGeneratedImages(result.images);
      } else {
        console.error('No images returned from API or invalid response format:', result);
        setGeneratedImages([]);
        if (!imageCount) {
          setError('No images were generated. Please try again with a different prompt.');
        }
      }
    } catch (err: any) {
      console.error('Image generation failed:', err);
      
      // Detailed error logging
      if (err.status) console.error('Error status:', err.status);
      if (err.details) console.error('Error details:', err.details);
      
      // Check for specific error patterns
      if (err.message && err.message.includes('allowed dimensions')) {
        // This is a resolution compatibility error
        setError(err.message);
        
        // Try to update the selected resolution to a compatible one
        if (filteredResolutions.length > 0) {
          setSelectedResolution(filteredResolutions[0].id);
        }
      } else if (err.message && err.message.includes('null value in column "prompt"')) {
        // Handle prompt-related errors specifically
        if (activeTab === 'logo-maker') {
          setError('Error: Brand name cannot be empty. Please enter a brand name and try again.');
          
          // Focus on the brand name field
          setTimeout(() => {
            const brandNameField = document.querySelector('input[placeholder="Enter your brand name"]');
            if (brandNameField) {
              (brandNameField as HTMLInputElement).focus();
            }
          }, 100);
        } else {
          setError('Error: The prompt field cannot be empty. Please enter a valid prompt and try again.');
          
          // Focus on the prompt field if possible
          const promptField = document.getElementById('prompt-field');
          if (promptField) {
            promptField.focus();
          }
        }
      } else if (err.message && err.message.includes('Failed to store image metadata')) {
        // Generic metadata storage error
        setError('Error storing image data. Please check your prompt and try again with more descriptive text.');
      } else if (err.message && err.message.includes('Invalid style')) {
        // Handle invalid style error
        console.error('Invalid style error:', err.message);
        setError('Invalid style selected. Using "digital-art" style instead.');
        
        // Set a valid style and retry
        setStyle('digital-art');
        setTimeout(() => {
          handleGenerate();
        }, 500);
        return;
      } else {
        // General error handler
        setError(err.message || 'Image generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToolChange = (toolId: string) => {
    setActiveTab(toolId as GenerationTab);
    
    // Map tool IDs to generation types and set appropriate styles
    switch (toolId) {
      case 'text-to-image':
        setSelectedGenerationType('GENERAL');
        break;

      case 'logo-maker':
        setSelectedGenerationType('LOGO');
        setStyle('digital-art'); // Set a valid style for logos
        break;
        
      case 'face-generator':
        setSelectedGenerationType('REALISTIC');
        setStyle('photographic'); // Set photographic style for faces
        break;
        
      default:
        setSelectedGenerationType('GENERAL');
    }
  };

  const getResolutionDimensions = (resolutionId: string): string => {
    const resolution = filteredResolutions.find(res => res.id === resolutionId) || 
                       resolutions.find(res => res.id === resolutionId);
    if (resolution) {
      return `${resolution.width}x${resolution.height}`;
    }
    return '';
  };

  // File upload handlers
  const handleSourceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceImage(file);
      const url = URL.createObjectURL(file);
      setSourceImageUrl(url);
    }
  };
  

  
  const handlePosterAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterAsset(file);
      const url = URL.createObjectURL(file);
      setPosterAssetUrl(url);
    }
  };
  

  
  const resetFileUpload = (type: 'source' | 'poster') => {
    switch (type) {
      case 'source':
        setSourceImage(null);
        if (sourceImageUrl) URL.revokeObjectURL(sourceImageUrl);
        setSourceImageUrl(null);
        break;
      case 'poster':
        setPosterAsset(null);
        if (posterAssetUrl) URL.revokeObjectURL(posterAssetUrl);
        setPosterAssetUrl(null);
        break;
    }
  };
  

  
  // Handle feature selection in face generator
  const toggleFaceFeature = (feature: string) => {
    setFaceFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(item => item !== feature) 
        : [...prev, feature]
    );
  };

  // Add function to handle aspect ratio change
  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    
    // Find matching resolution
    const matchingOption = aspectRatioOptions.find(r => r.id === ratio);
    if (matchingOption) {
      // Update the resolution state with the matching resolution
      setSelectedResolution(matchingOption.resolution);
    }
  };

  // When Cashfree redirects back with ?order_id=, verify payment
  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (orderId) handlePaymentVerification(orderId);
  }, [searchParams]);

  // Handle payment verification
  const handlePaymentVerification = async (orderId: string) => {
    try {
      const res = await verifyPayment(orderId);
      if (res.success) {
        // Check if this is an HD image purchase
        // The plan ID could be in either res.plan or res.order_tags.plan_id
        const planId = res.plan || (res.order_tags && res.order_tags.plan_id);
        
        if (planId && planId.startsWith('hd_image_')) {
          const imageId = planId.replace('hd_image_', '');
          // Unlock HD version of the image
          const updatedImage = await services.imageService.unlockHdImage(imageId);
          
          // Update the image in the user's images list if it exists
          setUserImages(prevImages => 
            prevImages.map(img => 
              img.id === imageId ? {...img, ...updatedImage} : img
            )
          );
          
          // If the image is currently being viewed, update it
          if (generatedImages.some(img => img.id === imageId)) {
            setGeneratedImages(prevImages => 
              prevImages.map(img => 
                img.id === imageId ? {...img, ...updatedImage} : img
              )
            );
          }
          
          toast({
            title: 'HD Image Unlocked!',
            description: 'You can now download the high-quality version without watermark.',
            variant: 'success'
          });
        } else {
          // Regular credit purchase
          toast({
            title: 'Payment Successful',
            description: `${res.credits_added} credits added to your account.`,
            variant: 'success'
          });
        }
      } else {
        toast({
          title: 'Payment Failed',
          description: res.error || 'Payment verification failed',
          variant: 'error'
        });
      }
    } catch (err: any) {
      console.error('Payment verification failed:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to verify payment status',
        variant: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 bg-gray-50">
      {/* Full-screen image viewer */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="absolute top-4 right-4 flex space-x-3">
            <button
              onClick={zoomOut}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              disabled={zoomLevel >= 3}
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={closeFullScreen}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <X size={20} />
            </button>
                  </div>
          
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <button
              onClick={goToPrevImage}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              disabled={userImages.length <= 1}
            >
              <ChevronLeft size={24} />
            </button>
                  </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <button
              onClick={goToNextImage}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
              disabled={userImages.length <= 1}
            >
              <ChevronRight size={24} />
            </button>
                </div>
          
          <div 
            className="relative overflow-auto max-w-full max-h-full" 
            style={{ 
              width: fullScreenImage.width * zoomLevel, 
              height: fullScreenImage.height * zoomLevel 
            }}
          >
            <img
              src={fullScreenImage.cloudinary_url}
              alt={fullScreenImage.prompt}
              className="cursor-zoom-in"
              onClick={toggleZoom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
                  </div>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 text-white">
            <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
              {fullScreenImageIndex + 1} / {userImages.length}
            </span>
                  </div>
                </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with credit balance */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Image Generator</h1>
          {user && (
            <div className="flex items-center bg-white rounded-xl shadow-sm px-4 py-2">
              <Zap className="text-yellow-500 mr-2 h-5 w-5" />
              <span className="text-sm font-medium text-gray-700 mr-2">Credits:</span>
              <span className="text-sm font-bold text-purple-600">{user.credit_balance}</span>
            </div>
          )}
              </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Tabs navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab('text-to-image')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeTab === 'text-to-image'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Text-to-Image</span>
            </button>
            
            <button
              onClick={() => setActiveTab('face-generator')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeTab === 'face-generator'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <User className="h-4 w-4 mr-2" />
              <span>Face Generator</span>
            </button>
            
            <button
              onClick={() => setActiveTab('logo-maker')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                activeTab === 'logo-maker'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              <span>Logo Maker</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Text-to-Image Generator */}
              {activeTab === 'text-to-image' && (
                <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                    <h2 className="text-xl font-bold text-gray-900">Text-to-Image Generator</h2>
              </div>

                  <div className="space-y-6">
              {/* Prompt Input with Analyze Button */}
                    <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prompt
                </label>
                <div className="flex space-x-2">
                <textarea
                    id="prompt-field"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to generate in detail..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAnalyzePrompt}
                    disabled={isAnalyzingPrompt || !prompt.trim()}
                    className="shrink-0 bg-purple-100 text-purple-700 font-medium px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzingPrompt ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze
                      </span>
                    )}
                  </button>
                </div>
              </div>

                    {/* Negative Prompt */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Negative Prompt
                      </label>
                      <textarea
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Describe what you want to avoid in the image..."
                        rows={2}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      </div>
                    
                    {/* Style, Aspect Ratio, and Model */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Style */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Style
                        </label>
                        <select
                          value={style}
                          onChange={(e) => setStyle(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {styleOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
              </div>

                      {/* Aspect Ratio */}
                <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aspect Ratio
                        </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => handleAspectRatioChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                          {aspectRatioOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                    ))}
                  </select>
                </div>
              </div>

                    {/* Number of Images & Advanced Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Number of Images */}
              <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Images: {numImages}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={numImages}
                          onChange={(e) => setNumImages(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                        </div>
                      </div>
                      
                      {/* Advanced Options Toggle */}
                      <div className="flex items-center justify-end">
                    <button
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                  </button>
                      </div>
                    </div>
                    
                    {/* Advanced Options */}
                    {showAdvanced && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h3 className="text-sm font-medium text-gray-700 mb-4">Advanced Options</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* CFG Scale */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CFG Scale: {cfgScale}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              value={cfgScale}
                              onChange={(e) => setCfgScale(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>1</span>
                              <span>10</span>
                              <span>20</span>
                      </div>
                          </div>
                          
                          {/* Steps */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Steps: {steps}
                            </label>
                            <input
                              type="range"
                              min="10"
                              max="50"
                              value={steps}
                              onChange={(e) => setSteps(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>10</span>
                              <span>30</span>
                              <span>50</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Generate Button */}
                    <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                            <Sparkles className="h-5 w-5" />
                            <span>Generate {numImages > 1 ? `${numImages} Images` : 'Image'}</span>
                      </>
                    )}
                    </button>
                </div>

                {/* Prompt Analysis Results */}
                {promptAnalysis && (
                  <div className="prompt-suggestions mt-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Suggestions to improve your prompt:</h3>
                    <ul className="space-y-2 mb-4">
                      {promptAnalysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                          <p className="font-medium text-gray-900">{suggestion.category}:</p>
                          <p className="text-gray-700">{suggestion.suggestion}</p>
                          <div className="mt-1 text-sm text-gray-500">
                            Examples: {suggestion.examples.join(', ')}
              </div>
                        </li>
                      ))}
                    </ul>
                    <div className="enhanced-prompt bg-white p-3 rounded-lg shadow-sm">
                      <h4 className="text-md font-medium text-gray-900 mb-1">Enhanced prompt:</h4>
                      <p className="text-gray-700 italic">{promptAnalysis.enhancedPrompt}</p>
                      <button 
                        className="mt-2 bg-purple-gradient text-white px-3 py-1 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                        onClick={() => setPrompt(promptAnalysis.enhancedPrompt)}
                      >
                        Use Enhanced Prompt
                      </button>
                </div>
              </div>
                )}

                {/* Add the ImageResults component after the generation button */}
                {generatedImages.length > 0 && (
                  <ImageResults 
                    images={generatedImages}
                    onDownload={handleImageDownload}
                  />
                )}
              </div>
            </div>
              )}
              
              {/* Face Generator */}
              {activeTab === 'face-generator' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <User className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">AI Face Generator</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Age Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Age Range
                        </label>
                  <select
                          value={ageRange}
                          onChange={(e) => setAgeRange(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="0-10">Child (0-10)</option>
                          <option value="11-17">Teen (11-17)</option>
                          <option value="18-25">Young Adult (18-25)</option>
                          <option value="20-30">20s</option>
                          <option value="30-40">30s</option>
                          <option value="40-50">40s</option>
                          <option value="50-60">50s</option>
                          <option value="60-70">60s</option>
                          <option value="70+">70+</option>
                        </select>
                      </div>
                      
                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="any">Any</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="non-binary">Non-binary</option>
                        </select>
                      </div>
                      
                      {/* Ethnicity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ethnicity
                        </label>
                        <select
                          value={ethnicity}
                          onChange={(e) => setEthnicity(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="any">Any / Random</option>
                          <option value="caucasian">Caucasian</option>
                          <option value="african">African</option>
                          <option value="asian">Asian</option>
                          <option value="hispanic">Hispanic</option>
                          <option value="middle-eastern">Middle Eastern</option>
                          <option value="south-asian">South Asian</option>
                          <option value="east-asian">East Asian</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Face Features */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Face Features
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'beard', name: 'Beard' },
                          { id: 'mustache', name: 'Mustache' },
                          { id: 'glasses', name: 'Glasses' },
                          { id: 'smile', name: 'Smile' },
                          { id: 'serious', name: 'Serious' },
                          { id: 'freckles', name: 'Freckles' },
                          { id: 'makeup', name: 'Makeup' },
                          { id: 'earrings', name: 'Earrings' },
                          { id: 'tattoo', name: 'Tattoo' },
                          { id: 'scar', name: 'Scar' },
                          { id: 'piercing', name: 'Piercing' },
                          { id: 'short-hair', name: 'Short Hair' },
                          { id: 'long-hair', name: 'Long Hair' },
                          { id: 'hat', name: 'Hat/Cap' }
                        ].map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => toggleFaceFeature(feature.id)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              faceFeatures.includes(feature.id)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            } transition-colors duration-200`}
                          >
                            {feature.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Image Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Style
                      </label>
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="photographic">Photorealistic</option>
                        <option value="portrait">Professional Portrait</option>
                        <option value="casual">Casual Snapshot</option>
                        <option value="artistic">Artistic</option>
                        <option value="studio">Studio Lighting</option>
                        <option value="outdoor">Outdoor Lighting</option>
                  </select>
                </div>
                    
                    {/* Number of Images */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Faces: {numImages}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={numImages}
                        onChange={(e) => setNumImages(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                      </div>
                    </div>
                    
                    {/* Generate Button */}
                    <div className="flex justify-end">
                  <button
                    onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                            <User className="h-5 w-5" />
                            <span>Generate {numImages > 1 ? `${numImages} Faces` : 'Face'}</span>
                      </>
                    )}
                  </button>
                </div>
                    
                    {/* Display generated faces */}
                    {generatedImages.length > 0 && (
                      <div className="mt-6">
                        <ImageResults 
                          images={generatedImages}
                          onDownload={handleImageDownload}
                        />
              </div>
                    )}
            </div>
                </div>
              )}
              
              {/* Logo Maker */}
              {activeTab === 'logo-maker' && (
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Paintbrush className="h-6 w-6 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">AI Logo Maker</h2>
                    
                    {/* Debug button - always visible for now */}
                    <button 
                      onClick={async () => {
                        const isValid = await checkToken();
                        toast({
                          title: isValid ? "Token Valid" : "Token Invalid",
                          description: isValid ? "Your authentication is working correctly." : "Please log in again.",
                          variant: isValid ? "success" : "error",
                        });
                      }}
                      className="ml-auto text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                    >
                      Check Auth
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Brand Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="Enter your brand name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of your brand"
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {industryOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Color Theme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <input
                        type="text"
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        placeholder="e.g., blue and gold, red and black"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Describe your preferred color scheme</p>
                    </div>

                    {/* Logo Style */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Style
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {logoStyleOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setLogoStyle(option.id)}
                            className={`py-2 px-3 rounded-lg border ${
                              logoStyle === option.id
                                ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            } transition-colors duration-200`}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Generate Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={handleGenerate}
                        disabled={!brandName.trim() || isGenerating}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isGenerating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Paintbrush className="h-5 w-5" />
                            <span>Generate Logo</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Display generated logos */}
                    {generatedImages.length > 0 && (
                      <div className="mt-6">
                        <ImageResults 
                          images={generatedImages}
                          onDownload={handleImageDownload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Generated Images Gallery */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Your Generated Images</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
            </div>
          ) : userImages.length === 0 ? (
            <div className="text-center py-16">
              <Sparkles className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
              <p className="text-gray-500 mb-6">Generate your first AI image</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-6'}>
              {userImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`group relative bg-gray-100 rounded-lg overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center' : ''
                  }`}
                >
                  <img
                    src={image.cloudinary_url}
                      alt={image.prompt}
                    onClick={() => openFullScreen(image)}
                    className={`w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === 'grid' ? 'h-48' : 'h-32 w-32 object-cover'
                    }`}
                    />
                  
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                      <button 
                        onClick={() => handleDownload(image.cloudinary_url, image.prompt)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Download"
                      >
                          <Download className="h-5 w-5" />
                        </button>
                      <button 
                        onClick={() => openFullScreen(image)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="View Full Screen"
                      >
                        <Maximize className="h-5 w-5" />
                        </button>
                    </div>
                  </div>
                  
                  {viewMode === 'list' ? (
                    <div className="ml-4 flex-1">
                      <p className="text-sm text-gray-700 font-medium mb-1 line-clamp-1">{image.prompt}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {image.width}x{image.height} • {image.model_id}
                      </p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDownload(image.cloudinary_url, image.prompt)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          Download
                        </button>
                        <button 
                          onClick={() => openFullScreen(image)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3">
                      <p className="text-sm text-gray-700 line-clamp-2">{image.prompt}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                          {image.generation_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {image.width}x{image.height}
                        </span>
                        </div>
                      </div>
                  )}
                  </div>
                ))}
              </div>
          )}
          
          {/* Pagination */}
          {userImages.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setPage(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md">
                  {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;