import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/webTechnico/resources/users';

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/staffMember/allUsers`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );

  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {

      errorMessage = `Error: ${error.error.message}`;
    } else {

      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => errorMessage);
  }
}