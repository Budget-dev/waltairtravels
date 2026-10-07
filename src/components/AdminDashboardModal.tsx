import React from 'react';
import { AdminPanel } from './AdminPanel';
import { Booking } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  allBookings: Booking[];
  onRefresh: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  allBookings,
  onRefresh,
}) => {
  return (
    <AdminPanel
      isOpen={isOpen}
      onClose={onClose}
      allBookings={allBookings}
      onRefresh={onRefresh}
      isFullPage={false}
    />
  );
};
