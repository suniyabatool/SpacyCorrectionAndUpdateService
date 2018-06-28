import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Rx';
import {TrainAndClassify} from '../shared/services/trainandclassify.service';

@Component({
  selector: 'app-train-and-upload',
  templateUrl: './train-and-upload.component.html',
  styleUrls: ['./train-and-upload.component.css']
})
export class TrainAndUploadComponent implements OnInit {

  trainingFile: File;
  loading: Subscription;
  formData: FormData = new FormData();

  constructor(private trainAndClassify: TrainAndClassify) { }

  ngOnInit() {
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;

    if(fileList.length > 0) {
      this.trainingFile = fileList[0];
      this.formData.append('file', this.trainingFile);
    }
  }

  train() {
    this.loading = this.trainAndClassify.train().subscribe((data) => {
      console.log('data: ' + data);
    }, (error: any) => {
      console.log('error: ' + error);
    });
  }

  classify() {
    this.loading = this.trainAndClassify.classify(this.formData).subscribe((data) => {
      console.log('data: ' + data);
    }, (error: any) => {
      console.log('error: ' + error);
    });
  }

}
