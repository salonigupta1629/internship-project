'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Pagination,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const { products, loading, total, categories, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchProducts((page - 1) * 10, debouncedSearch, category);
  }, [page, debouncedSearch, category, fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((event: any) => {
    setCategory(event.target.value);
    setPage(1);
  }, []);

  const handleProductClick = useCallback((id: number) => {
    router.push(`/dashboard/products/${id}`);
  }, [router]);

  const pageCount = useMemo(() => Math.ceil(total / 10), [total]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('');
    setPage(1);
  }, []);

  const formatCategoryName = useCallback((cat: any) => {
    if (!cat) return '';
    
    const categoryStr = String(cat);
    
    const formatted = categoryStr
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    return formatted;
  }, []);

  const validCategories = useMemo(() => {
    if (!Array.isArray(categories)) {
      return [];
    }
    
    return categories
      .filter(cat => cat && typeof cat === 'string')
      .sort((a, b) => a.localeCompare(b));
  }, [categories]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Products Management
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' } }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1 }}
          placeholder="Search by title or description..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={handleCategoryChange}
            startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {validCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {formatCategoryName(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(search || category) && (
          <Button onClick={clearFilters} variant="outlined">
            Clear Filters
          </Button>
        )}
      </Box>

      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Categories loaded: {validCategories.length}
          {categories && !Array.isArray(categories) && ' (Converting to array)'}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                    onError={(e: any) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {product.title}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={formatCategoryName(product.category)}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {product.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Typography variant="h6" color="primary">
                        ${product.price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={product.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.rating?.toFixed(1)})
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {products.length === 0 && !loading && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try changing your search or filters
              </Typography>
            </Box>
          )}

          {products.length > 0 && pageCount > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" mt={2} textAlign="center">
            Showing {products.length} of {total} products
          </Typography>
        </>
      )}
    </Box>
  );
}