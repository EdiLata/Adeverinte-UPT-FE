import {inject, Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class SecretaryReportGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isSecretary = this.authService.isSecretary();
    if (isSecretary) {
      return true;
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
