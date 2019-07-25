import { Component, Renderer2, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { ConnectionsService } from './connections.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('customSearch', { static: false }) customSearch: ElementRef;
  @ViewChild(LoginComponent, { static: false }) login;

  public slides;
  public slideConfig;
  private searchBox;
  private searchButton;
  public email: string;
  public password: string;
  public resultFlag:boolean;
  public loggedin:boolean;
  public searchForm = this.fb.group({
    searchData: ['']
  });

  constructor(private fb: FormBuilder,
    private renderer2: Renderer2,
    private connectionService: ConnectionsService
  ) {
    this.slides = [];
    // this.slides = [{ 
    //   "name": "Rajashekhar Reddy", 
    //   "link": "https://www.linkedin.com/in/rajashekhar-reddy-5a644839/", 
    //   "initials": "RR", 
    //   "info": "I am an enthusiastic Computer science graduate and have completed M.tech from NIT Trichy. I am interested in Algorithms,Programming and Operating Systems.\n\nMy objective is to pursue a challenging career and be part of a progressive organization that gives scope to enhance my knowledge, skills and in the computing and research field with sheer determination, dedication and hard work.", 
    //   "headline": "enthusiastic Computer science"
    // },
    // { 
    //   "name": "Rajashekhar Reddy", 
    //   "link": "https://www.linkedin.com/in/rajashekhar-reddy-5a644839/", 
    //   "initials": "RR", 
    //   "info": "I am an enthusiastic Computer science graduate and have completed M.tech from NIT Trichy. I am interested in Algorithms,Programming and Operating Systems.\n\nMy objective is to pursue a challenging career and be part of a progressive organization that gives scope to enhance my knowledge, skills and in the computing and research field with sheer determination, dedication and hard work.", 
    //   "headline": "enthusiastic Computer science"
    // },
    // { 
    //   "name": "Rajashekhar Reddy", 
    //   "link": "https://www.linkedin.com/in/rajashekhar-reddy-5a644839/", 
    //   "initials": "RR", 
    //   "info": "I am an enthusiastic Computer science graduate and have completed M.tech from NIT Trichy. I am interested in Algorithms,Programming and Operating Systems.\n\nMy objective is to pursue a challenging career and be part of a progressive organization that gives scope to enhance my knowledge, skills and in the computing and research field with sheer determination, dedication and hard work.", 
    //   "headline": "enthusiastic Computer science"
    // },
    // { 
    //   "name": "Rajashekhar Reddy", 
    //   "link": "https://www.linkedin.com/in/rajashekhar-reddy-5a644839/", 
    //   "initials": "RR", 
    //   "info": "I am an enthusiastic Computer science graduate and have completed M.tech from NIT Trichy. I am interested in Algorithms,Programming and Operating Systems.\n\nMy objective is to pursue a challenging career and be part of a progressive organization that gives scope to enhance my knowledge, skills and in the computing and research field with sheer determination, dedication and hard work.", 
    //   "headline": "enthusiastic Computer science"
    // },
    // { 
    //   "name": "Rajashekhar Reddy", 
    //   "link": "https://www.linkedin.com/in/rajashekhar-reddy-5a644839/", 
    //   "initials": "RR", 
    //   "info": "I am an enthusiastic Computer science graduate and have completed M.tech from NIT Trichy. I am interested in Algorithms,Programming and Operating Systems.\n\nMy objective is to pursue a challenging career and be part of a progressive organization that gives scope to enhance my knowledge, skills and in the computing and research field with sheer determination, dedication and hard work.", 
    //   "headline": "enthusiastic Computer science"
    // }, 
    //   ];   
    this.slideConfig = { "slidesToShow": 4, "slidesToScroll": 3 };
  }

  public receiveMessage($event) {
    this.email = $event.email;
    this.password = $event.password;
    this.loggedin = true;
  }

  public loggedOutAction($event){
    this.slides = [];
    this.email = '';
    this.password = '';
    this.resultFlag = false;
    this.loggedin = false;
  }

  onSubmit() {
    this.slides = [];
    if (this.email && this.password) {
      let data = this.getKeywordAndTag(this.searchForm.value.searchData)
      let req: IConnectionRequest = {
        email: this.email,
        keyword: data.keyword,
        password: this.password,
        tag: data.tag
      }
      this.connectionService.getConnections(req).subscribe(data => {
        this.slides = data;
        this.resultFlag = true;
      });
    }
    this.searchBox = document.getElementById('bcs-searchbox');
    this.searchButton = this.customSearch.nativeElement.getElementsByClassName("bcs-searchbox-submit");
    this.searchBox.value = this.searchForm.value.searchData;
    this.searchButton[0].onclick();
  }

  afterChange(e) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.appendBingBlueLink();
  }

  private hideBlueLinkSearchBox() {
    var box = this.customSearch.nativeElement.getElementsByClassName("bcs-container-searchbox")[0];
    if (box) {
      box.style.visibility = "hidden";
    }
  }

  private getKeywordAndTag(query: string) {
    let keyword: string;
    const company = "company";
    let index = query.indexOf(company);
    if (index > -1) {
      keyword = query.substring(index + company.length + 1, query.length);
      return { keyword: keyword, tag: "company" };
    }
    const city = "city";
    index = query.indexOf(city);
    if (index > -1) {
      keyword = query.substring(index + city.length + 1, query.length);
      return { keyword: keyword, tag: "location" };
    }
    index = query.indexOf("country");
    if (index > -1) {
      keyword = query.substring(index + "country".length + 1, query.length);
      return { keyword: keyword, tag: "location" };
    }
    const whoIs = "who is";
    index = query.indexOf(whoIs);
    if (index > -1) {
      keyword = query.substring(index + whoIs.length + 1, query.length);
      return { keyword: keyword, tag: "title" };
    }

    const knows = "knows";
    index = query.indexOf(knows);
    if (index > -1) {
      keyword = query.substring(index + knows.length + 1, query.length);
      return { keyword: keyword, tag: "skills" };
    }

    return { keyword: "", tag: "" };
  }
  private appendBingBlueLink() {
    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.id = "bcs_js_snippet"
    s.src = 'https://ui.customsearch.ai/api/ux/rendering-js?customConfig=222a34c3-bf4b-48ba-9f23-078304cab5bc&market=en-US&version=latest&q=';
    s.text = ``;
    this.customSearch.nativeElement.appendChild(s);

    setTimeout(() => {
      this.hideBlueLinkSearchBox();
    }, 1200);
  }
}
