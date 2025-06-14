import React, { useState } from 'react';
import { GeneratedImage } from '../types/api';
import { Download, CreditCard, Sparkles } from 'lucide-react';
import { createOrder, loadCashfreeSDK } from '../api/services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface ImageResultsProps {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
}

const ImageResults: React.FC<ImageResultsProps> = ({ images, onDownload }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!images || images.length === 0) {
    return null;
  }
  
  const selectedImage = images[selectedImageIndex];

  // Debug the image object
  console.log("Selected image data:", {
    id: selectedImage.id,
    is_free_generation: selectedImage.is_free_generation,
    has_watermark: selectedImage.has_watermark,
    cloudinary_url: selectedImage.cloudinary_url,
    cloudinary_original_url: selectedImage.cloudinary_original_url
  });

  // Function to handle HD image purchase
  const handlePurchaseHD = async (image: GeneratedImage) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to purchase HD images',
        variant: 'error'
      });
      return;
    }

    try {
      setIsPurchasing(true);
      
      // Load Cashfree SDK
      await loadCashfreeSDK();
      
      // Initialize for production with your real clientId
      const cf = window.Cashfree({
        mode: 'production',
        clientId: '651133ec7d7623ab9e8f260603331156'
      });
      
      // Create order for 10 rupees (1 credit = 1 rupee)
      const { payment_session_id } = await createOrder(
        10, 
        user.email, 
        user.phone || '', 
        `hd_image_${image.id}`
      );
      
      // Redirect to Cashfree checkout
      await cf.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: '_self'
      });
      
      // Cashfree will redirect back with order_id
    } catch (err: any) {
      console.error('HD image purchase error:', err);
      toast({
        title: 'Purchase Error',
        description: err.message || 'Failed to process payment',
        variant: 'error'
      });
      setIsPurchasing(false);
    }
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Images</h2>
      
      <div className="main-image-container rounded-lg overflow-hidden shadow-lg relative">
        <img 
          src={selectedImage.cloudinary_url} 
          alt={`Generated image ${selectedImageIndex + 1}`}
          className="w-full h-auto max-h-[500px] object-contain bg-white"
        />
        
        {/* FREE overlay for free generations */}
        {(selectedImage.is_free_generation === true || selectedImage.is_free_user === true) && (
          <div className="absolute top-4 right-4">
            <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Sparkles className="h-4 w-4 mr-1" />
              FREE
            </div>
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <div 
              key={image.id}
              className={`thumbnail-container cursor-pointer transition-all duration-200 rounded-md overflow-hidden
                ${index === selectedImageIndex ? 'ring-2 ring-purple-500 transform scale-105' : 'ring-1 ring-gray-200'}`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img 
                src={image.cloudinary_url} 
                alt={`Thumbnail ${index + 1}`}
                className="w-24 h-24 object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="image-details mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Image Details</h3>
        <div className="details-table max-h-[300px] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <tbody>
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Prompt</th>
                <td className="py-2">{selectedImage.original_prompt}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Enhanced Prompt</th>
                <td className="py-2">{selectedImage.prompt}</td>
              </tr>
              {selectedImage.negative_prompt && (
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Negative Prompt</th>
                  <td className="py-2">{selectedImage.negative_prompt}</td>
                </tr>
              )}
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Resolution</th>
                <td className="py-2">{selectedImage.width} x {selectedImage.height}</td>
              </tr>
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Model</th>
                <td className="py-2">{selectedImage.model_id}</td>
              </tr>
              {selectedImage.style && (
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Style</th>
                  <td className="py-2">{selectedImage.style}</td>
                </tr>
              )}
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Seed</th>
                <td className="py-2">{selectedImage.seed}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            className="bg-purple-gradient text-white px-4 py-2 rounded-lg flex items-center justify-center"
            onClick={() => onDownload(selectedImage)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Image
          </button>
          
          {/* HD Purchase button for free images - only show if not already HD (1024x1024) */}
          {(selectedImage.is_free_generation === true || selectedImage.is_free_user === true) && 
           !(selectedImage.width >= 1024 && selectedImage.height >= 1024) && (
            <button 
              className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              onClick={() => handlePurchaseHD(selectedImage)}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Get HD Version (₹10)
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Info message for free images */}
        {(selectedImage.is_free_generation === true || selectedImage.is_free_user === true) && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
            {selectedImage.width >= 1024 && selectedImage.height >= 1024 ? (
              <p>This is a free generation with watermark. The image is already in HD quality ({selectedImage.width}x{selectedImage.height}).</p>
            ) : (
              <p>This is a free generation with limited quality ({selectedImage.width}x{selectedImage.height}) and watermark. Purchase the HD version to get the original image without watermark.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageResults; 