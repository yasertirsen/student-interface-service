import {UserModel} from "./user.model";
import {ReviewModel} from "./review.model";

export interface CompanyProfileModel {
  profileId: number;
  hiredStudents: UserModel[];
  reviews: ReviewModel[];
  rating: number;
}
