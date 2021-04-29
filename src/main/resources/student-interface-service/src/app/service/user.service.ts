import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserModel} from "../model/user.model";
import {ProfileModel} from "../model/profile.model";
import {LoginRequest} from "../model/login-request-payload";
import {map} from "rxjs/operators";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  public getToken(): string {
    return localStorage.getItem('token');
  }

  login(details: LoginRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8083/login',
      {"email": details.email,
            "password": details.password})
      .pipe(map(user => {
              if(user && user.token) {
                localStorage.setItem('token', user.token);
                user.token = null;
                localStorage.setItem('currentUser', JSON.stringify(user));
                localStorage.setItem('email', user.email);
                localStorage.setItem('expiresIn', user.expiresIn);
              }
              this.autoLogout(user.expiresIn);
              return user;
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigateByUrl('/login');
    if(this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  verify(token: string): Observable<any> {
    return this.http.get('http://localhost:8083/verification/' + token);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get('http://localhost:8083/getUserById/' + userId);
  }

  getUserAvatar(userId: number): Observable<any>{
    return this.http.get('http://localhost:8083/getStudentAvatar/' + userId);
  }

  verifyToken(token: string, password: string): Observable<any>{
    return this.http.put('http://localhost:8083/changePassword/' + token, {},
      {params: {password: password}});
  }

  sendVerify(email: string): Observable<any>{
    return this.http.get('http://localhost:8083/sendVerify/',
      {params: {email: email}});
  }


  updateUser(user: UserModel): Observable<any>{
    return this.http.put('http://localhost:8083/update', user);
  }

  getSkillsNames(profile: ProfileModel): Observable<any>{
    return this.http.post('http://localhost:8083/getSkillsNames', profile);
  }

  updateProfile(profile: ProfileModel): Observable<any>{
    return this.http.put('http://localhost:8083/updateProfile', profile);
  }

  uploadImage(imageData: FormData, userId: number): Observable<any> {
    return this.http.post('http://localhost:8083/upload/image/' + userId,
      imageData);
  }

  getHiredStudentsByUni(companyName: string, userId: number): Observable<any> {
    return this.http.get('http://localhost:8083/uniHiredStudents/' + userId,
      {params: {companyName: companyName}});
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
