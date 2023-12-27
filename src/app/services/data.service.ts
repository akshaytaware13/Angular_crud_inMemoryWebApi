import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService implements InMemoryDbService {
  constructor() {}
  createDb() {
    let users: User[] = [
      {
        id: 1,
        title: 'Mr.',
        firstName: 'Akshay',
        lastName: 'Taware',
        email: 'Akshay@gmail.com',
        dob: '13/02/1996',
        password: 123,
        acceptTerms: false,
      },
      {
        id: 2,
        title: 'Mr.',
        firstName: 'Ajay',
        lastName: 'Nomulwar',
        email: 'Ajay@gmail.com',
        dob: '14/08/1997',
        password: 123,
        acceptTerms: true,
      }
    ];
    return { users };
  }
}
