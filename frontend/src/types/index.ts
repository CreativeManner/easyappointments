// Core appointment system types
export interface Appointment {
  id: number;
  book_datetime: string;
  start_datetime: string;
  end_datetime: string;
  notes?: string;
  hash: string;
  location?: string;
  color?: string;
  status: AppointmentStatus;
  is_unavailable: boolean;
  id_users_provider: number;
  id_users_customer: number;
  id_services: number;
  id_google_calendar?: string;
  created_at: string;
  updated_at: string;
  provider?: Provider;
  customer?: Customer;
  service?: Service;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  timezone?: string;
  language?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  mobile_number?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  timezone?: string;
  settings?: Record<string, any>;
  working_plan?: WorkingPlan;
  services: number[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price?: number;
  currency?: string;
  description?: string;
  location?: string;
  color?: string;
  category_id?: number;
  category_name?: string;
  availabilities_type: "flexible" | "fixed";
  attendants_number: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkingPlan {
  monday?: WorkingPlanDay;
  tuesday?: WorkingPlanDay;
  wednesday?: WorkingPlanDay;
  thursday?: WorkingPlanDay;
  friday?: WorkingPlanDay;
  saturday?: WorkingPlanDay;
  sunday?: WorkingPlanDay;
}

export interface WorkingPlanDay {
  start: string;
  end: string;
  breaks: WorkingPlanBreak[];
}

export interface WorkingPlanBreak {
  start: string;
  end: string;
}

export interface Unavailability {
  id: number;
  start_datetime: string;
  end_datetime: string;
  notes?: string;
  id_users_provider: number;
  id_google_calendar?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  company_name: string;
  company_email: string;
  company_link?: string;
  company_color?: string;
  display_cookie_notice: boolean;
  cookie_notice_content?: string;
  display_terms_and_conditions: boolean;
  terms_and_conditions_content?: string;
  display_privacy_policy: boolean;
  privacy_policy_content?: string;
  [key: string]: any;
}

// Enums and constants
export enum AppointmentStatus {
  BOOKED = "booked",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
  NO_SHOW = "no-show",
}

export enum UserRole {
  ADMIN = "admin",
  PROVIDER = "provider",
  SECRETARY = "secretary",
  CUSTOMER = "customer",
}

// Booking flow types
export interface BookingState {
  currentStep: number;
  selectedService?: Service;
  selectedProvider?: Provider;
  selectedDate?: Date;
  selectedTime?: string;
  customerInfo?: CustomerInfo;
  appointmentData?: Partial<Appointment>;
  errors?: Record<string, string>;
  isLoading: boolean;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  notes?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  provider_id?: number;
}

export interface AvailabilityData {
  date: string;
  slots: TimeSlot[];
  provider_id?: number;
}

// AI Features types
export interface AIAnalytics {
  noShowPrediction: {
    probability: number;
    factors: string[];
    confidence: number;
  };
  demandForecast: {
    nextWeek: DemandForecast[];
    nextMonth: DemandForecast[];
  };
  customerInsights: {
    loyaltyScore: number;
    preferredTimes: string[];
    servicePreferences: string[];
    churnRisk: number;
  };
}

export interface DemandForecast {
  date: string;
  expectedBookings: number;
  confidence: number;
  recommendedStaffing: number;
}

export interface AIRecommendation {
  type: 'time_slot' | 'service' | 'provider' | 'pricing';
  title: string;
  description: string;
  confidence: number;
  data: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  customerId?: number;
  messages: ChatMessage[];
  status: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// UI Component types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' | 'time';
  options?: Array<{ value: string | number; label: string }>;
  error?: string;
  disabled?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  completed?: boolean[];
}

export interface StepperStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  unavailableDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSlotSelect: (slot: string) => void;
  date: Date;
  isLoading?: boolean;
  className?: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Theme types
export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  radius: string;
}

export interface ThemeConfig {
  theme: Theme;
  darkMode: boolean;
  animations: boolean;
  compactMode: boolean;
}