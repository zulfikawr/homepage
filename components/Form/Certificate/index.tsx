'use client';

import React, { useState } from 'react';
import { Certificate } from '@/types/certificate';
import { drawer } from '@/components/Drawer';
import { Button, FormLabel, Input } from '@/components/UI';
import CertificateCard from '@/components/Card/Certificate';
import { toast } from '@/components/Toast';
import {
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from '@/functions/certificates';
import { modal } from '@/components/Modal';
import Separator from '@/components/UI/Separator';

interface CertificateFormProps {
  certificateToEdit?: Certificate;
}

const initialCertificateState: Certificate = {
  id: '',
  title: '',
  issuedBy: '',
  dateIssued: '',
  credentialId: '',
  imageUrl: '',
  organizationLogoUrl: undefined,
  link: '',
};

const CertificateForm: React.FC<CertificateFormProps> = ({
  certificateToEdit,
}) => {
  const [certificate, setCertificate] = useState<Certificate>(
    certificateToEdit || initialCertificateState,
  );

  const currentPreviewCertificate: Certificate = {
    id: certificate.id || 'preview',
    title: certificate.title || 'Certificate Title',
    issuedBy: certificate.issuedBy || 'Issued By',
    dateIssued: certificate.dateIssued || 'Date Issued',
    credentialId: certificate.credentialId || 'Credential ID',
    organizationLogoUrl: certificate.organizationLogoUrl,
    imageUrl: certificate.imageUrl,
    link: certificate.link || '#',
  };

  const handleChange = (field: keyof Certificate, value: string) => {
    setCertificate((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = certificateToEdit
        ? await updateCertificate(certificate)
        : await addCertificate(certificate);

      if (result.success) {
        drawer.close();
        toast.show(
          certificateToEdit
            ? 'Certificate updated successfully!'
            : 'Certificate added successfully!',
        );
      } else {
        throw new Error(result.error || 'Failed to save certificate');
      }
    } catch (error) {
      toast.show(
        error instanceof Error
          ? `Error saving certificate: ${error.message}`
          : 'An unknown error occurred while saving the certificate.',
      );
    }
  };

  const handleDelete = async () => {
    if (!certificateToEdit) return;

    try {
      const result = await deleteCertificate(certificateToEdit.id);

      if (result.success) {
        drawer.close();
        toast.show('Certificate deleted successfully!');
      } else {
        throw new Error(result.error || 'Failed to delete certificate');
      }
    } catch (error) {
      toast.show(
        error instanceof Error
          ? `Error deleting certificate: ${error.message}`
          : 'An unknown error occurred while deleting the certificate.',
      );
    }
  };

  const confirmDelete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-neutral-800 dark:text-neutral-300'>
          Are you sure you want to delete the following certifications? This
          action cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <CertificateCard certificate={currentPreviewCertificate} isInForm />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button type='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            type='destructive'
            onClick={() => {
              handleDelete();
              modal.close();
            }}
          >
            Delete
          </Button>
        </div>
      </div>,
    );
  };

  return (
    <>
      <div className='flex-shrink-0 p-4 sm:px-8 sm:py-6'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='text-xl md:text-2xl font-medium whitespace-nowrap overflow-hidden text-ellipsis'>
            {certificateToEdit
              ? `${certificateToEdit.title}`
              : 'Add New Certifications'}
          </h1>
          <div className='flex space-x-4'>
            {certificateToEdit ? (
              <div className='flex space-x-4'>
                <Button type='destructive' icon='trash' onClick={confirmDelete}>
                  Delete
                </Button>
                <Button type='primary' icon='floppyDisk' onClick={handleSubmit}>
                  Save
                </Button>
              </div>
            ) : (
              <Button type='primary' icon='plus' onClick={handleSubmit}>
                Add
              </Button>
            )}
            <Button icon='close' onClick={() => drawer.close()} />
          </div>
        </div>
      </div>

      <Separator margin='0' />

      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 sm:px-8 sm:py-6 space-y-6'>
          <div className='flex justify-center'>
            <CertificateCard certificate={currentPreviewCertificate} isInForm />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <FormLabel htmlFor='title' required>
                Title
              </FormLabel>
              <Input
                type='text'
                value={certificate.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='imageUrl'>Image URL</FormLabel>
              <Input
                type='text'
                value={certificate.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
            </div>
            <div>
              <FormLabel htmlFor='link' required>
                Certificate Link
              </FormLabel>
              <Input
                type='text'
                value={certificate.link}
                onChange={(e) => handleChange('link', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='issuedBy' required>
                Issued By
              </FormLabel>
              <Input
                type='text'
                value={certificate.issuedBy}
                onChange={(e) => handleChange('issuedBy', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='organizationLogoUrl'>
                Organization Logo URL
              </FormLabel>
              <Input
                type='text'
                value={certificate.organizationLogoUrl}
                onChange={(e) =>
                  handleChange('organizationLogoUrl', e.target.value)
                }
              />
            </div>
            <div>
              <FormLabel htmlFor='dateIssued' required>
                Date Issued
              </FormLabel>
              <Input
                type='text'
                value={certificate.dateIssued}
                onChange={(e) => handleChange('dateIssued', e.target.value)}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor='credentialId' required>
                Credential ID
              </FormLabel>
              <Input
                type='text'
                value={certificate.credentialId}
                onChange={(e) => handleChange('credentialId', e.target.value)}
                required
              />
            </div>
            <div className='flex justify-end space-x-4'>
              {certificateToEdit && (
                <Button type='destructive' onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CertificateForm;
