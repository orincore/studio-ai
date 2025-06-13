import React, { useState } from 'react';
import { GeneratedImage } from '../types/api';
import { Download } from 'lucide-react';

interface ImageResultsProps {
  images: GeneratedImage[];
  onDownload: (image: GeneratedImage) => void;
}

const ImageResults: React.FC<ImageResultsProps> = ({ images, onDownload }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return null;
  }
  
  const selectedImage = images[selectedImageIndex];
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Generated Images</h2>
      
      <div className="main-image-container rounded-lg overflow-hidden shadow-lg">
        <img 
          src={selectedImage.cloudinary_url} 
          alt={`Generated image ${selectedImageIndex + 1}`}
          className="w-full h-auto max-h-[500px] object-contain bg-white"
        />
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
        
        <button 
          className="mt-4 bg-purple-gradient text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => onDownload(selectedImage)}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Image
        </button>
      </div>
    </div>
  );
};

export default ImageResults; 