
import React, { useState, useCallback, DragEvent } from 'react';
import { MAX_FILE_SIZE } from '../../constants'; // Assuming constants.ts is in the root
import Button from './Button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  label?: string;
  accept?: string; // e.g., "image/*,application/pdf"
  maxSize?: number; // in bytes
  filePreviewUrl?: string | null;
  onRemoveFile?: () => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  label = "Kéo thả file hoặc click để chọn",
  accept = "image/*",
  maxSize = MAX_FILE_SIZE,
  filePreviewUrl,
  onRemoveFile,
  isLoading = false,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined | null) => {
    setError(null);
    if (file) {
      if (file.size > maxSize) {
        setError(`File quá lớn. Kích thước tối đa: ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      if (!accept.split(',').map(s => s.trim()).some(type => file.type.match(type.replace('*', '.*')))) {
         setError(`Loại file không hợp lệ. Chỉ chấp nhận: ${accept}`);
         return;
      }
      onFileUpload(file);
    }
  }

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file);
  }, [accept, maxSize, onFileUpload]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);


  return (
    <div className="mb-4">
      {label && <p className="block text-sm font-medium text-gray-700 mb-1">{label}</p>}
      {filePreviewUrl ? (
        <div className="mt-2 p-4 border border-gray-300 rounded-lg text-center bg-white shadow-sm">
          {accept.includes("image") ? (
             <img src={filePreviewUrl} alt="Preview" className="max-h-48 mx-auto mb-2 rounded" />
          ) : (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                <i className="fas fa-file-alt text-4xl text-gray-400 mr-3"></i>
                <span className="text-sm text-gray-700">{ (onFileUpload as any).name || 'File đã tải lên'}</span>
            </div>
          )}
          <Button onClick={onRemoveFile} variant="danger" size="sm" className="mt-2">
            <i className="fas fa-trash-alt mr-1"></i> Xóa file
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'} rounded-md hover:border-blue-400 transition-colors`}
        >
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Tải file lên</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept={accept} disabled={isLoading} />
              </label>
              <p className="pl-1">hoặc kéo thả</p>
            </div>
            <p className="text-xs text-gray-500">
              {accept.replace('image/', 'Ảnh ').replace('application/pdf', 'PDF ')} lên tới {maxSize / (1024 * 1024)}MB
            </p>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {isLoading && <p className="mt-2 text-sm text-blue-600">Đang tải lên...</p>}
    </div>
  );
};

export default FileUpload;
