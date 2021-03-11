export interface ReviewModel{
  reviewId: number;
  type: string;
  content: string;
  questions: string;
  hired: boolean;
  interviewed: boolean;
  studentId: number;
  profileId: number;
}
