import { Component, OnInit } from '@angular/core';
import { UserformService } from 'src/app/services/userform.service';
import { Userform } from 'src/app/models/userform';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UserInfoService } from 'src/app/services/user-info.service';
import { UserInfo } from 'src/app/models/user-info';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarData: { date: Date; events: { event: Userform, time: string; endTime : string }[] }[][] = [];
  events: Userform[] = [];
  currentYear: number = 0;
  selectedMonth: string = '';
  selectedWeek: { date: Date; events: { event: Userform; time: string; endTime : string }[] }[] = [];
  user: SocialUser = {} as SocialUser;
  loggedIn: boolean = false;
  doesIdExist: boolean = false;
  newUser: UserInfo = {} as UserInfo;

  constructor(
    private eventService: UserformService,    
    private authService: SocialAuthService,
    private userinfoservice: UserInfoService
    ) {}

  ngOnInit() {

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      this.setGoogleId();
    });
this.newUser.googleId = this.user.id;
console.log(this.newUser.googleId)
    this.eventService.getByBusinessName(this.user.id).subscribe(response => {
      this.events = response;
      const today = new Date();
      this.selectedMonth = this.getMonthName(today.getMonth());
      this.currentYear = today.getFullYear();
      this.initializeCalendar();
    });
  }

setGoogleId(): void {
    this.doesThisPersonExist();
  }

  doesThisPersonExist(): void {
    this.userinfoservice.getById(this.user.id).subscribe((response: UserInfo) => {
      this.doesIdExist = response != null;
      if (this.doesIdExist) {
        this.newUser = response;
      }
    });
  }

  buildCalendarData(date: Date): { date: Date; events: { event: Userform, time: string; endTime : string }[] }[][] {
    const calendarData: { date: Date; events: { event: Userform, time: string, endTime: string }[] }[][] = [];
  
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  
    // Calculate the number of days from the previous month that should be displayed
    const daysFromPreviousMonth = (firstDay.getDay() + 6) % 7;
  
    // Adjust currentDay to the first day of the week that includes the first day of the month
    firstDay.setDate(1 - daysFromPreviousMonth);
  
    let currentDay = new Date(firstDay);
  
    for (let week = 0; week < 6; week++) {
      calendarData[week] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        calendarData[week][dayOfWeek] = {
          date: new Date(currentDay),
          events: []
        };
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }
  
    for (let event of this.events) {
      let eventEndDate = new Date(event.endDateTime);
      let eventDate = new Date(event.dateTime);
      if (
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      ) {
        let dayOfMonth = eventDate.getDate();
        let weekIndex = Math.floor((dayOfMonth - 1 + daysFromPreviousMonth) / 7);
        let dayOfWeek = (eventDate.getDay() + 6) % 7; // Adjust dayOfWeek
  
        calendarData[weekIndex][dayOfWeek].events.push({
          event: event,
          time: eventDate.toLocaleTimeString(),
          endTime: eventEndDate.toLocaleTimeString()
        });
      }
    }
  
    return calendarData;
  }
  
  


  initializeCalendar() {
    let today = new Date(this.currentYear, this.getMonthNumber(this.selectedMonth), 1);
    this.calendarData = this.buildCalendarData(today);
    this.selectedWeek = this.calendarData[0]; // Initialize with the data for the first week
  }

  selectWeek(week: { date: Date; events: { event: Userform, time: string; endTime : string }[] }[]) {
    this.selectedWeek = week;
  }

  isSelectedWeek(week: { date: Date; events: { event: Userform, time: string }[] }[]): boolean {
    return this.selectedWeek === week;
  }

  selectedDay: { date: Date; events: { event: Userform, time: string }[] } | null = null;

  selectDay(day: { date: Date; events: { event: Userform, time: string }[] }) {
    this.selectedDay = day;
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthIndex];
  }

  getMonthNumber(monthName: string): number {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames.indexOf(monthName);
  }

  getDaysOfWeek(): string[] {
    return [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun'];
  }

  changeCalendar() {
    this.initializeCalendar();
  }
}
