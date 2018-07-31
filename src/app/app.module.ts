import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { RouterModule } from '@angular/router';
import { ClassifyComponent } from './classify/classify.component';
import { TrainAndUploadComponent } from './train-and-upload/train-and-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { IsValidPipe } from './shared/pipes/isvalid.pipe';
import { TrainAndClassify } from './shared/services/trainandclassify.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptedHttp } from './shared/interceptors/http.interceptor';
import { BusyConfig, NgBusyModule } from 'ng-busy';
import {BusyComponent} from './shared/components/busy.component';

@NgModule({
  declarations: [
    AppComponent,
    ClassifyComponent,
    TrainAndUploadComponent,
    IsValidPipe,
    BusyComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgBusyModule.forRoot(<BusyConfig>{
      message: 'Loading...',
      backdrop: true,
      template: BusyComponent,
      wrapperClass: 'ng-busy',
      delay: 0
    })
  ],
  providers: [
    TrainAndClassify,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptedHttp,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [BusyComponent]
})
export class AppModule { }
