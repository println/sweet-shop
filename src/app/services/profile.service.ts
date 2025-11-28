import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor() {
    this.loadProfile();
  }

  private loadProfile() {
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      try {
        this.profileSubject.next(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Error loading profile', e);
      }
    }
  }

  saveProfile(profile: UserProfile) {
    localStorage.setItem('profile', JSON.stringify(profile));
    this.profileSubject.next(profile);
  }

  getProfile(): UserProfile | null {
    return this.profileSubject.value;
  }
}
