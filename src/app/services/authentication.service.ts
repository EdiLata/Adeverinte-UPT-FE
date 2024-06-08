import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {ILoginResponse} from '../interfaces/login-response.model';
import {jwtDecode} from 'jwt-decode';
import {UserRole} from '../enums/user-role.enum';
import {ILoginRequest} from '../interfaces/login-request.model';
import {IRegisterRequest} from '../interfaces/register-request.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  public registerUser(user: IRegisterRequest) {
    return this.http.post<any>(
      `http://localhost:3000/authentication/register`,
      user,
    );
  }

  public resetPassword(user: ILoginRequest) {
    return this.http.post<any>(
      `http://localhost:3000/authentication/reset-password`,
      user,
    );
  }

  public loginUser(user: ILoginRequest) {
    return this.http
      .post<ILoginResponse>(`http://localhost:3000/authentication/login`, user)
      .pipe(
        tap((response) => {
          localStorage.setItem('access_token', response.access_token);
        }),
      );
  }

  public logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['']);
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode(token);
    }
    return null;
  }

  public getUserRole(): UserRole {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.role : null;
  }

  public getUserId(): number {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.id : null;
  }

  public getUserEmail(): string {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.email : null;
  }

  public isStudent() {
    return this.getUserRole() === UserRole.STUDENT;
  }

  public isAdmin() {
    return this.getUserRole() === UserRole.ADMIN;
  }

  public isSecretary() {
    return this.getUserRole() === UserRole.SECRETARY;
  }
}
