'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DateSelect from '@/components/DateSelect';
import { modal } from '@/components/UI';
import { toast } from '@/components/UI';
import { Button, FileUpload, FormLabel, Input } from '@/components/UI';
import CertificateCard from '@/components/UI/Card/variants/Certificate';
import { Separator } from '@/components/UI/Separator';
import {
  addCertificate,
  deleteCertificate,
  updateCertificate,
} from '@/database/certificates';
import { Certificate } from '@/types/certificate';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';
interface CertificateFormProps {
  certificateToEdit?: Certificate;
}

const initialCertificateState: Certificate = {
  id: '',
  slug: '',
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

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (certificateToEdit?.dateIssued) {
      return new Date(certificateToEdit.dateIssued);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (certificateToEdit?.dateIssued) {
        setSelectedDate(new Date(certificateToEdit.dateIssued));
      } else {
        setSelectedDate(new Date());
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [certificateToEdit]);

  const currentPreviewCertificate: Certificate = {
    id: certificate.id || 'preview',
    slug: certificate.slug || 'preview',
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
      { key: 'slug', label: 'Slug' },
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
      id: certificateToEdit?.id || '', // Let PocketBase generate ID if new
      slug: certificate.slug || generateSlug(certificate.title),
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
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following certifications? This
          action cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <CertificateCard certificate={currentPreviewCertificate} isPreview />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
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
          <CertificateCard certificate={currentPreviewCertificate} isPreview />
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
              onChange={(e) => {
                const newTitle = e.target.value;
                setCertificate((prev) => ({
                  ...prev,
                  title: newTitle,
                  slug:
                    prev.slug || !certificateToEdit
                      ? generateSlug(newTitle)
                      : prev.slug,
                }));
              }}
              placeholder='Professional Web Developer'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='slug' required>
              Slug
            </FormLabel>
            <Input
              type='text'
              value={certificate.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder='professional-web-developer'
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
            variant='destructive'
            icon='trash'
            onClick={confirmDelete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handleSubmit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
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
