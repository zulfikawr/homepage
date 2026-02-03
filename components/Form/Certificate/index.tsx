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
import { getFileUrl } from '@/lib/storage';
import { Certificate } from '@/types/certificate';
import { formatDate } from '@/utilities/formatDate';
import { generateSlug } from '@/utilities/generateSlug';

interface CertificateFormProps {
  certificate_to_edit?: Certificate;
}

const initial_certificate_state: Certificate = {
  id: '',
  slug: '',
  title: '',
  issued_by: '',
  date_issued: '',
  credential_id: '',
  image_url: '',
  organization_logo_url: '',
  link: '',
};

const CertificateForm: React.FC<CertificateFormProps> = ({
  certificate_to_edit,
}) => {
  const [certificate, set_certificate] = useState<Certificate>(
    certificate_to_edit || initial_certificate_state,
  );

  const [image_file, set_image_file] = useState<File | null>(null);
  const [logo_file, set_logo_file] = useState<File | null>(null);

  const [selected_date, set_selected_date] = useState<Date>(() => {
    if (certificate_to_edit?.date_issued) {
      return new Date(certificate_to_edit.date_issued);
    }
    return new Date('2025-01-01');
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (certificate_to_edit?.date_issued) {
        set_selected_date(new Date(certificate_to_edit.date_issued));
      } else {
        set_selected_date(new Date());
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [certificate_to_edit]);

  const current_preview_certificate: Certificate = {
    id: certificate.id || 'preview',
    slug: certificate.slug || 'preview',
    title: certificate.title || 'Certificate Title',
    issued_by: certificate.issued_by || 'Issued By',
    date_issued: certificate.date_issued || formatDate(selected_date),
    credential_id: certificate.credential_id || 'Credential ID',
    image: getFileUrl({}, certificate.image_url),
    organization_logo: getFileUrl({}, certificate.organization_logo_url || ''),
    organization_logo_url: certificate.organization_logo_url || '',
    image_url: certificate.image_url,
    link: certificate.link || '#',
  };

  const handle_change = (field: keyof Certificate, value: string) => {
    set_certificate((prev) => ({ ...prev, [field]: value }));
  };

  const handle_date_change = (new_date: Date) => {
    set_selected_date(new_date);
    handle_change('date_issued', formatDate(new_date));
  };

  const required_certificate_fields: {
    key: keyof Certificate;
    label: string;
  }[] = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'link', label: 'Link' },
    { key: 'issued_by', label: 'Issued By' },
    { key: 'date_issued', label: 'Date Issued' },
    { key: 'credential_id', label: 'Credential ID' },
  ];

  const validate_form = () => {
    for (const field of required_certificate_fields) {
      const value = certificate[field.key];
      const is_empty = typeof value === 'string' ? !value.trim() : !value;

      if (is_empty) {
        toast.error(`${field.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const router = useRouter();

  const handle_submit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!validate_form()) return;

    const certificate_data = {
      ...certificate,
      id: certificate_to_edit?.id || '',
      slug: certificate.slug || generateSlug(certificate.title),
      date_issued: formatDate(selected_date),
    };

    try {
      let result;

      if (image_file || logo_file) {
        const form_data = new FormData();
        // Append all certificate fields
        Object.entries(certificate_data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form_data.append(key, value.toString());
          }
        });

        // Append files
        if (image_file) form_data.append('image', image_file);
        if (logo_file) form_data.append('organization_logo', logo_file);

        result = certificate_to_edit
          ? await updateCertificate(form_data)
          : await addCertificate(form_data);
      } else {
        result = certificate_to_edit
          ? await updateCertificate(certificate_data)
          : await addCertificate(certificate_data);
      }

      if (result.success) {
        toast.success(
          certificate_to_edit
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

  const handle_delete = async () => {
    if (!certificate_to_edit) return;

    try {
      const result = await deleteCertificate(certificate_to_edit.id);

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

  const confirm_delete = () => {
    modal.open(
      <div className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Confirm Deletion</h2>
        <p className='mb-6 text-foreground dark:text-muted-foreground'>
          Are you sure you want to delete the following certifications? This
          action cannot be undone.
        </p>
        <div className='flex justify-center mb-6'>
          <CertificateCard
            certificate={current_preview_certificate}
            isPreview
          />
        </div>
        <div className='flex justify-end space-x-4'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              handle_delete();
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
          <CertificateCard
            certificate={current_preview_certificate}
            isPreview
          />
        </div>

        <Separator margin='5' />

        <form onSubmit={handle_submit} className='space-y-4'>
          <div>
            <FormLabel htmlFor='title' required>
              Title
            </FormLabel>
            <Input
              type='text'
              value={certificate.title || ''}
              onChange={(e) => {
                const new_title = e.target.value;
                set_certificate((prev) => ({
                  ...prev,
                  title: new_title,
                  slug:
                    prev.slug || !certificate_to_edit
                      ? generateSlug(new_title)
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
              value={certificate.slug || ''}
              onChange={(e) => handle_change('slug', e.target.value)}
              placeholder='professional-web-developer'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='issued_by' required>
              Issued By
            </FormLabel>
            <Input
              type='text'
              value={certificate.issued_by || ''}
              onChange={(e) => handle_change('issued_by', e.target.value)}
              placeholder='Google, Coursera, etc.'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='date_issued' required>
              Date Issued
            </FormLabel>
            <DateSelect
              value={selected_date}
              onChange={handle_date_change}
              mode='month-year'
            />
          </div>
          <div>
            <FormLabel htmlFor='credential_id' required>
              Credential ID
            </FormLabel>
            <Input
              type='text'
              value={certificate.credential_id || ''}
              onChange={(e) => handle_change('credential_id', e.target.value)}
              placeholder='AB123456789'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='image_url'>Image URL</FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={certificate.image_url || ''}
                onChange={(e) => handle_change('image_url', e.target.value)}
                placeholder='https://example.com/certificate.png'
              />
              <FileUpload
                collectionName='certificates'
                recordId={certificate_to_edit?.id}
                fieldName='image'
                existingValue={certificate.image_url}
                onUploadSuccess={(url) => handle_change('image_url', url)}
                onFileSelect={set_image_file}
              />
            </div>
          </div>
          <div>
            <FormLabel htmlFor='link' required>
              Certificate Link
            </FormLabel>
            <Input
              type='text'
              value={certificate.link || ''}
              onChange={(e) => handle_change('link', e.target.value)}
              placeholder='https://example.com/verify/ABC'
              required
            />
          </div>
          <div>
            <FormLabel htmlFor='organization_logo_url'>
              Organization Logo URL
            </FormLabel>
            <div className='flex gap-2'>
              <Input
                type='text'
                value={certificate.organization_logo_url || ''}
                onChange={(e) =>
                  handle_change('organization_logo_url', e.target.value)
                }
                placeholder='https://example.com/logo.png'
              />
              <FileUpload
                collectionName='certificates'
                recordId={certificate_to_edit?.id}
                fieldName='organization_logo'
                existingValue={certificate.organization_logo_url}
                onUploadSuccess={(url) =>
                  handle_change('organization_logo_url', url)
                }
                onFileSelect={set_logo_file}
              />
            </div>
          </div>
        </form>
      </div>

      <Separator margin='5' />

      {certificate_to_edit ? (
        <div className='flex space-x-4'>
          <Button
            variant='destructive'
            icon='trash'
            onClick={confirm_delete}
            className='w-full'
          >
            Delete
          </Button>
          <Button
            variant='primary'
            icon='floppyDisk'
            onClick={handle_submit}
            className='w-full'
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          variant='primary'
          icon='plus'
          onClick={handle_submit}
          className='w-full'
        >
          Add
        </Button>
      )}
    </>
  );
};

export default CertificateForm;
