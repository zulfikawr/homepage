'use client';

import React from 'react';

import { modal } from '@/components/ui';
import { Button } from '@/components/ui';

interface LogoutConfirmProps {
  onConfirm: () => void;
}

export const LogoutConfirm: React.FC<LogoutConfirmProps> = ({ onConfirm }) => (
  <div className='flex flex-col gap-4 p-6'>
    <h2 className='text-xl font-semibold text-primary'>Confirm Logout</h2>
    <p className='text-gruv-aqua'>Are you sure you want to logout?</p>
    <div className='flex justify-end space-x-4'>
      <Button
        onClick={() => modal.close()}
        className='px-4 md:px-6'
      >
        Cancel
      </Button>
      <Button
        variant='destructive'
        onClick={() => {
          onConfirm();
          modal.close();
        }}
        className='px-4 md:px-6'
      >
        Logout
      </Button>
    </div>
  </div>
);
