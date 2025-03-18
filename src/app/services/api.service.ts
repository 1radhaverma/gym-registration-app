import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   private baseUrl:string = 'http://localhost:3000/enquiry'
  constructor(private http: HttpClient) { }
  
  // when we are requesting
  postRegistration(registerObj: User){
    return this.http.post<User>(`${this.baseUrl}`, registerObj)
  }
  //whtever we have registered we can get it by this to the url
  getRegisteredUser() {
    return this.http.get<User[]>(`${this.baseUrl}`)
  }

  //sending id which user id we want to update
  updateRegistration(registerObj: User, id:number){
    return this.http.put<User>(`${this.baseUrl}/${id}`, registerObj)
  }

  //sending id .. the user deleted
  deleteRegistration(id:number){
    return this.http.delete<User>(`${this.baseUrl}/${id}`)
  }

  //get single user from the list
  getRegistrationUserId(id: number){
    return this.http.get<User>(`${this.baseUrl}/${id}`)
  }
}
