import { constants } from './../app.constants';
import { environment } from './../../environments/environment';
import { AppUtils } from './../shared/utils/app.util';
import { MultipartItem } from './../shared/multipart-upload/multipart-item';
import { MultipartUploader } from './../shared/multipart-upload/multipart-uploader';
import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs/Rx";
import {TrainAndClassify} from '../shared/services/trainandclassify.service';
import {FileUploader} from "../shared/multipart-upload/FileUploader";

@Component({
  selector: 'app-classify',
  templateUrl: './classify.component.html',
  styleUrls: ['./classify.component.css']
})
export class ClassifyComponent implements OnInit {

  trainingFile: File;
  loading: Subscription;
  formData: FormData = new FormData();

  onFileUpload: () => void;
  uploadCallback: (data, status) => void;
  error = '';
  isFileUploading = false;

  uploader: MultipartUploader;
  multipartItem: MultipartItem;

  entitiesFromModel = [
    {
      'sentence': 'Barack Obama is the president of USA.',
      'entities': [
        {
          'entity_text': 'Barack Obama',
          'entity_start': 0,
          'entity_end': 12,
          'entity_type': 'PERSON'
        },
        {
          'entity_text': 'USA',
          'entity_start': 33,
          'entity_end': 36,
          'entity_type': 'LOCATION'
        }
      ]
    },
    {
      'sentence': 'I live in Islamabad.',
      'entities': [
        {
          'entity_text': 'Islamabad',
          'entity_start': 10,
          'entity_end': 19,
          'entity_type': 'LOCATION'
        }
      ]
    },
    {
      'sentence': 'The movie was awesome!',
      'entities': []
    },
    {
      'sentence': 'It\'s so hot in Lahore! On top of that, I\'m wearing a black shirt, and at around 12 pm, I was burning.',
      'entities': [
        {
          'entity_text': 'Lahore',
          'entity_start': 15,
          'entity_end': 21,
          'entity_type': 'LOCATION'
        },
        {
          'entity_text': 'black',
          'entity_start': 53,
          'entity_end': 58,
          'entity_type': 'COLOR'
        },
        {
          'entity_text': '12 pm',
          'entity_start': 80,
          'entity_end': 85,
          'entity_type': 'TIME'
        }
      ]
    }
  ];

  trainForm: FormGroup;
  entitiesForDisplay = [];
  highlightedText = '';
  highlightedTextOffset;
  selectedSentenceIndex;
  selectedSentencePartIndex;
  suggestedEntity = '';

  constructor(private trainAndClassify: TrainAndClassify) {

    let webserviceUrl = environment.apiBaseUrl + constants.apiUrl.classify;
    this.uploader = new MultipartUploader({url: webserviceUrl});
    this.multipartItem = new MultipartItem(this.uploader);
    this.multipartItem.formData = new FormData();

    this.uploadCallback = (data, status) => {
      this.fileUploadCallback(data, status);
    };

    this.onFileUpload = () => {
      this.clearError();
      this.isFileUploading = true;
      this.multipartItem.formData.append('file', this.trainingFile);

      this.multipartItem.callback = this.uploadCallback;
      this.multipartItem.upload();
    };
  }

  ngOnInit() {
    this.initForm();
    this.reconstructEntitiesForDisplay();
  }

  initForm () {
    this.trainForm = new FormGroup({
      'highlightedText': new FormControl(''),
      'entityName': new FormControl('', [Validators.required]),
    });

    this.trainForm.controls.highlightedText.disable();
  }

  fileUploadCallback(file, status) {
    this.isFileUploading = false;

    if (!AppUtils.isUndefinedOrNull(file) && !AppUtils.isUndefinedOrNull(file.data)) {
      this.trainingFile = null;
    } else {
      this.error = 'Fail to upload';
    }
  }

  onSelectFile($event): void {
    const inputValue = $event.target;
    if (null == inputValue || null == inputValue.files[0]) {
      return;
    } else {
      this.trainingFile = inputValue.files[0];
    }
  }

  clearError() {
    this.error = '';
  }

  train() {
    this.loading = this.trainAndClassify.train().subscribe((data) => {
      console.log('data: ' + data);
    }, (error: any) => {
      console.log('error: ' + error);
    });
  }

  reconstructEntitiesForDisplay() {
    for (let i = 0; i < this.entitiesFromModel.length; i++) {
      const sentence = this.entitiesFromModel[i].sentence;
      let entityForDisplay = {};
      let sentenceParts = [];
      let startIndex = 0;
      for (let j = 0; j < this.entitiesFromModel[i].entities.length; j++) {
        const entityFromModel = this.entitiesFromModel[i].entities[j];
        if (startIndex !== entityFromModel.entity_start) {
          let sentencePart = {};
          sentencePart['text'] = sentence.substring(startIndex, entityFromModel.entity_start);
          sentencePart['type'] = 'plain';
          startIndex = entityFromModel.entity_start;
          sentenceParts.push(sentencePart);
        }
        if (startIndex === entityFromModel.entity_start) {
          let sentencePart = {};
          sentencePart['text'] = entityFromModel.entity_text;
          sentencePart['type'] = entityFromModel.entity_type;
          startIndex = entityFromModel.entity_end;
          sentenceParts.push(sentencePart);
        }
        if (j === this.entitiesFromModel[i].entities.length - 1 && startIndex < sentence.length) {
          let sentencePart = {};
          sentencePart['text'] = sentence.substring(startIndex, sentence.length);
          sentencePart['type'] = 'plain';
          startIndex = sentence.length;
          sentenceParts.push(sentencePart);
        }
      }
      if (startIndex === 0) {
        let sentencePart = {};
        sentencePart['text'] = sentence;
        sentencePart['type'] = 'plain';
        sentenceParts.push(sentencePart);
      }
      entityForDisplay['sentence'] = sentence;
      entityForDisplay['parts'] = sentenceParts;
      this.entitiesForDisplay.push(entityForDisplay);
    }
  }

