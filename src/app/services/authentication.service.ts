import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../interfaces/user.model';
import {tap} from 'rxjs';
import {ILoginResponse} from '../interfaces/login-response.model';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);

  constructor() {}

  public registerUser(user: IUser) {
    return this.http.post<any>(
      `http://localhost:3000/authentication/register`,
      user,
    );
  }

  public loginUser(user: IUser) {
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

  public getUserRoles(): string[] {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.roles : null;
  }

  public getUserEmail(): string[] {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.email : null;
  }
}
