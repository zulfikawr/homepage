'use client';

import React from 'react';

import { modal } from '@/components/Modal';
import { Button } from '@/components/UI';

interface LogoutConfirmProps {
  onConfirm: () => void;
}

export const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ onConfirm }) => (
  <div className='p-6'>
    <h2 className='text-xl font-semibold mb-4'>Confirm Logout</h2>
    <p className='mb-6'>Are you sure you want to logout?</p>
    <div className='flex justify-end space-x-4'>
      <Button onClick={() => modal.close()}>Cancel</Button>
      <Button
        type='destructive'
        onClick={() => {
          onConfirm();
          modal.close();
        }}
      >
        Logout
      </Button>
    </div>
  </div>
);
