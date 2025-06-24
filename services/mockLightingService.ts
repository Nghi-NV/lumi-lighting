
import { Project, LightingCalculationResults, Product, LightProductType, RoomType, SpaceUsagePurpose, LightingStyle } from '../types'; 
import { MOCK_PRODUCTS, MOCK_LIGHTING_STANDARDS } from '../constants';

// Helper to get a lighting standard for a room type
const getStandard = (roomType: RoomType): typeof MOCK_LIGHTING_STANDARDS[0] | undefined => {
  return MOCK_LIGHTING_STANDARDS.find(s => s.roomType === roomType);
};

export const simulateLightingCalculations = (project: Project): Promise<LightingCalculationResults> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { spaceInfo, lightingPreferences } = project;
      const standard = spaceInfo.roomType ? getStandard(spaceInfo.roomType) : undefined;

      let averageLux = 250; // Default
      let uniformity = 0.5; // Default
      let suggestedProducts: Product[] = [];
      let totalCost = 0;

      if (standard && spaceInfo.area) {
        averageLux = standard.targetLux;
        uniformity = standard.uniformity || 0.4;
        
        // Simplified product suggestion
        const lumensNeeded = spaceInfo.area * averageLux;
        
        // Suggest some downlights for general lighting
        const downlights = MOCK_PRODUCTS.filter(p => p.type === LightProductType.DOWNLIGHT);
        if (downlights.length > 0) {
          const mainDownlight = downlights[0];
          const numDownlights = Math.ceil(lumensNeeded / mainDownlight.lumens);
          for (let i = 0; i < numDownlights; i++) {
            suggestedProducts.push({...mainDownlight, id: `${mainDownlight.id}_${i}`}); // Unique IDs for list keys
            totalCost += mainDownlight.price;
          }
        }

        // Add a spotlight if purpose includes 'display' or 'reading'
        if (lightingPreferences.spaceUsagePurpose.includes(SpaceUsagePurpose.DISPLAY) || lightingPreferences.spaceUsagePurpose.includes(SpaceUsagePurpose.READING)) {
          const spotlights = MOCK_PRODUCTS.filter(p => p.type === LightProductType.SPOTLIGHT);
          if (spotlights.length > 0) {
            suggestedProducts.push({...spotlights[0], id: `${spotlights[0].id}_task`});
            totalCost += spotlights[0].price;
          }
        }
        
        // Add strip light if style is modern or for entertainment
         if (lightingPreferences.lightingStyle === LightingStyle.MODERN || lightingPreferences.spaceUsagePurpose.includes(SpaceUsagePurpose.ENTERTAINMENT)) {
          const striplights = MOCK_PRODUCTS.filter(p => p.type === LightProductType.STRIPLIGHT);
          if (striplights.length > 0) {
            suggestedProducts.push({...striplights[0], id: `${striplights[0].id}_accent`});
            totalCost += striplights[0].price;
          }
        }

      } else {
        // Fallback if no standard or area
        suggestedProducts = MOCK_PRODUCTS.slice(0, 3).map((p,i) => ({...p, id: `${p.id}_fallback_${i}`}) );
        totalCost = suggestedProducts.reduce((sum, p) => sum + p.price, 0);
      }
      
      // Adjust lux slightly based on brightness preference
      if(lightingPreferences.lightBrightness === "Cao") averageLux *= 1.2;
      if(lightingPreferences.lightBrightness === "Thấp") averageLux *= 0.8;
      averageLux = Math.round(averageLux);


      resolve({
        averageLux,
        uniformity,
        recommendedProducts: suggestedProducts,
        totalCost,
      });
    }, 1500); // Simulate network delay
  });
};


