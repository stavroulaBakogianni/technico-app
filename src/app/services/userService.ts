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

  // Create a new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

// Get all users
getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/staffMember/allUsers`)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );

}
  // Get user by VAT
  getUserByVat(vat: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/staffMember/byVat/${vat}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get user by email
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/staffMember/byEmail/${email}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get user by email and password (fake login)
  getUserByEmailAndPassword(email: string, password: string): Observable<User> {
    const body = { email, password };
    return this.http.post<User>(`${this.apiUrl}/fakeLogin`, body)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Update an existing user
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Safely delete user
  deleteUserSafely(vat: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/safe/${vat}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Delete user permanently
  deleteUserPermanently(vat: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/staffMember/permanent/${vat}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Handle errors
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