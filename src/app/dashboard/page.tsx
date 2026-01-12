'use client';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const cards = [
    {
      title: 'Users',
      description: 'Manage user accounts and information',
      icon: <PeopleIcon fontSize="large" />,
      path: '/dashboard/users',
      color: '#1976d2',
    },
    {
      title: 'Products',
      description: 'Manage product catalog and inventory',
      icon: <ShoppingCartIcon fontSize="large" />,
      path: '/dashboard/products',
      color: '#2e7d32',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box display="flex" gap={2}>
          <Typography variant="body1">Welcome, {user?.firstName || 'Admin'}</Typography>
          <Button variant="outlined" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} key={card.title}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => router.push(card.path)}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
                <Typography variant="h5">{card.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
              <Button sx={{ mt: 2 }}>Go to {card.title}</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}