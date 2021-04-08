import {ReviewModel} from "./review.model";

export interface CompanyProfileModel {
  profileId: number;
  hiredStudents: number[];
  reviews: ReviewModel[];
  rating: number;
  bio: string;
}
