import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ChangeDetectorRef } from '@angular/core';
import domtoimage from 'dom-to-image';
import { Share } from '@capacitor/share';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { CameraPreview, CameraPreviewOptions } from '@capacitor-community/camera-preview';
import * as FaceAPI from '@vladmandic/face-api';

// import { TinyFaceDetector,FaceLandmark68Net, FaceRecognitionNet,FaceExpressionNet,detectAllFaces, tinyFaceDetector, TinyFaceDetectorOptions} from '@vladmandic/face-api'
const IMAGE_DIR = 'stored-images';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cameraActive=false;
  quotes: any;
  randomQuotes: any;
  wallpapers: any;
  heartIconSrc: string;
  liked: any;
  dataLink: string;
  photos: any;
  base64: string;
  userEmotions: any;
  resEmotions: void;
  Qoutes: { res: Object;random:boolean; }[];
  theRandomNumber: number;
  constructor(private http: HttpClient,private cd: ChangeDetectorRef) {
    // this.getAllQoutes();
    // this.getWallpaper();
    this.heartIconSrc = 'assets/icon/heart-outline.svg';
    //create image dir
    // this.createImageDir();
    this.videoDetection();
  }
  async createImageDir(){
      //Folder does not yet exists!
      await Filesystem.mkdir({
        path: IMAGE_DIR,
        directory: Directory.Documents,
      });
  }
  getAllQoutes() {
    const options = {
      headers: new HttpHeaders({
        'content-type': 'application/json',
        'X-RapidAPI-Host': 'quotel-quotes.p.rapidapi.com',
          'X-RapidAPI-Key': 'YOU-API-KEY',
      }),
    };
    const body = {
      body: '{}',
    };
    this.http
      .post('https://quotel-quotes.p.rapidapi.com/quotes/random', body, options)
      .subscribe((res) => {
        console.log(res);
        this.randomQuotes = res;
        this.Qoutes=[{
          res:res,
          random:true
        }];
        console.log(this.Qoutes);
        
        return this.randomQuotes;
      });
  }
  getWallpaper() {
    
    fetch('https://api.pexels.com/v1/search?query=background&per_page=10&size=small&orientation=portrait', {
      headers: {
        Authorization: 'YOU-API-KEY',
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        this.wallpapers = data.photos;
        // save data in storage for cashing
      });
  }
  getWallpaperWithSearchKey() {
    fetch('https://api.pexels.com/v1/search?query=people&size=small&orientation=portrait', {
      headers: {
        Authorization: 'YOU-API-KEY',
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        this.wallpapers = data.photos;
        // alert(data.photos[0].src.original);
      });
  }
  loveThis(){
    // const clicked = $event.target;
    // const closestIcon = clicked.closest('div');
    // closestIcon.querySelector('ion-icon').setAttribute('ng-reflect-src', 'assets/icon/heart.svg');
    console.log('hh');
    if(this.liked){
      this.heartIconSrc = 'assets/icon/heart.svg';
    }
    
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  async share(i){
    const fileread= new FileReader();
    console.log('index', i);
    domtoimage.toJpeg(document.getElementById(i), { quality: 0.95 })
    .then( (dataUrl) => {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        // link.click();
        this.dataLink = link.href;
        //base64
        // console.log(this.dataLink);
        this.saveImage(this.dataLink)
    });
  
  }
  async saveImage(photo) {

    const base64Data = photo;
 
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Documents
    });
    console.log('saved: ',savedFile)
    await Share.share({
      title:'Qoute',
      url:savedFile.uri
    })
}
async addPhotoToGallery() {
  this.addNewToGallery();

}
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
   return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + 'YOU-API-KEY', body);
}
callQoutesWithEmotion(){
  const emotions = this.userEmotions.responses[0].faceAnnotations[0];
  if(emotions.joyLikelihood!=='VERY_UNLIKELY' || emotions.joyLikelihood === 'VERY_LIKELY'){
    this.getAllQoutesSearch('happy');
    alert("Emotion detected : Joy ")
  }else if(emotions.angerLikelihood!=='VERY_UNLIKELY' || emotions.angerLikelihood === 'VERY_LIKELY'){
    this.getAllQoutesSearch('anger');
    alert("Emotion detected : Anger ")
  }
  else if(emotions.blurredLikelihood!=='VERY_UNLIKELY' || emotions.blurredLikelihood === 'VERY_LIKELY' ){
    this.getAllQoutesSearch('blurred');
    alert("Emotion detected : Blurred ")
  }
  else if(emotions.sorrowLikelihood!=='VERY_UNLIKELY' || emotions.sorrowLikelihood === 'VERY_LIKELY'  ){
    this.getAllQoutesSearch('sorrow');
    alert("Emotion detected : Sorrow ")
  }
  else if(emotions.underExposedLikelihood!=='VERY_UNLIKELY' || emotions.underExposedLikelihood === 'VERY_LIKELY' ){
    this.getAllQoutesSearch('exposed');
    alert("Emotion detected : Exposed ")
  }
}
getAllQoutesSearch(search) {
  this.theRandomNumber = Math.floor(Math.random() * 10) + 1;
  const options = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'X-RapidAPI-Host': 'quotel-quotes.p.rapidapi.com',
      'X-RapidAPI-Key': 'c7d3c51cd8msh4482da671e24d30p1fcf19jsn62c304bf6cbe',
    }),
  };
  const body = {
    "pageSize": 10,
    "page": this.theRandomNumber,
    "searchString": search
  };
  this.http
    .post('https://quotel-quotes.p.rapidapi.com/search/quotes', body, options)
    .subscribe((res) => {
      this.randomQuotes = res;
      console.log(this.randomQuotes );
    });
    
    setTimeout(() => {
      console.log('length = '+ this.randomQuotes.length);
      for (let i = 0; i < this.randomQuotes.length; i++) {
        this.Qoutes[i]={
          res:this.randomQuotes[i],
          random:false
        };
      }
      console.log(this.Qoutes)
    }, 3000);
    
}
 async videoDetection(){
   Promise.all([
    await FaceAPI.nets.tinyFaceDetector.loadFromUri('assets/model'),
    await FaceAPI.nets.faceExpressionNet.loadFromUri('assets/model'),
    await FaceAPI.nets.faceLandmark68Net.loadFromUri('assets/model'),
    await FaceAPI.nets.faceRecognitionNet.loadFromUri('assets/model')
   ]).then(()=>{
    this.startVideoDetection()
   })   
  }
  async startVideoDetection(){
    
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'front',
      height:480,
      width: 640,
      disableAudio:true,
      parent:'cameraPreview',
      className:'cameraPreview',
      
    };
    CameraPreview.start(cameraPreviewOptions).then(()=>{
      this.cameraActive=true;
      const video= document.getElementById('video') as HTMLCanvasElement;
        video.addEventListener('play',()=>{
          const displaySize = { width: 640, height: 480 }
          const Canvas = FaceAPI.createCanvas(displaySize);
          const addClassToDrawCanva = document.getElementById('cameraPreview').appendChild(Canvas)
          addClassToDrawCanva.setAttribute("id","canvasDraw");
          document.getElementById('video').style.transform = 'scaleX(1)';
          document.getElementById('canvasDraw').style.position = 'absolute';
          document.getElementById('canvasDraw').style.top = '0'; 
          document.getElementById('canvasDraw').style.zIndex = '99'; 
          FaceAPI.matchDimensions(Canvas,displaySize)
          setInterval(async () => {
            const detections =await FaceAPI.detectSingleFace(video,
            new FaceAPI.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            console.log(detections);
            const resizedDetections = FaceAPI.resizeResults(detections,displaySize)
            Canvas.getContext('2d').clearRect(0,0,Canvas.width,Canvas.height)
            FaceAPI.draw.drawDetections(Canvas ,resizedDetections )
            FaceAPI.draw.drawFaceExpressions(Canvas ,resizedDetections )
            FaceAPI.draw.drawFaceLandmarks(Canvas ,resizedDetections )
          },100)
          
        })
    });
    
    
    
  }
}
