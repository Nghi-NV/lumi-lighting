
import React from 'react';
import { RoomType, SpaceInfo, FloorPlan } from '../../types';
import Input from '../Common/Input';
import Select from '../Common/Select';
import FileUpload from '../Common/FileUpload';
import Card from '../Common/Card';
import { SUPPORTED_FLOOR_PLAN_FORMATS } from '../../constants';

interface SpaceDetailsFormProps {
  spaceInfo: Partial<SpaceInfo>;
  floorPlan?: FloorPlan;
  onSpaceInfoChange: (field: keyof SpaceInfo, value: any) => void;
  onFloorPlanUpload: (file: File) => void;
  onFloorPlanRemove: () => void;
}

const SpaceDetailsForm: React.FC<SpaceDetailsFormProps> = ({
  spaceInfo,
  floorPlan,
  onSpaceInfoChange,
  onFloorPlanUpload,
  onFloorPlanRemove,
}) => {
  const roomTypeOptions = Object.values(RoomType).map(rt => ({ value: rt, label: rt }));

  return (
    <Card title="2. Chi tiết Không gian & Mặt bằng">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Select
            label="Loại phòng/khu vực"
            name="roomType"
            value={spaceInfo.roomType || ''}
            onChange={(e) => onSpaceInfoChange('roomType', e.target.value as RoomType)}
            options={roomTypeOptions}
            placeholder="Chọn loại phòng"
            required
          />
          {spaceInfo.roomType === RoomType.OTHER && (
            <Input
              label="Mô tả loại phòng khác"
              name="customRoomType"
              value={spaceInfo.customRoomType || ''}
              onChange={(e) => onSpaceInfoChange('customRoomType', e.target.value)}
              placeholder="Ví dụ: Sảnh chờ, Khu vực trưng bày..."
            />
          )}
          <Input
            label="Diện tích ước tính (m²)"
            name="area"
            type="number"
            value={spaceInfo.area || ''}
            onChange={(e) => onSpaceInfoChange('area', parseFloat(e.target.value))}
            placeholder="Ví dụ: 25"
          />
           <p className="text-xs text-gray-500 mt-1">Nếu có bản vẽ với kích thước, hệ thống có thể cố gắng nhận diện.</p>
        </div>
        <div>
          <FileUpload
            label="Tải lên bản vẽ mặt bằng"
            onFileUpload={onFloorPlanUpload}
            accept={SUPPORTED_FLOOR_PLAN_FORMATS}
            filePreviewUrl={floorPlan?.url}
            onRemoveFile={onFloorPlanRemove}
          />
           <p className="text-xs text-gray-500 mt-1">Hỗ trợ JPG, PNG, PDF. Ưu tiên bản vẽ có ghi chú kích thước rõ ràng.</p>
        </div>
      </div>
    </Card>
  );
};

export default SpaceDetailsForm;
