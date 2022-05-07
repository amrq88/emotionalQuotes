import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  base64: string;
  userEmotions: any;
  randomQuotes: Object;
  resEmotions: void;

  constructor(private http:HttpClient) { }
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    });
    this.base64 = capturedPhoto.base64String;
    this.googleVisionApi(this.base64).subscribe((res) =>{
      // console.log(res)
      this.userEmotions= res;
      //get qoutes based on res emotional res
      this.resEmotions =  this.callQoutesWithEmotion();
      
    })
    return this.resEmotions;
  }
  googleVisionApi(base64){
    const body = {
      "requests": [
      {
      "features": [
      {
      "type": "FACE_DETECTION",
      "maxResults": 10
      }],
      "image": {
      "content": base64
      }}]}
     return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + 'AIzaSyAtC5fVuLlfTZbX1xxI_YsDbMOedS3UgnU', body);
  }
  callQoutesWithEmotion(){
    const emotions = this.userEmotions.responses[0].faceAnnotations[0];
    if(emotions.joyLikelihood!=='VERY_UNLIKELY' || emotions.joyLikelihood === 'VERY_LIKELY'){
      this.getAllQoutes('joy');
      alert("Emotion detected : Joy ")
    }else if(emotions.angerLikelihood!=='VERY_UNLIKELY' || emotions.angerLikelihood === 'VERY_LIKELY'){
      this.getAllQoutes('anger');
      alert("Emotion detected : Anger ")
    }
    else if(emotions.blurredLikelihood!=='VERY_UNLIKELY' || emotions.blurredLikelihood === 'VERY_LIKELY' ){
      this.getAllQoutes('blurred');
      alert("Emotion detected : Blurred ")
    }
    else if(emotions.sorrowLikelihood!=='VERY_UNLIKELY' || emotions.sorrowLikelihood === 'VERY_LIKELY'  ){
      this.getAllQoutes('sorrow');
      alert("Emotion detected : Sorrow ")
    }
    else if(emotions.underExposedLikelihood!=='VERY_UNLIKELY' || emotions.underExposedLikelihood === 'VERY_LIKELY' ){
      this.getAllQoutes('exposed');
      alert("Emotion detected : Exposed ")
    }
  }
  getAllQoutes(search) {
    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'quotel-quotes.p.rapidapi.com',
        'X-RapidAPI-Key': 'c7d3c51cd8msh4482da671e24d30p1fcf19jsn62c304bf6cbe',
      }),
    };
    const body = {
      "pageSize": 10,
      "page": 0,
      "searchString": search
    };
    this.http
      .post('https://quotel-quotes.p.rapidapi.com/search', body, options)
      .subscribe((res) => {
        this.randomQuotes = res;
        console.log(this.randomQuotes );
        
        return this.randomQuotes;
      });
      return this.randomQuotes;
  }
  
}
