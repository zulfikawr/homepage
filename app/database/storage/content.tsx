'use client';

import React, { useEffect, useRef, useState } from 'react';

import PageTitle from '@/components/PageTitle';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  Icon,
  Input,
  modal,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  toast,
} from '@/components/UI';

interface FileItem {
  type: 'folder' | 'file';
  key: string;
  size?: number;
  uploaded?: string;
}

const StorageContent = () => {
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = async (prefix: string) => {
    setLoading(true);
    setSelectedItems(new Set()); // Clear selection on folder change
    try {
      const response = await fetch(
        `/api/storage/browse?prefix=${encodeURIComponent(prefix)}`,
      );
      const data = (await response.json()) as {
        items?: FileItem[];
        prefix?: string;
      };

      if (data.items) {
        // Sort items: folders first, then files
        const sorted = data.items.sort((a, b) => {
          if (a.type === b.type) return a.key.localeCompare(b.key);
          return a.type === 'folder' ? -1 : 1;
        });
        setItems(sorted);
        setCurrentPrefix(prefix);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems('');
  }, []);

  const handleFolderClick = (folderKey: string) => {
    loadItems(folderKey);
  };

  const handleGoUp = () => {
    const parts = currentPrefix.split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length > 0 ? parts.join('/') + '/' : '';
    loadItems(newPrefix);
  };

  const handleRefresh = () => {
    loadItems(currentPrefix);
  };

  const formatSize = (bytes?: number) => {
    if (bytes === undefined) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  const getFileName = (key: string) => {
    const parts = key.split('/').filter(Boolean);
    return parts[parts.length - 1];
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = `${currentPrefix}${file.name}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);

    toast.show('Uploading...', 'info');

    try {
      const res = await fetch('/api/storage/manage', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      toast.success('File uploaded successfully');
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(
        `/api/storage/manage?key=${encodeURIComponent(key)}`,
        {
          method: 'DELETE',
        },
      );

      if (!res.ok) throw new Error('Delete failed');

      toast.success('Item deleted successfully');
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete item');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(items.map((item) => item.key)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (key: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(key);
    } else {
      newSelected.delete(key);
    }
    setSelectedItems(newSelected);
  };

  const openCreateFolderModal = () => {
    let folderName = '';
    const Content = () => (
      <div className='p-6 space-y-4'>
        <h3 className='text-lg font-semibold'>Create New Folder</h3>
        <Input
          placeholder='Folder Name'
          onChange={(e) => (folderName = e.target.value)}
          autoFocus
        />
        <div className='flex justify-end gap-2'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={() => handleCreateFolder(folderName)}
          >
            Create
          </Button>
        </div>
      </div>
    );
    modal.open(<Content />);
  };

  const handleCreateFolder = async (name: string) => {
    if (!name) return;
    const key = `${currentPrefix}${name}`;

    try {
      const res = await fetch('/api/storage/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-folder', key }),
      });

      if (!res.ok) throw new Error('Create folder failed');

      toast.success('Folder created successfully');
      modal.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create folder');
    }
  };

  const openRenameModal = (oldKey: string) => {
    let newName = getFileName(oldKey);
    const Content = () => (
      <div className='p-6 space-y-4'>
        <h3 className='text-lg font-semibold'>Rename Item</h3>
        <Input
          defaultValue={newName}
          onChange={(e) => (newName = e.target.value)}
          autoFocus
        />
        <div className='flex justify-end gap-2'>
          <Button variant='default' onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button
            variant='primary'
            onClick={() => handleRename(oldKey, newName)}
          >
            Rename
          </Button>
        </div>
      </div>
    );
    modal.open(<Content />);
  };

  const handleRename = async (oldKey: string, newName: string) => {
    if (!newName || newName === getFileName(oldKey)) {
      modal.close();
      return;
    }

    const pathParts = oldKey.split('/');
    pathParts.pop();
    const isFolder = oldKey.endsWith('/');
    if (isFolder) {
      pathParts.pop();
    }

    const basePath = pathParts.join('/');
    const newKey = basePath ? `${basePath}/${newName}` : newName;
    const finalNewKey = isFolder ? `${newKey}/` : newKey;

    try {
      const res = await fetch('/api/storage/manage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rename', oldKey, newKey: finalNewKey }),
      });

      if (!res.ok) throw new Error('Rename failed');

      toast.success('Renamed successfully');
      modal.close();
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to rename item');
    }
  };

  const copyUrl = (key: string) => {
    const url = `${window.location.origin}/api/storage/${key}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const downloadFile = (key: string) => {
    window.open(`/api/storage/${key}`, '_blank');
  };

  return (
    <div>
      <PageTitle
        title='Storage Manager'
        emoji='📦'
        subtitle='Manage files and folders in R2 storage.'
      />

      <div className='flex items-center justify-end gap-2 py-4'>
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
        />
        <Button onClick={handleRefresh} variant='default' icon='arrowClockwise'>
          Refresh
        </Button>
        <Button
          onClick={openCreateFolderModal}
          variant='default'
          icon='folderPlus'
        >
          New Folder
        </Button>
        <Button
          onClick={handleUploadClick}
          variant='primary'
          icon='uploadSimple'
        >
          Upload
        </Button>
      </div>

      {/* Breadcrumbs */}
      <div className='flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg overflow-hidden'>
        {currentPrefix ? (
          <>
            <Button
              variant='ghost'
              onClick={handleGoUp}
              className='h-8 px-2 text-sm text-primary hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0'
            >
              <Icon name='arrowLeft' className='size-4' />
              Up
            </Button>
            {currentPrefix.split('/').filter(Boolean).length > 2 ? (
              <>
                <span className='text-sm text-muted-foreground'>/</span>
                <span className='text-sm text-muted-foreground'>...</span>
                <span className='text-sm text-muted-foreground'>/</span>
                <Button
                  variant='ghost'
                  onClick={() => {
                    const parts = currentPrefix.split('/').filter(Boolean);
                    const parentPath = parts.slice(0, -1).join('/') + '/';
                    loadItems(parentPath);
                  }}
                  className='h-8 px-2 text-sm text-muted-foreground hover:text-primary cursor-pointer truncate'
                >
                  {currentPrefix.split('/').filter(Boolean).slice(-2, -1)[0]}
                </Button>
                <span className='text-sm text-muted-foreground'>/</span>
                <span className='text-sm text-primary font-medium truncate h-8 flex items-center px-2'>
                  {currentPrefix.split('/').filter(Boolean).slice(-1)[0]}
                </span>
              </>
            ) : (
              currentPrefix
                .split('/')
                .filter(Boolean)
                .map((part, index, arr) => {
                  const pathUpToHere = arr.slice(0, index + 1).join('/') + '/';
                  const isLast = index === arr.length - 1;
                  return (
                    <React.Fragment key={pathUpToHere}>
                      <span className='text-sm text-muted-foreground'>/</span>
                      {isLast ? (
                        <span className='text-sm text-primary font-medium truncate h-8 flex items-center px-2'>
                          {part}
                        </span>
                      ) : (
                        <Button
                          variant='ghost'
                          onClick={() => loadItems(pathUpToHere)}
                          className='h-8 px-2 text-sm text-muted-foreground hover:text-primary cursor-pointer truncate'
                        >
                          {part}
                        </Button>
                      )}
                    </React.Fragment>
                  );
                })
            )}
          </>
        ) : (
          <Button
            variant='ghost'
            onClick={() => loadItems('')}
            className='h-8 px-2 text-sm text-muted-foreground hover:text-primary cursor-pointer flex-shrink-0'
          >
            /
          </Button>
        )}
      </div>

      <Table className='mt-0'>
        <TableHeader>
          <TableRow>
            <TableCell isHeader className='w-12 text-center'>
              <div className='flex justify-center'>
                <Checkbox
                  id='select-all-files'
                  label=''
                  checked={
                    items.length > 0 && selectedItems.size === items.length
                  }
                  onChange={handleSelectAll}
                  className='justify-center'
                />
              </div>
            </TableCell>
            <TableCell isHeader>Name</TableCell>
            <TableCell isHeader className='w-32'>
              Size
            </TableCell>
            <TableCell isHeader className='w-40'>
              Date
            </TableCell>
            <TableCell isHeader className='w-20 text-center'>
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPrefix && (
            <TableRow className='cursor-pointer' onClick={handleGoUp}>
              <TableCell></TableCell>
              <TableCell className='font-medium text-muted-foreground flex items-center gap-3'>
                <Icon
                  name='arrowBendUpLeft'
                  className='size-5 text-muted-foreground flex-shrink-0'
                />
                ..
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell></TableCell>
            </TableRow>
          )}

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className='text-center'>
                  <Skeleton className='size-5 rounded mx-auto' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='size-5 rounded' />
                    <Skeleton className='h-5 w-48' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-24' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-8 w-8 rounded mx-auto' />
                </TableCell>
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell className='text-center py-8 text-muted-foreground'>
                No files found in this folder
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.key} className='group'>
                <TableCell className='py-3 text-center relative'>
                  <div className='flex justify-center'>
                    <Checkbox
                      id={`select-${item.key}`}
                      label=''
                      checked={selectedItems.has(item.key)}
                      onChange={(checked) =>
                        handleSelectItem(item.key, checked)
                      }
                      className='justify-center'
                    />
                  </div>
                </TableCell>
                <TableCell
                  className='py-3 font-medium cursor-pointer'
                  onClick={() =>
                    item.type === 'folder'
                      ? handleFolderClick(item.key)
                      : handleSelectItem(item.key, !selectedItems.has(item.key))
                  }
                >
                  <div className='flex items-center gap-3'>
                    <Icon
                      name={item.type === 'folder' ? 'folder' : 'file'}
                      className={`size-5 flex-shrink-0 ${item.type === 'folder' ? 'text-primary' : 'text-muted-foreground'}`}
                    />
                    {getFileName(item.key)}
                  </div>
                </TableCell>
                <TableCell className='py-3 text-muted-foreground text-sm'>
                  {formatSize(item.size)}
                </TableCell>
                <TableCell className='py-3 text-muted-foreground text-sm'>
                  {formatDate(item.uploaded)}
                </TableCell>
                <TableCell className='py-3'>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className='flex justify-center'
                  >
                    <Dropdown
                      trigger={
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0 text-primary'
                        >
                          <Icon name='dotsThreeVertical' className='size-5' />
                        </Button>
                      }
                    >
                      <DropdownItem
                        icon='pencilSimple'
                        onClick={() => openRenameModal(item.key)}
                      >
                        Rename
                      </DropdownItem>
                      {item.type === 'file' && (
                        <>
                          <DropdownItem
                            icon='downloadSimple'
                            onClick={() => downloadFile(item.key)}
                          >
                            Download
                          </DropdownItem>
                          <DropdownItem
                            icon='link'
                            onClick={() => copyUrl(item.key)}
                          >
                            Copy Link
                          </DropdownItem>
                        </>
                      )}
                      <DropdownItem
                        icon='trash'
                        onClick={() => handleDelete(item.key)}
                        className='text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                      >
                        Delete
                      </DropdownItem>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StorageContent;
