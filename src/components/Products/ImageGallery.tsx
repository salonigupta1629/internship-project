'use client';

import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface ImageGalleryProps {
  images: string[];
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export default function ImageGallery({ images, selectedImage, onSelectImage }: ImageGalleryProps) {
  const handlePrev = () => {
    onSelectImage((selectedImage - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onSelectImage((selectedImage + 1) % images.length);
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 400,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <img
          src={images[selectedImage] || '/placeholder-product.jpg'}
          alt={`Product view ${selectedImage + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.8)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => onSelectImage(index)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedImage === index ? '2px solid #1976d2' : '2px solid transparent',
                opacity: selectedImage === index ? 1 : 0.7,
                '&:hover': {
                  opacity: 1,
                },
                flexShrink: 0,
              }}
            >
              <img
                src={image || '/placeholder-product.jpg'}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}