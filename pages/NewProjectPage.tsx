import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectInfoForm from '../components/ProjectSetup/ProjectInfoForm';
import SpaceDetailsForm from '../components/ProjectSetup/SpaceDetailsForm';
import InteriorPhotosForm from '../components/ProjectSetup/InteriorPhotosForm';
import LightingPreferencesForm from '../components/ProjectSetup/LightingPreferencesForm';
import Button from '../components/Common/Button';
import { Project, ClientInfo, SpaceInfo, LightingPreferences, FloorPlan, InteriorPhoto, ProjectType, RoomType, LightTemperature, LightBrightness, LightingStyle } from '../types';
import { DEFAULT_PROJECT_NAME, PROJECT_STORAGE_KEY } from '../constants';
import Modal from '../components/Common/Modal';

const initialClientInfo: ClientInfo = { name: '', phone: '', email: '' };
const initialSpaceInfo: Partial<SpaceInfo> = { projectType: ProjectType.APARTMENT, roomType: RoomType.LIVING_ROOM };
const initialLightingPreferences: LightingPreferences = {
  ageGroup: '',
  lightTemperature: LightTemperature.NEUTRAL,
  lightBrightness: LightBrightness.MEDIUM,
  lightingStyle: LightingStyle.MODERN,
  spaceUsagePurpose: [],
};

