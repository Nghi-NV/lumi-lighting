
import React from 'react';
import { InteriorPhoto } from '../../types';
import FileUpload from '../Common/FileUpload';
import Card from '../Common/Card';
import { SUPPORTED_INTERIOR_PHOTO_FORMATS } from '../../constants';
import Button from '../Common/Button';

interface InteriorPhotosFormProps {
  interiorPhotos: InteriorPhoto[];
  onInteriorPhotoUpload: (file: File) => void;
  onInteriorPhotoRemove: (index: number) => void;
}

const InteriorPhotosForm: React.FC<InteriorPhotosFormProps> = ({
  interiorPhotos,
  onInteriorPhotoUpload,
  onInteriorPhotoRemove,
}) => {
  return (
    <Card title="3. Hình ảnh Nội thất (Tùy chọn)">
      <p className="text-sm text-gray-600 mb-4">
        Tải lên hình ảnh thực tế của không gian (nếu có) để giúp trực quan hóa thiết kế chiếu sáng sau này.
      </p>
      <FileUpload
        label="Tải lên ảnh nội thất"
        onFileUpload={onInteriorPhotoUpload}
        accept={SUPPORTED_INTERIOR_PHOTO_FORMATS}
      />
      {interiorPhotos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Ảnh đã tải lên:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {interiorPhotos.map((photo, index) => (
              <div key={index} className="relative group border rounded-lg overflow-hidden">
                <img src={photo.url} alt={`Interior ${index + 1}`} className="w-full h-32 object-cover" />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onInteriorPhotoRemove(index)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity !p-1"
                  title="Xóa ảnh"
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default InteriorPhotosForm;
