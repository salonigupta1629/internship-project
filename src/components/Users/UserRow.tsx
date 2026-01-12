'use client';

import React from 'react';
import { TableRow, TableCell, Link } from '@mui/material';
import NextLink from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
  phone: string;
  company: { name: string };
}

interface UserRowProps {
  user: User;
}

const UserRowComponent: React.FC<UserRowProps> = ({ user }) => {
  console.log(`UserRow rendered: ${user.name}`); 
  
  return (
    <TableRow hover>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.gender}</TableCell>
      <TableCell>{user.phone}</TableCell>
      <TableCell>{user.company.name}</TableCell>
      <TableCell>
        <Link component={NextLink} href={`/dashboard/users/${user.id}`}>
          View Details
        </Link>
      </TableCell>
    </TableRow>
  );
};

export const UserRow = React.memo(UserRowComponent);