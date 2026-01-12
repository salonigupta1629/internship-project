'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Chip,
  Rating,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useProductStore } from '@/store/productStore';
import ImageGallery from '@/components/Products/ImageGallery';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentProduct, loading, fetchProductById } = useProductStore();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProductById(Number(params.id));
    }
  }, [params.id, fetchProductById]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentProduct) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
          Back to Products
        </Button>
        <Typography variant="h6" color="error" sx={{ mt: 3 }}>
          Product not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={6}>
          <ImageGallery 
            images={currentProduct.images} 
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={currentProduct.category}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" gutterBottom>
                  {currentProduct.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={currentProduct.rating} 
                    precision={0.1} 
                    readOnly 
                    size="large" 
                  />
                  <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold' }}>
                    {currentProduct.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({Math.floor(Math.random() * 1000)} reviews)
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h3" color="primary" gutterBottom>
                ${currentProduct.price}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" paragraph>
                {currentProduct.description}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Specifications:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Brand: <strong>{currentProduct.brand || 'Generic'}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Stock: <strong>{currentProduct.stock || 50} units</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      SKU: <strong>PROD-{currentProduct.id.toString().padStart(4, '0')}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Warranty: <strong>1 Year</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                >
                  Save for Later
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}