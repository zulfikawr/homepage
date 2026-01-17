'use client';

import React, { useMemo, useState } from 'react';
import { Certificate } from '@/types/certificate';
import { Button, FormLabel, Input, FileUpload } from '@/components/UI';
import CertificateCard from '@/components/Card/Certificate';
import { toast } from '@/components/Toast';
import {
  addCertificate,
  updateCertificate,
  deleteCertificate,
} from '@/database/certificates';
import { modal } from '@/components/Modal';
import { Separator } from '@/components/UI/Separator';
import DateSelect from '@/components/DateSelect';
import { formatDate } from '@/utilities/formatDate';
import { generateId } from '@/utilities/generateId';
import { useRouter } from 'next/navigation';

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const initialDate = useMemo(() => {
    const date = certificateToEdit?.dateIssued
      ? new Date(certificateToEdit.dateIssued)
      : new Date();
    return date;
  }, [certificateToEdit]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const currentPreviewCertificate: Certificate = {
    id: certificate.id || 'preview',
    title: certificate.title || 'Certificate Title',
    issuedBy: certificate.issuedBy || 'Issued By',
    dateIssued: certificate.dateIssued || formatDate(selectedDate),
    credentialId: certificate.credentialId || 'Credential ID',
    organizationLogoUrl: certificate.organizationLogoUrl || undefined,
    imageUrl: certificate.imageUrl,
    link: certificate.link || '#',
  };

  const handleChange = (field: keyof Certificate, value: string) => {
    setCertificate((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    handleChange('dateIssued', formatDate(newDate));
  };

  const requiredCertificateFields: { key: keyof Certificate; label: string }[] =
    [
      { key: 'title', label: 'Title' },
      { key: 'link', label: 'Link' },
      { key: 'issuedBy', label: 'Issued By' },
      { key: 'dateIssued', label: 'Date Issued' },
      { key: 'credentialId', label: 'Credential ID' },
    ];

  const validateForm = () => {
    for (const field of requiredCertificateFields) {
      const value = certificate[field.key];
      const isEmpty = typeof value === 'string' ? !value.trim() : !value;

      if (isEmpty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const certificateData = {
      ...certificate,
      id: certificateToEdit?.id || generateId(certificate.title),
      dateIssued: formatDate(selectedDate),
    };

    try {
      let result;

      if (imageFile || logoFile) {
        const formData = new FormData();
        // Append all certificate fields
        Object.entries(certificateData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // Append files
        if (imageFile) formData.append('image', imageFile);
        if (logoFile) formData.append('organizationLogo', logoFile);

        result = certificateToEdit
          ? await updateCertificate(formData)
          : await addCertificate(formData);
      } else {
        result = certificateToEdit
          ? await updateCertificate(certificateData)
          : await addCertificate(certificateData);
      }

      if (result.success) {
        toast.success(
          certificateToEdit
            ? 'Certificate updated successfully!'
            : 'Certificate added successfully!',
        );
        router.push('/database/certs');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error saving the certificate: ${error.message}`
          : 'An unknown error occurred while saving the certificate.',
      );
    }
  };

  const handleDelete = async () => {
    if (!certificateToEdit) return;

    try {
      const result = await deleteCertificate(certificateToEdit.id);

      if (result.success) {
        toast.success('Certificate deleted successfully!');
        router.push('/database/certs');
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Error deleting the certificate: ${error.message}`
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
      <div className='space-y-6'>
        <div className='flex justify-center'>
          <CertificateCard certificate={currentPreviewCertificate} isInForm />
        </div>

        <Separator margin='5' />

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={certificate.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='Professional Web Developer'
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
              placeholder='Google, Coursera, etc.'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='dateIssued' required>
              Date Issued
            </FormLabel>
            <DateSelect
              value={selectedDate}
              onChange={handleDateChange}
              mode='month-year'
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
              placeholder='AB123456789'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='imageUrl'>Image URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={certificate.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder='https://example.com/certificate.png'
              />
              <FileUpload
                collectionName='certificates'
                recordId={certificateToEdit?.id}
                fieldName='image'
                onUploadSuccess={(url) => handleChange('imageUrl', url)}
                onFileSelect={setImageFile}
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor='link' required>
              Certificate Link
            </FormLabel>
            <Input
              type='text'
              value={certificate.link}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder='https://example.com/verify/ABC'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='organizationLogoUrl'>
              Organization Logo URL
            </FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={certificate.organizationLogoUrl || ''}
                onChange={(e) =>
                  handleChange('organizationLogoUrl', e.target.value)
                }
                placeholder='https://example.com/logo.png'
              />
              <FileUpload
                collectionName='certificates'
                recordId={certificateToEdit?.id}
                fieldName='organizationLogo'
                onUploadSuccess={(url) =>
                  handleChange('organizationLogoUrl', url)
                }
                onFileSelect={setLogoFile}
              />
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {certificateToEdit ? (
        <div className='flex space-x-4'>
          <Button
            type='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            type='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          type='primary'
          icon='plus'
          onClick={handleSubmit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default CertificateForm;
