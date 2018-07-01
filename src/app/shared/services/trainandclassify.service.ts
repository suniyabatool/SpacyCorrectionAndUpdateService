import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../app.constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TrainAndClassify {

  constructor(private http: HttpClient) {
  }

  train() {
    const url = constants.apiUrl.train;
    return this.http.get(url)
      .map((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  classify(formData) {
    const url = constants.apiUrl.classify;
    return this.http.post(url, formData, {
      headers: {'Content-Type': undefined}
    }).map((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

  update(entitiesFromModel) {
    const url = constants.apiUrl.update;
    return this.http.post(url, {'training_data': entitiesFromModel})
      .map((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        return Observable.throw(error);
      });
  }

}
