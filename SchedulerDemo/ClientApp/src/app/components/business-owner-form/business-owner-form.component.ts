import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { BusinessOwner } from 'src/app/models/business-owner';
import { UserInfo } from 'src/app/models/user-info';
import { Userform } from 'src/app/models/userform';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserformService } from 'src/app/services/userform.service';

@Component({
  selector: 'app-business-owner-form',
  templateUrl: './business-owner-form.component.html',
  styleUrls: ['./business-owner-form.component.css']
})
export class BusinessOwnerFormComponent {

    events: Userform[] = [];
    user: SocialUser = {} as SocialUser;
    loggedIn: boolean = false;
    doesIdExist: boolean = false;
    newUser: UserInfo = {} as UserInfo;
    listOfBusinessOwners: BusinessOwner[] = [];
    newOwner:BusinessOwner = {} as BusinessOwner;
    selectedTime: string = '';
    timeIntervals: string[] = this.generateTimeIntervals();
    fixedLocation: boolean = false;
    displayForm: boolean = false;

    constructor(
      private eventService: UserformService,    
      private authService: SocialAuthService,
      private userinfoservice: UserInfoService
      ) {}
  
    ngOnInit() {
  
      this.authService.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
        // this.setGoogleId();
      });
      }
  
  // setGoogleId(): void {
  //     this.doesThisPersonExist();
  //   }
  
  //   doesThisPersonExist(): void {
  //     this.userinfoservice.getById(this.user.id).subscribe((response: UserInfo) => {
  //       this.doesIdExist = response != null;
  //       if (this.doesIdExist) {
  //         this.newUser = response;
  //       }
  //     });
  //   }
  
      setLocation(bool: boolean):void{
        this.fixedLocation = bool;
        this.displayForm = true;
        console.log(this.fixedLocation);
      }

  addNewOwner(newBusinessOwner: BusinessOwner): void{
    newBusinessOwner.oneLocation = this.fixedLocation;
    if(this.fixedLocation == false){
      newBusinessOwner.address = '';
      newBusinessOwner.city = '';
      newBusinessOwner.state = '';
    }
    console.log(newBusinessOwner.oneLocation)
    newBusinessOwner.businessGoogleId = this.user.id;
    newBusinessOwner.businessName = this.user.name;
    newBusinessOwner.employeeName = "";
    console.log("Prior to service");
    console.log(newBusinessOwner)
    this.eventService.addBusinessOwner(newBusinessOwner).subscribe((response:BusinessOwner) => {
      this.listOfBusinessOwners.push(response);
      console.log("after service call");
    });
  }

  generateTimeIntervals(): string[] {
    let intervals = [];
    let startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    for (let i = 0; i < 96; i++) { // 96 intervals for a 24-hour day
      intervals.push(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return intervals;
  }
}
