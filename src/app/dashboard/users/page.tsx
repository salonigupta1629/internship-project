'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Pagination,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useUserStore } from '@/store/userStore';
import { UserRow } from '@/components/Users/UserRow';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { users, loading, total, fetchUsers } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); 

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers((page - 1) * 10, debouncedSearch);
  }, [page, debouncedSearch, fetchUsers]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); 
  }, []);

  const tableHeaders = useMemo(() => (
    <TableHead>
      <TableRow>
        <TableCell><strong>Name</strong></TableCell>
        <TableCell><strong>Email</strong></TableCell>
        <TableCell><strong>Gender</strong></TableCell>
        <TableCell><strong>Phone</strong></TableCell>
        <TableCell><strong>Company</strong></TableCell>
        <TableCell><strong>Action</strong></TableCell>
      </TableRow>
    </TableHead>
  ), []);

  const pageCount = useMemo(() => Math.ceil(total / 10), [total]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users Management
      </Typography>
      
      <TextField
        label="Search Users by name or email"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3, width: '100%', maxWidth: 400 }}
        placeholder="Type to search..."
      />
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            {tableHeaders}
            <TableBody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" mt={2}>
        Showing {users.length} of {total} users
      </Typography>
    </Box>
  );
}