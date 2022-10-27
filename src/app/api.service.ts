const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const apiUrl = "http://localhost:8080/api/";

import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Task } from './model/task';
import { Employee } from './model/employee';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  //Tasks
  listTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(apiUrl + "listTasks")
      .pipe(
        tap(tasks => console.log('fetched cutasktaskssstomers')),
        catchError(this.handleError('tasks', []))
      );
  }

  // Update Task
  updateTask(task): Observable<any> {
    const url = `${apiUrl}updateTask`;
    return this.http.put(url, task, httpOptions).pipe(
      catchError(this.handleError<any>('updateTask'))
    );
  }

  // Create Task
  createTask(task): Observable<any> {
    const url = `${apiUrl}createTask`;
    return this.http.post(url, task, httpOptions).pipe(
      catchError(this.handleError<any>('createTask'))
    );
  }

  deleteTask(id): Observable<Task> {
    const url = `${apiUrl}deleteTask/${id}`;

    return this.http.delete<Task>(url, httpOptions).pipe(
      catchError(this.handleError<Task>('deleteTask'))
    );
  }

  //List Employees
  listEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(apiUrl + "listEmployees")
      .pipe(
        catchError(this.handleError('employees', []))
      );
  }

  // Create Employee
  createEmployee(employee): Observable<any> {
    const url = `${apiUrl}createEmployee`;
    return this.http.post(url, employee, httpOptions).pipe(
      catchError(this.handleError<any>('createEmployee'))
    );
  }

  // Create Employee
  updateEmployee(employee): Observable<any> {
    const url = `${apiUrl}updateEmployee`;
    return this.http.put(url, employee, httpOptions).pipe(
      catchError(this.handleError<any>('updateEmployee'))
    );
  }

  // Deletes Employee
  deleteEmployee(id): Observable<Task> {
    const url = `${apiUrl}deleteEmployee/${id}`;

    return this.http.delete<Task>(url, httpOptions).pipe(
      catchError(this.handleError<Task>('deleteEmployee'))
    );
  }


}