export const generateReportContent = (project: Project, calculations: LightingCalculationResults): string => {
    let report = `BÁO CÁO THIẾT KẾ CHIẾU SÁNG\n`;
    report += `================================\n\n`;
    report += `DỰ ÁN: ${project.projectName}\n`;
    report += `Khách hàng: ${project.clientInfo.name}\n`;
    report += `Loại công trình: ${project.spaceInfo.projectType}\n`;
    report += `Không gian: ${project.spaceInfo.roomType} - ${project.spaceInfo.area || 'N/A'} m²\n\n`;

    report += `SỞ THÍCH CHIẾU SÁNG:\n`;
    report += `- Nhiệt độ màu: ${project.lightingPreferences.lightTemperature}\n`;
    report += `- Độ sáng: ${project.lightingPreferences.lightBrightness}\n`;
    report += `- Phong cách: ${project.lightingPreferences.lightingStyle}\n`;
    report += `- Mục đích sử dụng: ${project.lightingPreferences.spaceUsagePurpose.join(', ')}\n\n`;

    report += `KẾT QUẢ TÍNH TOÁN & ĐỀ XUẤT:\n`;
    report += `- Độ rọi trung bình (ước tính): ${calculations.averageLux} Lux\n`;
    report += `- Độ đồng đều (ước tính): ${calculations.uniformity}\n\n`;
    
    report += `SẢN PHẨM ĐỀ XUẤT:\n`;
    if (calculations.recommendedProducts.length > 0) {
        calculations.recommendedProducts.forEach(p => {
            report += `- ${p.name} (${p.type}): ${p.power}W, ${p.lumens}lm, ${p.colorTemperature}K, Giá: ${p.price.toLocaleString('vi-VN')}đ\n`;
        });
    } else {
        report += `- Chưa có sản phẩm nào được đề xuất.\n`;
    }
    report += `\nTổng chi phí dự kiến: ${calculations.totalCost.toLocaleString('vi-VN')} VNĐ\n\n`;

    report += `MẶT BẰNG BỐ TRÍ ĐÈN:\n`;
    if (project.floorPlan) {
        report += `(Đính kèm bản vẽ mặt bằng với vị trí đèn được đánh dấu - Mô phỏng)\n`;
        if (project.designData && project.designData.lightPoints.length > 0) {
            project.designData.lightPoints.forEach((lp, index) => {
                const product = calculations.recommendedProducts.find(p => p.id.startsWith(lp.productId || '')) || MOCK_PRODUCTS.find(p=>p.type === lp.type);
                report += `  Đèn ${index + 1}: Loại ${lp.type} (${product?.name || 'N/A'}) tại (x:${lp.x.toFixed(2)}%, y:${lp.y.toFixed(2)}%)\n`;
            });
        } else {
            report += `  Chưa có đèn nào được bố trí trên mặt bằng.\n`;
        }
    } else {
        report += `(Không có bản vẽ mặt bằng được cung cấp)\n`;
    }
    report += `\n`;

    report += `CONCEPT HÌNH ẢNH TRỰC QUAN:\n`;
    if (project.interiorPhotos.length > 0) {
        report += `(Mô phỏng hiệu ứng ánh sáng trên hình ảnh nội thất đã cung cấp - Mô phỏng)\n`;
    } else {
        report += `(Không có hình ảnh nội thất để tạo concept)\n`;
    }
    report += `\n`;

    report += `KỊCH BẢN CHIẾU SÁNG KHUYẾN NGHỊ (VÍ DỤ):\n`;
    report += `- Thư giãn: Bật 50% đèn Downlight (ấm), tắt đèn Spotlight.\n`;
    report += `- Làm việc/Đọc sách: Bật 100% đèn Downlight (trung tính), bật đèn Spotlight khu vực làm việc.\n`;
    report += `- Tiếp khách: Bật 80% đèn Downlight, bật đèn Accent (nếu có).\n\n`;
    
    report += `LƯU Ý: Đây là báo cáo sơ bộ dựa trên thông tin cung cấp và tính toán mô phỏng.\n`;
    return report;
};

// This function would ideally use a library like jsPDF or call a backend service.
// For now, it just triggers a download of a text file.
export const exportReportAsPDFMock = (reportContent: string, projectName: string) => {
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `BaoCao_ThietKe_${projectName.replace(/\s+/g, '_')}.txt`; // Use .txt for mock
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};
