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

@NgModule({
  declarations: [
    AppComponent,
    ClassifyComponent,
    TrainAndUploadComponent,
    IsValidPipe
  ],
  imports: [
    BrowserModule,
    AppRouting,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    TrainAndClassify,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptedHttp,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
