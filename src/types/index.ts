export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: 'farmer' | 'agronomist' | 'admin';
  state?: string;
  district?: string;
  soil_type?: string;
  farm_size_acres?: number;
  preferred_language?: string;
  is_active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  category?: string;
  audio_url?: string;
  sources?: any[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  category: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface DiseaseTreatment {
  chemical: string[];
  organic: string[];
  dosage?: string;
}

export interface DiseaseAnalysis {
  disease_name: string;
  is_healthy: boolean;
  crop_type?: string;
  confidence: number;
  symptoms: string[];
  treatment: DiseaseTreatment;
  prevention: string[];
  urgency_level: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DiseaseReport {
  id: string;
  user_id: string;
  image_url: string;
  analysis: DiseaseAnalysis;
  created_at: string;
}

export interface DailyForecast {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  humidity: number;
  rain_probability: number;
  condition: string;
  icon: string;
}

export interface WeatherData {
  location: string;
  state: string;
  current_temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_probability: number;
  condition: string;
  uv_index: number;
  agri_recommendations: string[];
  forecast: DailyForecast[];
  updated_at: string;
}

export interface RecommendedCrop {
  rank: number;
  crop_name: string;
  category: string;
  suitability_score: number;
  duration_days: number;
  est_cost_per_acre: number;
  expected_yield_per_acre: string;
  est_profit_per_acre: number;
  key_advantages: string[];
  water_requirement: string;
  market_demand: string;
}

export interface CropRecommendationResult {
  input_summary: any;
  top_crops: RecommendedCrop[];
  generated_at: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  ministry: string;
  category: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  required_documents: string[];
  application_link: string;
  is_national: boolean;
}

export interface CalendarTask {
  id: string;
  user_id: string;
  crop_name: string;
  stage: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  created_at: string;
}

export interface RAGDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size_kb: number;
  num_chunks: number;
  uploaded_at: string;
  status: string;
}

export interface SystemAnalytics {
  total_users: number;
  active_users: number;
  total_chats: number;
  disease_scans: number;
  documents_indexed: number;
  active_tasks: number;
  recent_activity: any[];
  chat_category_breakdown: Record<string, number>;
  disease_detection_trends: any[];
}
