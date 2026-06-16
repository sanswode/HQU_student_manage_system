export interface User {
  id: number;
  username: string;
  role: 'student' | 'teacher';
  name: string;
  created_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  student_no: string;
  name?: string;
  username?: string;
}

export interface Teacher {
  id: number;
  user_id: number;
  teacher_no: string;
  name?: string;
  username?: string;
}

export interface Course {
  id: number;
  name: string;
  teacher_id: number;
  description?: string;
  created_at: string;
  teacher?: Teacher;
  is_enrolled?: boolean;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  score: number | null;
  enrolled_at: string;
  student?: Student;
  course?: Course;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  profile: Student | Teacher;
}

export interface CourseStatistics {
  total_students: number;
  scored_students: number;
  average: number;
  highest: number;
  lowest: number;
  pass_rate: number;
  excellent_rate: number;
  score_distribution: {
    '90-100': number;
    '80-89': number;
    '70-79': number;
    '60-69': number;
    '0-59': number;
  };
}

export interface StudentScoreSummary {
  total_courses: number;
  scored_courses: number;
  average_score: number;
}

export interface StudentScoresResponse {
  scores: Enrollment[];
  statistics: StudentScoreSummary;
}

export interface StudentStatisticsResponse {
  total_courses: number;
  scored_courses: number;
  average: number;
  highest: number;
  lowest: number;
  pass_rate: number;
  scores: Enrollment[];
  score_distribution: {
    '90-100': number;
    '80-89': number;
    '70-79': number;
    '60-69': number;
    '0-59': number;
  };
}