const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectName, setProjectName] = useState(DEFAULT_PROJECT_NAME);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(initialClientInfo);
  const [spaceInfo, setSpaceInfo] = useState<Partial<SpaceInfo>>(initialSpaceInfo);
  const [lightingPreferences, setLightingPreferences] = useState<LightingPreferences>(initialLightingPreferences);
  const [floorPlan, setFloorPlan] = useState<FloorPlan | undefined>(undefined);
  const [interiorPhotos, setInteriorPhotos] = useState<InteriorPhoto[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const totalSteps = 4;

  const handleClientInfoChange = useCallback((field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSpaceInfoChange = useCallback((field: keyof SpaceInfo, value: any) => {
    setSpaceInfo(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePreferencesChange = useCallback(<K extends keyof LightingPreferences>(field: K, value: LightingPreferences[K]) => {
    setLightingPreferences(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFloorPlanUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setFloorPlan({ file, url });
  }, []);

  const handleFloorPlanRemove = useCallback(() => {
    if (floorPlan) URL.revokeObjectURL(floorPlan.url);
    setFloorPlan(undefined);
  }, [floorPlan]);

  const handleInteriorPhotoUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setInteriorPhotos(prev => [...prev, { file, url }]);
  }, []);

  const handleInteriorPhotoRemove = useCallback((index: number) => {
    const photoToRemove = interiorPhotos[index];
    if (photoToRemove) URL.revokeObjectURL(photoToRemove.url);
    setInteriorPhotos(prev => prev.filter((_, i) => i !== index));
  }, [interiorPhotos]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!clientInfo.name || !spaceInfo.projectType || !spaceInfo.roomType) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc ở Bước 1 và Bước 2.");
        setCurrentStep(1); 
        return;
    }
    setShowSummaryModal(true);
  };
  
  const confirmAndProceed = () => {
    setIsSubmitting(true);
    
    const newProject: Project = {
        id: `project-${new Date().toISOString()}-${Math.random().toString(36).substr(2, 9)}`, // More unique Mock ID
        projectName: projectName || DEFAULT_PROJECT_NAME,
        clientInfo,
        spaceInfo: spaceInfo as SpaceInfo, 
        lightingPreferences,
        floorPlan,
        interiorPhotos,
        createdAt: new Date(),
        updatedAt: new Date(),
        designData: { lightPoints: [] } // Initialize with empty light points
    };
    
    try {
        const existingProjectsJSON = localStorage.getItem(PROJECT_STORAGE_KEY);
        const existingProjects: Project[] = existingProjectsJSON ? JSON.parse(existingProjectsJSON) : [];
        const updatedProjects = [...existingProjects, newProject];
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(updatedProjects));
    } catch (error) {
        console.error("Error saving project to localStorage:", error);
        alert("Đã có lỗi xảy ra khi lưu dự án. Vui lòng thử lại.");
        setIsSubmitting(false);
        return;
    }


    setTimeout(() => {
      setIsSubmitting(false);
      setShowSummaryModal(false);
      navigate(`/design/${newProject.id}`); 
    }, 1500);
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectInfoForm
            clientInfo={clientInfo}
            spaceInfo={spaceInfo}
            onClientInfoChange={handleClientInfoChange}
            onSpaceInfoChange={handleSpaceInfoChange}
          />
        );
      case 2:
        return (
          <SpaceDetailsForm
            spaceInfo={spaceInfo}
            floorPlan={floorPlan}
            onSpaceInfoChange={handleSpaceInfoChange}
            onFloorPlanUpload={handleFloorPlanUpload}
            onFloorPlanRemove={handleFloorPlanRemove}
          />
        );
      case 3:
        return (
          <InteriorPhotosForm
            interiorPhotos={interiorPhotos}
            onInteriorPhotoUpload={handleInteriorPhotoUpload}
            onInteriorPhotoRemove={handleInteriorPhotoRemove}
          />
        );
      case 4:
        return (
          <LightingPreferencesForm
            preferences={lightingPreferences}
            onPreferencesChange={handlePreferencesChange}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tạo dự án chiếu sáng mới</h1>
        <input 
            type="text" 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-lg text-gray-600 mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            placeholder="Tên dự án (ví dụ: Phòng khách nhà chị Lan)"
        />
      </header>

      <div className="mb-8">
        <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">Bước {currentStep} trên {totalSteps}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
      
      <div className="space-y-8">
        {renderStep()}
      </div>

      <div className="mt-12 flex justify-between items-center">
        <Button onClick={prevStep} disabled={currentStep === 1 || isSubmitting} variant="secondary">
          <i className="fas fa-arrow-left mr-2"></i> Quay lại
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={nextStep} disabled={isSubmitting} variant="primary">
            Tiếp theo <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isSubmitting} variant="primary" className="bg-green-600 hover:bg-green-700">
            <i className="fas fa-check mr-2"></i> Hoàn tất & Xem xét
          </Button>
        )}
      </div>

      <Modal isOpen={showSummaryModal} onClose={() => setShowSummaryModal(false)} title="Xác nhận thông tin dự án" size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <p><strong>Tên dự án:</strong> {projectName}</p>
            <p><strong>Khách hàng:</strong> {clientInfo.name} - {clientInfo.phone} - {clientInfo.email}</p>
            <p><strong>Công trình:</strong> {spaceInfo.projectType} {spaceInfo.projectType === ProjectType.OTHER ? `(${spaceInfo.customProjectType})` : ''}</p>
            <p><strong>Phòng:</strong> {spaceInfo.roomType} {spaceInfo.roomType === RoomType.OTHER ? `(${spaceInfo.customRoomType})` : ''} - Diện tích: {spaceInfo.area || 'Chưa rõ'} m²</p>
            <p><strong>Sở thích:</strong> Nhiệt độ {lightingPreferences.lightTemperature}, Độ sáng {lightingPreferences.lightBrightness}, Phong cách {lightingPreferences.lightingStyle}</p>
            <p><strong>Mục đích:</strong> {lightingPreferences.spaceUsagePurpose.join(', ') || 'Chưa chọn'}</p>
            {floorPlan && <p><strong>Mặt bằng:</strong> {floorPlan.file.name}</p>}
            {interiorPhotos.length > 0 && <p><strong>Ảnh nội thất:</strong> {interiorPhotos.length} ảnh</p>}
            
            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="secondary" onClick={() => setShowSummaryModal(false)}>Chỉnh sửa</Button>
                <Button variant="primary" onClick={confirmAndProceed} isLoading={isSubmitting}>
                    Xác nhận & Bắt đầu thiết kế
                </Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewProjectPage;