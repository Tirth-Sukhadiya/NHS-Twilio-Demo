import { HttpClient, HttpHeaders,HttpClientModule  } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TwilioService } from './services/twilio.service';

// import * as Video from 'twilio-video';



declare var require: any;
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

@Component({
  selector: 'app-twilio',
  templateUrl: './twilio.component.html',
  styleUrls: ['./twilio.component.css']
})
@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
  ],
  providers: [],
  bootstrap: []
})
export class TwilioComponent implements OnInit {

  message: string;
  accessToken: string;
  roomName: string;
  username: string;
  li:any;
  lis=[];
  api: string ;
  posts : string;

  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  constructor(public twilioService: TwilioService, private http: HttpClient) {
    this.twilioService.msgSubject.subscribe(r => {
      this.message = r;
    });    
  }
  getAll() {
    console.log('JSON Response = ');    
    this.twilioService.getAll().subscribe((response) =>
      {         
        this.posts = response;
        console.log("this.posts--- "+this.posts);
        this.accessToken = this.posts ;
        localStorage.setItem('token', this.posts);
      },
      (error) => { console.log("error-- "+error); });      
  }

  ngOnInit() {

    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;

    this.getAll();   
    
  }

  log(message) {
    this.message = message;
  }

  disconnect() {
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.roomObj = null;
    }
  }

  connect(): void 
  {
    
    console.log("this.roomName--- "+this.roomName);
    console.log("this.username--- "+this.username);
    console.log("this.access token key--- "+localStorage.getItem('token'));
    this.accessToken = localStorage.getItem('token');
    //console.log("this.accessToken--- "+this.accessToken);
    this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true,  video: { width: 240 } })
    
   // this.accessToken = "eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR5cCI6IkpXVCIsImFsZyI6IkhTMjU2In0.eyJpc3MiOiJTSzFlZTUxOTIwMzdmYjg2ZWY2ODQ3YzFkYjQzYzM2NWVkIiwiZXhwIjoxNjMxNzczNTQwLCJncmFudHMiOnsiaWRlbnRpdHkiOiJ1c2VyIiwidmlkZW8iOnsicm9vbSI6ImQyMjU2ZjNkLTEyYzMtNDkzYi04MjFlLTAwOTNmZWIwYWRmNyJ9fSwianRpIjoiU0sxZWU1MTkyMDM3ZmI4NmVmNjg0N2MxZGI0M2MzNjVlZC0xNjMxNzY5OTg0Iiwic3ViIjoiQUMyN2YzNDJhYzJlOGExY2I0MTA4MjMyODU1YWViNDFlOCJ9.agmftW_Eq4AC4JBAKRTR3a0KLCNil0OkHaoItK5LlPY";
    //this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
    /*
    this.twilioService.connectToRoom(this.accessToken, {
      name: this.username,
      audio: true,
      video: { height: 720, frameRate: 24, width: 1280 },
      bandwidthProfile: {
      video: {
      
      renderDimensions: {
      high: { height: 1080, width: 1980 },
      standard: { height: 720, width: 1280 },
      low: { height: 176, width: 144 }
      }}}});

      
    let storage = JSON.parse(localStorage.getItem('token') || '{}');
    let date = Date.now();
    console.log("storage--- "+storage);
    console.log("this.roomName--- "+this.roomName);
    if (!this.roomName || !this.username) { this.message = "enter username and room name."; return;}
    if (storage['token'] && storage['created_at'] + 3600000 > date) {
      this.accessToken = storage['token'];
      this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
      return;
    }
    this.twilioService.getToken(this.username).subscribe(d => {
      this.accessToken = d['token'];
      localStorage.setItem('token', JSON.stringify({
        token: this.accessToken,
        created_at: date
      }));
      this.twilioService.connectToRoom(this.accessToken, { name: this.roomName, audio: true, video: { width: 240 } })
    },
      error => this.log(JSON.stringify(error)));
    */
  }

}
