import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
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
  private sessionExpirationKey = 'session_expiration';
  private logoutTimeout: any;
  private sessionExpirationSource = new BehaviorSubject<boolean>(false);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  public checkSessionExpiration(): void {
    if (!this.isLoggedIn()) {
      this.logout();
    }
    if (this.isSessionExpired()) {
      this.logout();
      this.setSessionExpirationSource(true);
    } else {
      const remainingTime = this.getSessionRemainingTime();
      if (this.logoutTimeout) {
        clearTimeout(this.logoutTimeout);
      }
      this.logoutTimeout = setTimeout(() => {
        this.logout();
        this.setSessionExpirationSource(true);
      }, remainingTime);
    }
  }

  public setSessionExpiration(durationInMinutes: number): void {
    const expirationTime = new Date().getTime() + durationInMinutes * 60 * 1000;
    localStorage.setItem(this.sessionExpirationKey, expirationTime.toString());
  }

  public isSessionExpired(): boolean {
    const expirationTime = parseInt(
      localStorage.getItem(this.sessionExpirationKey) || '0',
      10,
    );
    return new Date().getTime() > expirationTime;
  }

  public getSessionRemainingTime(): number {
    const expirationTime = parseInt(
      localStorage.getItem(this.sessionExpirationKey) || '0',
      10,
    );
    return expirationTime - new Date().getTime();
  }

  public clearSessionExpiration(): void {
    localStorage.removeItem(this.sessionExpirationKey);
  }

  public setSessionExpirationSource(isExpired: boolean): void {
    this.sessionExpirationSource.next(isExpired);
  }

  public getSessionExpirationSource() {
    return this.sessionExpirationSource.asObservable();
  }

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
    return this.http.post<ILoginResponse>(
      `http://localhost:3000/authentication/login`,
      user,
    );
  }

  public logout() {
    if (this.logoutTimeout) {
      clearTimeout(this.logoutTimeout);
    }
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

  public getUserSpecialization() {
    const decodedToken = this.decodeToken();
    return decodedToken ? [decodedToken.specialization] : undefined;
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
