import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AuthService } from './auth.service';

const USER_KEY = 'auth-user';
const SECRET_KEY = 'my-secret-key';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  logout(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    const serializedUser = JSON.stringify(user);
    const encryptedUser = this.encrypt(serializedUser);
    const checksum = this.generateChecksum(serializedUser);

    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, `${encryptedUser}:${checksum}`);
  }

  public getUser(): any {
    const userWithChecksum = window.sessionStorage.getItem(USER_KEY);
    if (userWithChecksum) {
      const [encryptedUser, checksum] = userWithChecksum.split(':');
      const serializedUser = this.decrypt(encryptedUser);
      if (this.verifyChecksum(serializedUser, checksum)) {
        return JSON.parse(serializedUser);
      }
    } else {
      this.logout();
    }

    return {};
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  private encrypt(data: string): string {
    const cipher = CryptoJS.AES.encrypt(data, SECRET_KEY);
    return cipher.toString();
  }

  private decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private generateChecksum(data: string): string {
    const hash = CryptoJS.SHA256(data);
    return hash.toString();
  }

  private verifyChecksum(data: string, checksum: string): boolean {
    const calculatedChecksum = this.generateChecksum(data);
    return calculatedChecksum === checksum;
  }
}
