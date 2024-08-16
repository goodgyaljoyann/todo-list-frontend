import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment/environment'
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  //Initiates Api endpoint
  private API_URL= environment.api_url+'/api/task';
 
  constructor(private  _http:HttpClient){ }

   // fetches all tasks
  fetchAllTasks(): Observable<any>{
    return this._http.get<any>(this.API_URL)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // fetches task by Id
  fetchTaskByUserId(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/user-tasks/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  // creates a new task in the database
  createTask(data:any): Observable<any>{
    return this._http.post<any>(this.API_URL, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates task information
  updateTask(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/update-task/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates task information
  updateStatus(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/update-status/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // deletes task information from database
  deleteTask(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
}
