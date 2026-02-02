'use client';

import React, { useEffect, useState } from 'react';

import { Button, Icon, Skeleton } from '@/components/UI';

interface FileItem {
  type: 'folder' | 'file';
  key: string;
  size?: number;
}

interface FileBrowserProps {
  onSelect: (key: string) => void;
  onClose: () => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  onSelect,
  onClose,
}) => {
  const [currentPrefix, setCurrentPrefix] = useState('');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const loadItems = async (prefix: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/storage/browse?prefix=${encodeURIComponent(prefix)}`,
      );
      const data = (await response.json()) as {
        items?: FileItem[];
        prefix?: string;
      };

      if (data.items) {
        setItems(data.items);
        setCurrentPrefix(prefix);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems('');
  }, []);

  const handleFolderClick = (folderKey: string) => {
    loadItems(folderKey);
    setSelectedKey(null);
  };

  const handleFileClick = (fileKey: string) => {
    setSelectedKey(fileKey);
  };

  const handleGoUp = () => {
    const parts = currentPrefix.split('/').filter(Boolean);
    parts.pop();
    const newPrefix = parts.length > 0 ? parts.join('/') + '/' : '';
    loadItems(newPrefix);
    setSelectedKey(null);
  };

  const handleSelect = () => {
    if (selectedKey) {
      onSelect(selectedKey);
      onClose();
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className='w-full max-w-2xl max-h-[80vh] flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-border'>
        <h2 className='text-xl font-semibold'>Select File from R2</h2>
      </div>

      {/* Path */}
      <div className='px-4 py-2 bg-muted/30 border-b border-border flex items-center gap-2 overflow-hidden'>
        {currentPrefix ? (
          <>
            <button
              onClick={handleGoUp}
              className='text-sm text-primary hover:underline flex items-center gap-1 cursor-pointer flex-shrink-0'
            >
              <Icon name='arrowLeft' className='size-4' />
              Up
            </button>
            {currentPrefix.split('/').filter(Boolean).length > 2 ? (
              <>
                <span className='text-sm text-muted-foreground'>/</span>
                <span className='text-sm text-muted-foreground'>...</span>
                <span className='text-sm text-muted-foreground'>/</span>
                <button
                  onClick={() => {
                    const parts = currentPrefix.split('/').filter(Boolean);
                    const parentPath = parts.slice(0, -1).join('/') + '/';
                    loadItems(parentPath);
                  }}
                  className='text-sm text-muted-foreground hover:text-primary cursor-pointer truncate'
                >
                  {currentPrefix.split('/').filter(Boolean).slice(-2, -1)[0]}
                </button>
                <span className='text-sm text-muted-foreground'>/</span>
                <span className='text-sm text-primary font-medium truncate'>
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
                        <span className='text-sm text-primary font-medium truncate'>
                          {part}
                        </span>
                      ) : (
                        <button
                          onClick={() => loadItems(pathUpToHere)}
                          className='text-sm text-muted-foreground hover:text-primary cursor-pointer truncate'
                        >
                          {part}
                        </button>
                      )}
                    </React.Fragment>
                  );
                })
            )}
          </>
        ) : (
          <button
            onClick={() => loadItems('')}
            className='text-sm text-muted-foreground hover:text-primary cursor-pointer flex-shrink-0'
          >
            /
          </button>
        )}
      </div>

      {/* File List */}
      <div className='flex-1 overflow-y-auto p-4 max-h-[50vh]'>
        {loading ? (
          <div className='space-y-2'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex items-center gap-3 px-3 py-2'>
                <Skeleton className='size-5 rounded' />
                <Skeleton className='h-5 flex-1' />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            No files found
          </div>
        ) : (
          <div className='space-y-1'>
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() =>
                  item.type === 'folder'
                    ? handleFolderClick(item.key)
                    : handleFileClick(item.key)
                }
                className={`w-full text-left px-3 py-2 rounded hover:bg-muted/50 flex items-center gap-3 cursor-pointer ${
                  selectedKey === item.key ? 'bg-primary/10' : ''
                }`}
              >
                <Icon
                  name={item.type === 'folder' ? 'folder' : 'file'}
                  className='size-5 text-primary flex-shrink-0'
                />
                <span className='flex-1 truncate'>
                  {item.key.split('/').filter(Boolean).pop()}
                </span>
                {item.size && (
                  <span className='text-sm text-muted-foreground'>
                    {formatSize(item.size)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className='p-4 border-t border-border flex justify-end gap-3'>
        <Button variant='default' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='primary'
          onClick={handleSelect}
          disabled={!selectedKey}
        >
          Select
        </Button>
      </div>
    </div>
  );
};
