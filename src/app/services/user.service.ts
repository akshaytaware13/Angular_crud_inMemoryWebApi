import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASE_URL: string = 'http://localhost:4200/api/';
  constructor(private _httSerice: HttpClient) {}

  getUsers() {
    return this._httSerice.get(this.BASE_URL + 'users');
  }

  getUser(userId: number) {
    return this._httSerice.delete(`${this.BASE_URL}users/${userId}`);
  }

  addUser(user: User) {
    return this._httSerice.post(`${this.BASE_URL}users/`, user);
  }

  updateUser(user: User) {
    return this._httSerice.put(`${this.BASE_URL}users/${user.id}`, user);
  }

  deleteUsers(userId: number) {
    return this._httSerice.delete(`${this.BASE_URL}users/${userId}`);
  }
}
