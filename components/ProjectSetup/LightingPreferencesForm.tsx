
import React from 'react';
import { LightingPreferences, LightTemperature, LightBrightness, LightingStyle, SpaceUsagePurpose } from '../../types';
import Select from '../Common/Select';
import Card from '../Common/Card';
import { AGE_GROUPS } from '../../constants';

interface LightingPreferencesFormProps {
  preferences: LightingPreferences;
  onPreferencesChange: <K extends keyof LightingPreferences>(field: K, value: LightingPreferences[K]) => void;
}

const LightingPreferencesForm: React.FC<LightingPreferencesFormProps> = ({
  preferences,
  onPreferencesChange,
}) => {
  const lightTemperatureOptions = Object.values(LightTemperature).map(lt => ({ value: lt, label: lt }));
  const lightBrightnessOptions = Object.values(LightBrightness).map(lb => ({ value: lb, label: lb }));
  const lightingStyleOptions = Object.values(LightingStyle).map(ls => ({ value: ls, label: ls }));
  const spaceUsagePurposeOptions = Object.values(SpaceUsagePurpose).map(sup => ({ value: sup, label: sup }));
  const ageGroupOptions = AGE_GROUPS.map(age => ({value: age, label: age}));

  const handleMultiSelectChange = (field: keyof LightingPreferences, value: string) => {
    const currentValues = (preferences[field] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onPreferencesChange(field, newValues as any); // Type assertion needed for multi-select
  };


  return (
    <Card title="4. Sở thích Chiếu sáng">
      <div className="grid md:grid-cols-2 gap-6">
        <Select
          label="Độ tuổi / Nhóm tuổi"
          name="ageGroup"
          value={preferences.ageGroup}
          onChange={(e) => onPreferencesChange('ageGroup', e.target.value)}
          options={ageGroupOptions}
          placeholder="Chọn nhóm tuổi"
        />
        <Select
          label="Sở thích về nhiệt độ màu"
          name="lightTemperature"
          value={preferences.lightTemperature}
          onChange={(e) => onPreferencesChange('lightTemperature', e.target.value as LightTemperature)}
          options={lightTemperatureOptions}
          placeholder="Chọn nhiệt độ màu"
        />
        <Select
          label="Sở thích về độ sáng"
          name="lightBrightness"
          value={preferences.lightBrightness}
          onChange={(e) => onPreferencesChange('lightBrightness', e.target.value as LightBrightness)}
          options={lightBrightnessOptions}
          placeholder="Chọn độ sáng"
        />
        <Select
          label="Phong cách chiếu sáng"
          name="lightingStyle"
          value={preferences.lightingStyle}
          onChange={(e) => onPreferencesChange('lightingStyle', e.target.value as LightingStyle)}
          options={lightingStyleOptions}
          placeholder="Chọn phong cách"
        />
      </div>
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mục đích sử dụng không gian (chọn nhiều)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {spaceUsagePurposeOptions.map(option => (
                <label key={option.value} className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                        type="checkbox"
                        name="spaceUsagePurpose"
                        value={option.value}
                        checked={(preferences.spaceUsagePurpose || []).includes(option.value as SpaceUsagePurpose)}
                        onChange={(e) => handleMultiSelectChange('spaceUsagePurpose' , e.target.value as SpaceUsagePurpose)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default LightingPreferencesForm;
