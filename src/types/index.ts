export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface Student extends User {
  role: 'student';
  testDate?: Date;
  targetScore?: number;
  weakAreas: string[];
  studyHours: number;
  completedSessions: number;
  assignedTutor?: string;
}

export interface Tutor extends User {
  role: 'tutor';
  specialties: string[];
  rating: number;
  totalSessions: number;
  students: string[];
  availability: TimeSlot[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'outline' | 'flashcards';
  subject: MCATSubject;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  uploadedBy: string;
  uploadedAt: Date;
  fileUrl?: string;
  tags: string[];
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: MCATSubject;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  questions: Question[];
  answers: (number | null)[];
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  timeSpent: number;
  reviewNotes?: string;
}

export interface TutoringSession {
  id: string;
  studentId: string;
  tutorId: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  topics: string[];
  notes?: string;
  resources: string[];
  nextSteps?: string;
}

export interface StudyPlan {
  id: string;
  studentId: string;
  targetDate: Date;
  schedule: StudyScheduleItem[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyScheduleItem {
  id: string;
  date: Date;
  subject: MCATSubject;
  topics: string[];
  duration: number;
  type: 'study' | 'practice' | 'review' | 'tutoring';
  completed: boolean;
  resources?: string[];
}

export type MCATSubject = 
  | 'Biology' 
  | 'Chemistry' 
  | 'Physics' 
  | 'Psychology' 
  | 'Sociology' 
  | 'Biochemistry' 
  | 'CARS';

export interface Analytics {
  studentId: string;
  overallProgress: number;
  subjectProgress: Record<MCATSubject, number>;
  practiceScores: PracticeScore[];
  studyTime: StudyTimeData[];
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
}

export interface PracticeScore {
  date: Date;
  subject: MCATSubject;
  score: number;
  totalQuestions: number;
}

export interface StudyTimeData {
  date: Date;
  subject: MCATSubject;
  duration: number;
}