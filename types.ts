
export enum ProjectType {
  APARTMENT = "Chung cư",
  TOWNHOUSE = "Nhà phố",
  VILLA = "Biệt thự",
  RESORT = "Resort",
  OFFICE = "Văn phòng",
  HOTEL = "Khách sạn",
  STORE = "Cửa hàng",
  OTHER = "Khác",
}

export enum RoomType {
  LIVING_ROOM = "Phòng khách",
  KITCHEN = "Bếp",
  BEDROOM = "Phòng ngủ",
  HALLWAY = "Hành lang",
  BATHROOM = "Nhà vệ sinh",
  DINING_ROOM = "Phòng ăn",
  OFFICE_ROOM = "Phòng làm việc",
  OTHER = "Khác",
}

export enum LightTemperature {
  WARM = "Ấm áp (2700-3000K)",
  NEUTRAL = "Trung tính (3500-4500K)",
  COOL = "Lạnh (5000-6500K)",
}

export enum LightBrightness {
  HIGH = "Cao",
  MEDIUM = "Vừa phải",
  LOW = "Thấp",
}

export enum LightingStyle {
  MINIMALIST = "Tối giản",
  MODERN = "Hiện đại",
  CLASSIC = "Cổ điển",
  INDUSTRIAL = "Công nghiệp",
  SCANDINAVIAN = "Scandinavian",
}

export enum SpaceUsagePurpose {
  READING = "Đọc sách",
  RELAXATION = "Thư giãn",
  WORK = "Làm việc",
  DINING = "Ăn uống",
  ENTERTAINMENT = "Giải trí",
  DISPLAY = "Trưng bày",
}

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
}

export interface SpaceInfo {
  projectType: ProjectType;
  customProjectType?: string;
  roomType: RoomType;
  customRoomType?: string;
  area?: number; // m2
  dimensions?: { length: number; width: number }; // meters
}

export interface LightingPreferences {
  ageGroup: string; // e.g., "25-35", "50+"
  lightTemperature: LightTemperature;
  lightBrightness: LightBrightness;
  lightingStyle: LightingStyle;
  spaceUsagePurpose: SpaceUsagePurpose[];
}

export interface FloorPlan {
  file: File;
  url: string; // data URL for preview
  dimensionsRecognized?: boolean; // if dimensions were auto-detected (mocked)
}

export interface InteriorPhoto {
  file: File;
  url: string; // data URL for preview
}

export interface DesignLightPoint {
  id: string;
  x: number; // percentage
  y: number; // percentage
  type: LightProductType; // e.g., 'downlight', 'spotlight'
  productId?: string; // Link to a product in catalog
}

export interface DesignData {
  lightPoints: DesignLightPoint[];
  // other design parameters
}

export interface Project {
  id: string;
  projectName: string;
  clientInfo: ClientInfo;
  spaceInfo: SpaceInfo;
  lightingPreferences: LightingPreferences;
  floorPlan?: FloorPlan;
  interiorPhotos: InteriorPhoto[];
  designData?: DesignData; // Populated during design phase
  createdAt: Date;
  updatedAt: Date;
}

// Simplified Product Structure
export enum LightProductType {
    DOWNLIGHT = "Downlight",
    SPOTLIGHT = "Spotlight",
    STRIPLIGHT = "Đèn LED dây",
    PENDANT = "Đèn thả",
    WALL_LIGHT = "Đèn tường",
    AMBIENT = "Đèn Ambient"
}

export interface Product {
  id: string;
  name: string;
  type: LightProductType;
  power: number; // Watts
  lumens: number; // Lumens
  colorTemperature: number; // Kelvin (e.g., 3000, 4000, 6500)
  cri: number; // Color Rendering Index
  beamAngle?: number;
  imageUrl: string;
  price: number; // VND or USD
}

export interface LightingCalculationResults {
    averageLux: number;
    uniformity: number; // U0
    recommendedProducts: Product[];
    totalCost: number;
}

export interface LightingStandard {
  roomType: RoomType;
  minLux: number;
  targetLux: number;
  maxLux: number;
  minCCT: number; // Kelvin
  maxCCT: number; // Kelvin
  minCRI: number;
  uniformity?: number; // U0
}

// User Roles for UI differentiation
export enum UserRole {
  GUEST = "Guest",
  END_USER = "End-User",
  SALES_CONSULTANT = "Sales Consultant",
  DESIGNER = "Designer",
  ADMIN = "Admin",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export interface AppState {
  currentProject: Project | null;
  projects: Project[];
  currentUser: User | null; // Simplified user state
  isLoading: boolean;
  error: string | null;
}
