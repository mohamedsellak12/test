import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGardService implements CanActivate {
  
  constructor(private router:Router ) { }
  canActivate(): MaybeAsync<GuardResult> {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if token doesn't exist
      return false;
    }

}}
