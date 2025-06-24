
import React from 'react';
import { ClientInfo, ProjectType, SpaceInfo } from '../../types';
import Input from '../Common/Input';
import Select from '../Common/Select';
import Card from '../Common/Card';

interface ProjectInfoFormProps {
  clientInfo: ClientInfo;
  spaceInfo: Partial<SpaceInfo>;
  onClientInfoChange: (field: keyof ClientInfo, value: string) => void;
  onSpaceInfoChange: (field: keyof SpaceInfo, value: any) => void;
}

const ProjectInfoForm: React.FC<ProjectInfoFormProps> = ({
  clientInfo,
  spaceInfo,
  onClientInfoChange,
  onSpaceInfoChange,
}) => {
  const projectTypeOptions = Object.values(ProjectType).map(pt => ({ value: pt, label: pt }));

  return (
    <Card title="1. Thông tin Dự án & Khách hàng">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
          <Input
            label="Tên khách hàng"
            name="clientName"
            value={clientInfo.name}
            onChange={(e) => onClientInfoChange('name', e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
          <Input
            label="Số điện thoại"
            name="clientPhone"
            type="tel"
            value={clientInfo.phone}
            onChange={(e) => onClientInfoChange('phone', e.target.value)}
            placeholder="090xxxxxxx"
          />
          <Input
            label="Email"
            name="clientEmail"
            type="email"
            value={clientInfo.email}
            onChange={(e) => onClientInfoChange('email', e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Thông tin công trình</h3>
          <Select
            label="Loại công trình"
            name="projectType"
            value={spaceInfo.projectType || ''}
            onChange={(e) => onSpaceInfoChange('projectType', e.target.value as ProjectType)}
            options={projectTypeOptions}
            placeholder="Chọn loại công trình"
            required
          />
          {spaceInfo.projectType === ProjectType.OTHER && (
            <Input
              label="Mô tả loại công trình khác"
              name="customProjectType"
              value={spaceInfo.customProjectType || ''}
              onChange={(e) => onSpaceInfoChange('customProjectType', e.target.value)}
              placeholder="Ví dụ: Nhà kho, Nhà xưởng..."
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectInfoForm;
