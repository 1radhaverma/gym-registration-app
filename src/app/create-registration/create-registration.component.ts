import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmModule } from 'ng-confirm-box';
import { NgToastModule } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
public packages: string[] = ["Monthly","Quarterly","Yearly"];
public genders: string[]=["Male","Female"];
public importantlist: string[]=["Toxic Fat Reduction","Energy and Endurance","Building Lean Muscle","Healthier Digestive System","Sugar Craving Body","Fitness"];

public registerForm!: FormGroup;
public userIDUpdate!:number;
public isupdate:boolean=false;
 constructor(private fb: FormBuilder, private api: ApiService,private activatedRoute: ActivatedRoute, private toastService: NgToastService, private router: Router){

 }
  ngOnInit(): void {
    this.registerForm=this.fb.group({
firstName:[''],
lastName:[''],
email:[''],
mobile:[''],
weight:[''],
height:[''],
bmi:[''],
bmiResult:[''],
gender:[''],
requireTrainer:[''],
package:[''],
important:[''],
havegymbefore:[''],
enquiryDate:[''],
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
        });
        // Get the user ID from route parameters
  this.activatedRoute.params.subscribe(val => {
    if (val['id']) {  // Ensure ID exists before making API request
      this.userIDUpdate = val['id'];
      this.isupdate = true;

      // Fetch user details from API and fill the form
      this.api.getRegistrationUserId(this.userIDUpdate).subscribe({
        next: (res) => {
          this.fillformToUpdate(res);
        },
        error: (err) => {
          console.error("Error fetching user:", err);
        }
      });
    }
  });
}
    Submit(){
   this.api.postRegistration(this.registerForm.value)
   .subscribe(res=>{
this.toastService.success({detail:"Success", summary:"Enquiry Added" , duration:3000});
this.registerForm.reset();
   })
    }

    update(){
      this.api.updateRegistration(this.registerForm.value,this.userIDUpdate)
      .subscribe(res=>{
   this.toastService.success({detail:"Success", summary:"Enquiry Updated" , duration:3000});
   this.registerForm.reset();
   this.router.navigate(['list'])
      });
    }

    calculateBmi(heightvalue: number){
      const weight = this.registerForm.value.weight;
      const height = heightvalue;
      const bmi=weight/(height*height);
this.registerForm.controls['bmi'].patchValue(bmi);
switch(true){
  case bmi < 18.5:
    this.registerForm.controls['bmiResult'].patchValue("Underweight");
    break;
  case (bmi >= 18.5 && bmi < 25):
    this.registerForm.controls['bmiResult'].patchValue("Normal");
    break;
  case (bmi >= 25 && bmi < 30):
    this.registerForm.controls['bmiResult'].patchValue("Overweight");
    break;
  default:
    this.registerForm.controls['bmiResult'].patchValue("Obese");
    break;
}
    }
    //fill the user form for update
    fillformToUpdate(user: User){
this.registerForm.setValue({
    firstName:user.firstName ,
    lastName:user.lastName ,
    email:user.email ,
    mobile:user.mobile ,
    weight:user.weight ,
    height:user.height ,
    bmi:user.bmi ,
    bmiResult:user.bmiResult ,
    gender:user.gender ,
    requireTrainer:user.requireTrainer ,
    package:user.package ,
    important:user.important ,
    havegymbefore:user.havegymbefore ,
    enquiryDate:user.enquiryDate,
   });
 }
}

