# Orincore AI Studio

Orincore AI Studio is an AI-powered image generation platform that allows users to create stunning images, YouTube thumbnails, and posters using the latest AI models.

## Features

- **AI Image Generation**: Generate custom images using Stable Diffusion models
- **YouTube Thumbnail Generation**: Create professional YouTube thumbnails
- **Poster Generation**: Design beautiful posters for various purposes
- **User Management**: Registration, login, and profile management
- **Credit System**: Purchase and manage credits for generation operations

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend API**: Node.js, Express, MongoDB
- **Authentication**: JWT-based authentication
- **Payment Integration**: LemonSqueezy
- **Image Storage**: Cloudinary
- **AI Models**: Stability AI (Stable Diffusion)

## API Integration

The frontend communicates with the backend API at `https://studioapi.orincore.com/api`. See the [API documentation](src/api/README.md) for details on how the API integration works.

## Getting Started

### Prerequisites

- Node.js (>= 18.x)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/orincore-ai-studio.git
   cd orincore-ai-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   VITE_API_URL=https://studioapi.orincore.com/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Build for Production

```bash
npm run build
```

This will generate optimized files in the `dist` directory.

## API Endpoints

The API documentation is available in the [API documentation](src/api/README.md) file.

## License

[MIT License](LICENSE) 