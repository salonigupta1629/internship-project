'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserStore } from '@/store/userStore';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, loading, fetchUserById } = useUserStore();

  useEffect(() => {
    fetchUserById(Number(params.id));
  }, [params.id]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()}>
        Back to Users
      </Button>
      
      {currentUser && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5">{currentUser.name}</Typography>
            <Typography>Email: {currentUser.email}</Typography>
            <Typography>Phone: {currentUser.phone}</Typography>
            <Typography>Gender: {currentUser.gender}</Typography>
            <Typography>Company: {currentUser.company.name}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}