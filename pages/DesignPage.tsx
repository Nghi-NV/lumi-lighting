
import React, { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, Product, LightingCalculationResults, DesignLightPoint, LightProductType, InteriorPhoto } from '../types';
import { MOCK_PRODUCTS, LIGHT_ICON_MAP, PROJECT_STORAGE_KEY } from '../constants';
import { simulateLightingCalculations, generateReportContent, exportReportAsPDFMock } from '../services/mockLightingService';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';
import Modal from '../components/Common/Modal';
import Select from '../components/Common/Select';

const DesignPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [calculations, setCalculations] = useState<LightingCalculationResults | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  
  const [lightPoints, setLightPoints] = useState<DesignLightPoint[]>([]);
  const [selectedLightPoint, setSelectedLightPoint] = useState<DesignLightPoint | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState('');

  const [currentInteriorPhotoIndex, setCurrentInteriorPhotoIndex] = useState(0);
  const [lightGlows, setLightGlows] = useState<{ x: number, y: number, color: string, size: number }[]>([]);

  const saveLightPointsToProject = useCallback((updatedLightPoints: DesignLightPoint[]) => {
    if (!project) return;
    try {
        const existingProjectsJSON = localStorage.getItem(PROJECT_STORAGE_KEY);
        const existingProjects: Project[] = existingProjectsJSON ? JSON.parse(existingProjectsJSON) : [];
        const projectIndex = existingProjects.findIndex(p => p.id === project.id);

        if (projectIndex !== -1) {
            const updatedProject = {
                ...existingProjects[projectIndex],
                designData: { ...existingProjects[projectIndex].designData, lightPoints: updatedLightPoints },
                updatedAt: new Date()
            };
            existingProjects[projectIndex] = updatedProject;
            localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(existingProjects));
            setProject(updatedProject); // Update local project state as well
        }
    } catch (e) {
        console.error("Failed to save light points to localStorage:", e);
    }
  }, [project]);


  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const storedProjectsJSON = localStorage.getItem(PROJECT_STORAGE_KEY);
    if (storedProjectsJSON) {
      try {
        const allProjects: Project[] = JSON.parse(storedProjectsJSON);
        const currentProject = allProjects.find(p => p.id === projectId);

        if (currentProject) {
          setProject(currentProject);
          setLightPoints(currentProject.designData?.lightPoints || []);
        } else {
          setError(`Không tìm thấy dự án với ID: ${projectId}. Vui lòng kiểm tra lại hoặc tạo dự án mới.`);
          setTimeout(() => navigate('/projects'), 3000);
        }
      } catch (e) {
        console.error("Failed to parse projects from localStorage:", e);
        setError("Dữ liệu dự án trong localStorage bị lỗi. Vui lòng thử xóa cache trình duyệt hoặc tạo lại dự án.");
        setTimeout(() => navigate('/projects'), 3000);
      }
    } else {
      setError("Không có danh sách dự án nào. Vui lòng tạo dự án mới.");
      setTimeout(() => navigate('/new-project'), 3000);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (project && !error) { 
      setIsLoading(true); // Set loading true before calculations
      simulateLightingCalculations(project)
        .then(results => {
          setCalculations(results);
        })
        .catch(err => {
          console.error("Lighting calculation error:", err);
          setError("Lỗi khi tính toán chiếu sáng. Vui lòng thử lại.");
        })
        .finally(() => {
          setIsLoading(false); 
        });
    } else if (error || (!project && !isLoading)) { // check !isLoading to prevent setting it false if initial load is still running
        setIsLoading(false);
    }
  }, [project, error]); // Removed isLoading from dependency array to prevent loop


  const handleFloorPlanClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!project?.floorPlan) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const newLightPoint: DesignLightPoint = {
      id: `light-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      type: LightProductType.DOWNLIGHT, 
    };
    const updatedLightPoints = [...lightPoints, newLightPoint];
    setLightPoints(updatedLightPoints);
    saveLightPointsToProject(updatedLightPoints);
    setSelectedLightPoint(newLightPoint);
  };

  const handleLightPointSelect = (lightPoint: DesignLightPoint) => {
    setSelectedLightPoint(lightPoint);
  };
  
  const updateSelectedLightPointType = (type: LightProductType) => {
    if (selectedLightPoint) {
      const updatedLPs = lightPoints.map(lp => 
        lp.id === selectedLightPoint.id ? { ...lp, type } : lp
      );
      setLightPoints(updatedLPs);
      saveLightPointsToProject(updatedLPs);
      setSelectedLightPoint(prev => prev ? {...prev, type} : null);
    }
  };

  const removeSelectedLightPoint = () => {
    if (selectedLightPoint) {
        const updatedLPs = lightPoints.filter(lp => lp.id !== selectedLightPoint.id);
        setLightPoints(updatedLPs);
        saveLightPointsToProject(updatedLPs);
        setSelectedLightPoint(null);
    }
  };
  
  const handleGenerateReport = () => {
    if (project && calculations) {
      // Ensure project data used for report includes the latest lightPoints
      const projectForReport: Project = {
        ...project,
        designData: { ...project.designData, lightPoints }
      };
      const content = generateReportContent(projectForReport, calculations);
      setReportContent(content);
      setShowReportModal(true);
    }
  };

  const handleExportReport = () => {
      if(project?.projectName) {
        exportReportAsPDFMock(reportContent, project.projectName);
      }
  };

  const handleInteriorImageClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Simple heuristic for glow color based on selected light point type or default
    let glowColor = 'rgba(255, 223, 100, 0.7)'; // Default warm glow
    if (selectedLightPoint) {
        const productDetails = MOCK_PRODUCTS.find(p => p.type === selectedLightPoint.type);
        if (productDetails && project) {
            if (project.lightingPreferences.lightTemperature === "Lạnh (5000-6500K)") {
                glowColor = 'rgba(173, 216, 230, 0.7)'; // Light blue for cool
            } else if (project.lightingPreferences.lightTemperature === "Trung tính (3500-4500K)") {
                glowColor = 'rgba(255, 250, 200, 0.7)'; // Creamy for neutral
            }
        }
    }

    setLightGlows(prev => [...prev, { x, y, color: glowColor, size: 50 }]);
  };

  if (isLoading) {
    let loadingMessage = "Đang tải dữ liệu...";
    if (!project && !error) { 
        loadingMessage = "Đang tải dữ liệu dự án...";
    } else if (project && !calculations && !error) {
        loadingMessage = "Đang phân tích và tính toán chiếu sáng...";
    }
    return (
        <div className="container mx-auto p-8 text-center">
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" role="status" aria-label="Đang tải"></div>
                <p className="ml-4 text-lg text-gray-600">{loadingMessage}</p>
            </div>
        </div>
    );
  }
  
  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500 text-xl" role="alert">{error}</div>;
  }

  if (!project || !calculations) { 
    return <div className="container mx-auto p-8 text-center text-gray-500 text-xl" role="alert">Không thể hiển thị trang thiết kế. Dữ liệu không đầy đủ hoặc có lỗi không mong muốn đã xảy ra. Vui lòng thử lại.</div>;
  }
  
  const currentInteriorPhoto = project.interiorPhotos[currentInteriorPhotoIndex];


  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Thiết kế Chiếu sáng: {project.projectName}</h1>
        <p className="text-gray-600">Phòng: {project.spaceInfo.roomType} - Diện tích: {project.spaceInfo.area || 'N/A'} m²</p>
      </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Mặt bằng & Bố trí đèn">
              {project.floorPlan?.url ? (
                <div 
                    className="relative w-full aspect-[4/3] bg-gray-200 border border-gray-300 rounded overflow-hidden cursor-crosshair"
                    onClick={handleFloorPlanClick}
                    title="Click để thêm đèn"
                    role="button"
                    tabIndex={0}
                    aria-label="Khu vực bản vẽ, click để thêm đèn"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFloorPlanClick(e as any);}}

                >
                  <img src={project.floorPlan.url} alt="Mặt bằng" className="w-full h-full object-contain" />
                  {lightPoints.map(lp => (
                    <div
                      key={lp.id}
                      className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-white text-xs transform -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-lg hover:scale-110 transition-transform
                        ${selectedLightPoint?.id === lp.id ? 'ring-2 ring-offset-1 ring-red-500 scale-125' : ''} 
                        ${lp.type === LightProductType.DOWNLIGHT ? 'bg-yellow-500' : lp.type === LightProductType.SPOTLIGHT ? 'bg-blue-500' : lp.type === LightProductType.STRIPLIGHT ? 'bg-purple-500' : lp.type === LightProductType.PENDANT ? 'bg-pink-500' : lp.type === LightProductType.WALL_LIGHT ? 'bg-teal-500' : 'bg-green-500'}`}
                      style={{ left: `${lp.x}%`, top: `${lp.y}%` }}
                      onClick={(e) => { e.stopPropagation(); handleLightPointSelect(lp); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleLightPointSelect(lp);}}}
                      role="button"
                      tabIndex={0}
                      aria-label={`Đèn loại ${lp.type}, nhấn để chọn`}
                      title={`${lp.type} - Click hoặc Enter để chọn`}
                    >
                      <i className={LIGHT_ICON_MAP[lp.type] || 'fa-solid fa-question'}></i>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 p-4 text-center">Không có bản vẽ mặt bằng. Vui lòng quay lại và tải lên ở bước tạo dự án.</p>
              )}
            </Card>

            {project.interiorPhotos.length > 0 && (
                 <Card title="Trực quan hóa Concept (Mô phỏng)" className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-600">Click lên ảnh để thêm hiệu ứng ánh sáng (mô phỏng).</p>
                        {project.interiorPhotos.length > 1 && (
                             <div>
                                <Button size="sm" onClick={() => setCurrentInteriorPhotoIndex(prev => (prev - 1 + project.interiorPhotos.length) % project.interiorPhotos.length)} disabled={project.interiorPhotos.length <=1} aria-label="Ảnh nội thất trước">Ảnh trước</Button>
                                <Button size="sm" onClick={() => setCurrentInteriorPhotoIndex(prev => (prev + 1) % project.interiorPhotos.length)} className="ml-2" disabled={project.interiorPhotos.length <=1} aria-label="Ảnh nội thất sau">Ảnh sau</Button>
                             </div>
                        )}
                    </div>
                    {currentInteriorPhoto && (
                         <div 
                            className="relative w-full aspect-video bg-gray-200 border border-gray-300 rounded overflow-hidden cursor-pointer"
                            onClick={handleInteriorImageClick}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteriorImageClick(e as any);}}
                            role="button"
                            tabIndex={0}
                            aria-label="Khu vực ảnh nội thất, click để thêm hiệu ứng sáng"
                         >
                            <img src={currentInteriorPhoto.url} alt={`Nội thất ${currentInteriorPhotoIndex + 1}`} className="w-full h-full object-contain" />
                            {lightGlows.map((glow, index) => (
                                <div
                                    key={index}
                                    className="absolute rounded-full pointer-events-none"
                                    style={{
                                        left: `${glow.x}%`,
                                        top: `${glow.y}%`,
                                        width: `${glow.size}px`,
                                        height: `${glow.size}px`,
                                        backgroundColor: glow.color,
                                        filter: 'blur(15px)',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                    )}
                    {lightGlows.length > 0 && <Button size="sm" variant="secondary" onClick={() => setLightGlows([])} className="mt-2">Xóa hiệu ứng</Button>}
                 </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card title="Thông số Chiếu sáng (Ước tính)">
              <p className="text-gray-700"><strong>Độ rọi trung bình:</strong> {calculations.averageLux.toFixed(0)} Lux</p>
              <p className="text-gray-700"><strong>Độ đồng đều (U0):</strong> {calculations.uniformity.toFixed(2)}</p>
              <p className="text-gray-700"><strong>Nhiệt độ màu mục tiêu:</strong> {project.lightingPreferences.lightTemperature}</p>
              <p className="mt-2 text-sm text-gray-500">Các giá trị này được tính toán dựa trên tiêu chuẩn và lựa chọn của bạn.</p>
            </Card>

            {selectedLightPoint && (
                <Card title={`Chỉnh sửa đèn: ${selectedLightPoint.type}`}>
                    <Select
                        label="Loại đèn"
                        name={`light_type_${selectedLightPoint.id}`}
                        options={Object.values(LightProductType).map(lt => ({value: lt, label: lt}))}
                        value={selectedLightPoint.type}
                        onChange={(e) => updateSelectedLightPointType(e.target.value as LightProductType)}
                    />
                    <Button variant="danger" size="sm" onClick={removeSelectedLightPoint} className="mt-3 w-full">
                        <i className="fas fa-trash-alt mr-2"></i> Xóa đèn này
                    </Button>
                </Card>
            )}

            <Card title="Sản phẩm Đề xuất">
              {calculations.recommendedProducts.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto" aria-label="Danh sách sản phẩm đề xuất">
                  {calculations.recommendedProducts.map((product, index) => (
                    <li key={`${product.id}-${index}`} className="flex items-start p-2 border rounded-md hover:bg-gray-50">
                      <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded mr-3" />
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.type} - {product.power}W - {product.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Không có sản phẩm nào được đề xuất tự động.</p>
              )}
              <p className="mt-3 font-semibold text-gray-800">Tổng chi phí dự kiến: {calculations.totalCost.toLocaleString('vi-VN')} VNĐ</p>
            </Card>
            
            <Card title="Hành động">
                <Button onClick={handleGenerateReport} variant="primary" className="w-full">
                    <i className="fas fa-file-alt mr-2"></i> Tạo Báo cáo Thiết kế
                </Button>
                <Button onClick={() => navigate('/projects')} variant="secondary" className="w-full mt-3">
                    <i className="fas fa-list-alt mr-2"></i> Danh sách dự án
                </Button>
            </Card>
          </div>
        </div>
      
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Báo cáo Thiết kế Sơ bộ" size="xl">
        <div className="max-h-[70vh] overflow-y-auto p-1">
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm font-mono text-gray-800">{reportContent}</pre>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowReportModal(false)}>Đóng</Button>
            <Button variant="primary" onClick={handleExportReport}><i className="fas fa-download mr-2"></i>Tải xuống (TXT)</Button>
        </div>
      </Modal>

    </div>
  );
};

export default DesignPage;