  captureHighlightedText (e, p) {
    if (window.getSelection) {
      this.highlightedText = window.getSelection().toString();
      this.trainForm.controls.highlightedText.setValue(this.highlightedText);
      if (this.highlightedText.length > 0) {
        this.highlightedTextOffset = window.getSelection().baseOffset < window.getSelection().focusOffset ? window.getSelection().baseOffset : window.getSelection().focusOffset;
        this.selectedSentenceIndex = e;
        this.selectedSentencePartIndex = p;
      } else {
        this.highlightedText = '';
        this.suggestedEntity = '';
        this.trainForm.reset();
      }
    }
  }

  removeEntity(e, p) {
    let entity = this.entitiesForDisplay[e];
    if (p > 0 && !isUndefined(entity['parts'][p + 1])
      && entity['parts'][p - 1]['type'] === 'plain' && entity['parts'][p + 1]['type'] === 'plain') {
      const text = entity['parts'][p - 1]['text'] + entity['parts'][p]['text'] + entity['parts'][p + 1]['text'];
      entity['parts'][p - 1]['text'] = text;
      entity['parts'].splice(p, 2);
    } else if (p > 0 && entity['parts'][p - 1]['type'] === 'plain'
      && (isUndefined(entity['parts'][p + 1]) || entity['parts'][p + 1]['type'] !== 'plain')) {
      const text = entity['parts'][p - 1]['text'] + entity['parts'][p]['text'];
      entity['parts'][p - 1]['text'] = text;
      entity['parts'][p - 1]['type'] = 'plain';
      entity['parts'].splice(p, 1);
    } else if (!isUndefined(entity['parts'][p + 1]) && entity['parts'][p + 1]['type'] === 'plain'
      && (p <= 0 || entity['parts'][p - 1]['type'] !== 'plain')) {
      const text = entity['parts'][p]['text'] + entity['parts'][p + 1]['text'];
      entity['parts'][p]['text'] = text;
      entity['parts'][p]['type'] = 'plain';
      entity['parts'].splice(p + 1, 1);
    }
  }

  markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsDirty();
      } else if (group.controls[i] instanceof FormGroup) {
        this.markAsDirty(<FormGroup>group.controls[i]);
      }
    }
  }

  addEntity() {
    this.markAsDirty(this.trainForm);

    if (this.trainForm.valid) {
      this.suggestedEntity = this.trainForm.controls.entityName.value;

      let entity = this.entitiesForDisplay[this.selectedSentenceIndex];
      let p = this.selectedSentencePartIndex;

      if (this.highlightedText.length > 0 && this.suggestedEntity !== '') {
        const substringEnd = this.highlightedTextOffset + this.highlightedText.length;
        const substring = entity['parts'][p]['text'].substring(this.highlightedTextOffset, substringEnd);

        if (entity['parts'][p]['text'] === substring) {
          entity['parts'][p]['type'] = this.suggestedEntity;
        } else if (this.highlightedTextOffset === 0) {
          let sentencePart1 = {};
          sentencePart1['text'] = substring;
          sentencePart1['type'] = this.suggestedEntity;

          const secondSubstring = entity['parts'][p]['text'].substring(substringEnd, entity['parts'][p]['text'].length);
          let sentencePart2 = {};
          sentencePart2['text'] = secondSubstring;
          sentencePart2['type'] = 'plain';

          entity['parts'].splice(p, 1, sentencePart1);
          entity['parts'].splice(p + 1, 0, sentencePart2);
        } else if (substringEnd === entity['parts'][p]['text'].length) {
          const firstSubstring = entity['parts'][p]['text'].substring(0, this.highlightedTextOffset);
          let sentencePart1 = {};
          sentencePart1['text'] = firstSubstring;
          sentencePart1['type'] = 'plain';

          let sentencePart2 = {};
          sentencePart2['text'] = substring;
          sentencePart2['type'] = this.suggestedEntity;

          entity['parts'].splice(p, 1, sentencePart1);
          entity['parts'].splice(p + 1, 0, sentencePart2);
        } else {
          const firstSubstring = entity['parts'][p]['text'].substring(0, this.highlightedTextOffset);
          let sentencePart1 = {};
          sentencePart1['text'] = firstSubstring;
          sentencePart1['type'] = 'plain';

          let sentencePart2 = {};
          sentencePart2['text'] = substring;
          sentencePart2['type'] = this.suggestedEntity;

          const secondSubstring = entity['parts'][p]['text'].substring(substringEnd, entity['parts'][p]['text'].length);
          let sentencePart3 = {};
          sentencePart3['text'] = secondSubstring;
          sentencePart3['type'] = 'plain';

          entity['parts'].splice(p, 1, sentencePart1);
          entity['parts'].splice(p + 1, 0, sentencePart2);
          entity['parts'].splice(p + 2, 0, sentencePart3);
        }
      }
    }
    this.highlightedText = '';
    this.suggestedEntity = '';
    this.trainForm.reset();
  }

}
