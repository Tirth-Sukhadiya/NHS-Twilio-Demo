import { Injectable, EventEmitter, ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs';
import { connect, createLocalTracks, createLocalVideoTrack } from 'twilio-video';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http } from '@angular/http';
import { Router } from '@angular/router';




@Injectable()
export class TwilioService {

  remoteVideo: ElementRef;
  localVideo: ElementRef;
  previewing: boolean;
  msgSubject = new BehaviorSubject("");
  roomObj: any;
  responsText: string;
  

  constructor(private http: HttpClient) {}
  api: string = 'https://prena-ogia.azurewebsites.net/mobile/v1/patient/pregnancy/b71dad53-a8b6-4ec9-9450-fa1d6dd60227/caredetail/careplan/appointment/d2256f3d-12c3-493b-821e-0093feb0adf7/access';
 // api: string = 'https://my-json-server.typicode.com/JSGund/XHR-Fetch-Request-JavaScript/posts';
    getAll(): Observable<any> 
    {    
      let headers = new HttpHeaders();
      headers = headers.set('Access-Control-Allow-Origin', '*')
      headers = headers.set('Content-Type', 'application/json');
      headers = headers.set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodGVycnlAZ21haWwuY29tIiwiaWF0IjoxNjMyMTE0MzM5LCJleHAiOjE2MzIxNTAzMzl9.S5tysUDMzmxlwByaAvf_2klShkeUUnMVwLyFBCheJqXDYJl5R7qfibbhtXe3eNOZQQXrkHq089PLLHhBgWr87g');
           
   // return this.http.get(this.api);  
    return this.http.get(this.api, { headers: headers ,responseType: 'text'});
  }
  

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(error.error.message)

    } else {
      console.log(error.status)
    }
    return (console.log('Something is wrong!'));
  };

  getToken(username): Observable<any> {
    
    return this.http.post('url', { uid: username });
  }

  connectToRoom(accessToken: string, options): void 
  {
    console.log("this.connectToRoom--- "+accessToken);
    console.log("this.options--- "+JSON.stringify(options));
    console.log("name--- "+options.name);
    //console.log("this.roomObj--- "+this.roomObj);

    
    this.startLocalVideo();
    this.previewing = true;
    

    connect(accessToken, options).then(room => {
      //this.roomObj = room;
      this.roomObj = options.name;
      console.log("this.roomObj--- "+this.roomObj);
      if (!this.previewing && options['video']) {
        this.startLocalVideo();
        this.previewing = true;
      }

      room.participants.forEach(participant => {
        this.msgSubject.next("Already in Room: '" + participant.identity + "'");
         console.log("Already in Room: '" + participant.identity + "'");
         this.attachParticipantTracks(participant);
      });

      room.on('participantDisconnected', (participant) => {
        this.msgSubject.next("Participant '" + participant.identity + "' left the room");
         console.log("Participant '" + participant.identity + "' left the room");

        this.detachParticipantTracks(participant);
      });

      room.on('participantConnected',  (participant) => {
        participant.tracks.forEach(track => {
          this.remoteVideo.nativeElement.appendChild(track.attach());
        });

        // participant.on('trackAdded', track => {
        //   console.log('track added')
        //   this.remoteVideo.nativeElement.appendChild(track.attach());
        //   // document.getElementById('remote-media-div').appendChild(track.attach());
        // });
      });

      // When a Participant adds a Track, attach it to the DOM.
      room.on('trackAdded', (track, participant) => {
        console.log(participant.identity + " added track: " + track.kind);
        this.attachTracks([track]);
      });

      // When a Participant removes a Track, detach it from the DOM.
      room.on('trackRemoved', (track, participant) => {
        console.log(participant.identity + " removed track: " + track.kind);
        this.detachTracks([track]);
      });

      room.once('disconnected',  room => {
        this.msgSubject.next('You left the Room:' + room.name);
        room.localParticipant.tracks.forEach(track => {
          var attachedElements = track.detach();
          attachedElements.forEach(element => element.remove());
        });
      });
    });
  }

  attachParticipantTracks(participant): void {
    var tracks = Array.from(participant.tracks.values());
    this.attachTracks([tracks]);
  }

  attachTracks(tracks) {
    tracks.forEach(track => {
      this.remoteVideo.nativeElement.appendChild(track.attach());
    });
  }

  startLocalVideo(): void {
    createLocalVideoTrack().then(track => {
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  localPreview(): void {
    createLocalVideoTrack().then(track => {
      this.localVideo.nativeElement.appendChild(track.attach());
    });
  }

  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }

  detachTracks(tracks): void {
    tracks.forEach(function (track) {
      track.detach().forEach(function (detachedElement) {
        detachedElement.remove();
      });
    });
  }

}
function httpOptions(api: any, httpOptions: any) {
  throw new Error('Function not implemented.');
}

