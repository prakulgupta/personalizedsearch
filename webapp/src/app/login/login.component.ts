import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    @Output() messageEvent = new EventEmitter<{}>();
    @Output() logoutEvent = new EventEmitter<string>();
    
    @ViewChild('login_btn', { static: false }) loginButton: ElementRef;
    @ViewChild('logout_btn', { static: false }) logoutButton: ElementRef;

    date; //date Variable
    logedInForm; //These are variables
    emailId;
    password;
    display='none'; //default Variable
  
    constructor() { }
  
    ngOnInit() {
      this.date = new Date(); // Today date and time
      //Login Validation
      this.logedInForm = new FormGroup({
        emailId: new FormControl("",
          Validators.compose([
            Validators.required,
            Validators.pattern("[^ @]*@[^ @]*")
        ])),
        password: new FormControl('', [
             Validators.minLength(8),
             Validators.required])
      });
    }
  
    logOutUser(){
        this.loginButton.nativeElement.style.visibility = "visible";
        this.logoutButton.nativeElement.style.visibility = "hidden";
        this.logoutEvent.emit("logged out");
    }
    // Model Driven Form - login
    mdfLogin() {
      let message= {
          email: this.logedInForm.value.emailId,
          password: this.logedInForm.value.password
      }
      this.messageEvent.emit(message);
      this.closeModalDialog();
      this.loginButton.nativeElement.style.visibility = "hidden";      
      this.logoutButton.nativeElement.style.visibility = "visible";      
    }
  
    openModalDialog(){
      this.display='block'; //Set block css
   }
  
   closeModalDialog(){
    this.display='none'; //set none css after close dialog
   }
}