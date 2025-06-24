import { Project, Product, LightProductType, LightingStandard, RoomType, ProjectType, LightTemperature, LightBrightness, LightingStyle, SpaceUsagePurpose, ClientInfo, SpaceInfo, LightingPreferences } from './types';

export const APP_NAME = "Lumi Lighting";
export const PROJECT_STORAGE_KEY = 'LumiFlowProjects';


export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod001', name: 'LED Downlight Âm Trần 12W Tròn', type: LightProductType.DOWNLIGHT, power: 12, lumens: 1080, colorTemperature: 4000, cri: 85, beamAngle: 120, imageUrl: 'https://picsum.photos/seed/downlight1/200/200', price: 250000 },
  { id: 'prod002', name: 'Đèn Spotlight Ray 7W', type: LightProductType.SPOTLIGHT, power: 7, lumens: 630, colorTemperature: 3000, cri: 90, beamAngle: 36, imageUrl: 'https://picsum.photos/seed/spotlight1/200/200', price: 320000 },
  { id: 'prod003', name: 'LED Dây Dán 5m RGB', type: LightProductType.STRIPLIGHT, power: 24, lumens: 1200, colorTemperature: 0, cri: 80, imageUrl: 'https://picsum.photos/seed/striplight1/200/200', price: 450000 },
  { id: 'prod004', name: 'Đèn Thả Trang Trí Hiện Đại', type: LightProductType.PENDANT, power: 15, lumens: 1350, colorTemperature: 3500, cri: 80, imageUrl: 'https://picsum.photos/seed/pendant1/200/200', price: 1200000 },
  { id: 'prod005', name: 'Đèn Tường LED Vuông', type: LightProductType.WALL_LIGHT, power: 8, lumens: 700, colorTemperature: 3000, cri: 85, imageUrl: 'https://picsum.photos/seed/walllight1/200/200', price: 550000 },
  { id: 'prod006', name: 'LED Panel 600x600 40W', type: LightProductType.AMBIENT, power: 40, lumens: 3600, colorTemperature: 4000, cri: 80, beamAngle: 120, imageUrl: 'https://picsum.photos/seed/panel1/200/200', price: 900000 },
  { id: 'prod007', name: 'LED Downlight Âm Trần 9W Vuông', type: LightProductType.DOWNLIGHT, power: 9, lumens: 810, colorTemperature: 3000, cri: 85, beamAngle: 120, imageUrl: 'https://picsum.photos/seed/downlight2/200/200', price: 220000 },
  { id: 'prod008', name: 'Đèn Spotlight COB 15W', type: LightProductType.SPOTLIGHT, power: 15, lumens: 1350, colorTemperature: 4000, cri: 92, beamAngle: 24, imageUrl: 'https://picsum.photos/seed/spotlight2/200/200', price: 480000 },
];

export const MOCK_LIGHTING_STANDARDS: LightingStandard[] = [
  { roomType: RoomType.LIVING_ROOM, minLux: 100, targetLux: 300, maxLux: 500, minCCT: 2700, maxCCT: 4500, minCRI: 80, uniformity: 0.4 },
  { roomType: RoomType.KITCHEN, minLux: 300, targetLux: 500, maxLux: 750, minCCT: 3000, maxCCT: 5000, minCRI: 80, uniformity: 0.6 },
  { roomType: RoomType.BEDROOM, minLux: 50, targetLux: 150, maxLux: 300, minCCT: 2700, maxCCT: 4000, minCRI: 80, uniformity: 0.3 },
  { roomType: RoomType.BATHROOM, minLux: 150, targetLux: 300, maxLux: 500, minCCT: 3000, maxCCT: 5000, minCRI: 80, uniformity: 0.4 },
  { roomType: RoomType.HALLWAY, minLux: 100, targetLux: 150, maxLux: 200, minCCT: 2700, maxCCT: 4000, minCRI: 80, uniformity: 0.25 },
  { roomType: RoomType.OFFICE_ROOM, minLux: 300, targetLux: 500, maxLux: 750, minCCT: 3500, maxCCT: 5500, minCRI: 85, uniformity: 0.6 },
  { roomType: RoomType.DINING_ROOM, minLux: 150, targetLux: 300, maxLux: 500, minCCT: 2700, maxCCT: 4000, minCRI: 80, uniformity: 0.4 },
];

export const DEFAULT_PROJECT_NAME = "Dự án Chiếu Sáng Mới";
export const SUPPORTED_FLOOR_PLAN_FORMATS = "image/jpeg, image/png, application/pdf";
export const SUPPORTED_INTERIOR_PHOTO_FORMATS = "image/jpeg, image/png";
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const AGE_GROUPS = ["Dưới 18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

export const LIGHT_ICON_MAP: Record<LightProductType, string> = {
    [LightProductType.DOWNLIGHT]: "fa-solid fa-lightbulb", 
    [LightProductType.SPOTLIGHT]: "fa-solid fa-highlighter", 
    [LightProductType.STRIPLIGHT]: "fa-solid fa-ellipsis-h", 
    [LightProductType.PENDANT]: "fa-solid fa-lamp", 
    [LightProductType.WALL_LIGHT]: "fa-solid fa-house-signal", 
    [LightProductType.AMBIENT]: "fa-solid fa-circle-nodes", 
};

const sampleClientInfo: ClientInfo = {
  name: "Khách Hàng Mẫu",
  phone: "0123456789",
  email: "sample@example.com",
};

const sampleSpaceInfo: SpaceInfo = {
  projectType: ProjectType.APARTMENT,
  roomType: RoomType.LIVING_ROOM,
  area: 25,
  dimensions: { length: 5, width: 5 },
};

const sampleLightingPreferences: LightingPreferences = {
  ageGroup: "25-34",
  lightTemperature: LightTemperature.NEUTRAL,
  lightBrightness: LightBrightness.MEDIUM,
  lightingStyle: LightingStyle.MODERN,
  spaceUsagePurpose: [SpaceUsagePurpose.RELAXATION, SpaceUsagePurpose.ENTERTAINMENT],
};

export const SAMPLE_PROJECT: Project = {
  id: "sample-project-001",
  projectName: "Dự án Mẫu: Phòng Khách Chung Cư",
  clientInfo: sampleClientInfo,
  spaceInfo: sampleSpaceInfo,
  lightingPreferences: sampleLightingPreferences,
  // No floor plan or interior photos for the initial sample to keep it simple
  floorPlan: undefined, 
  interiorPhotos: [],
  designData: {
    lightPoints: [
      { id: 'spl1', x: 20, y: 30, type: LightProductType.DOWNLIGHT, productId: 'prod001' },
      { id: 'spl2', x: 80, y: 70, type: LightProductType.SPOTLIGHT, productId: 'prod002' },
    ]
  },
  createdAt: new Date(2023, 10, 15), // Example past date
  updatedAt: new Date(2023, 10, 16),
};