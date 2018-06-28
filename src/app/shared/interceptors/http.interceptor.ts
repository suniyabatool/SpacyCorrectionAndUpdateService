import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs/Rx';
import {constants} from '../../app.constants';
import {environment} from '../../../environments/environment';


@Injectable()
export class InterceptedHttp implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = this.cloneRequest(request);

    return next.handle(request)
      .catch(this.onCatch)
      .do((res: any) => {
        if(res.type !== 0) {
          this.onSuccess(res);
        }
      }, (error: any) => {
        this.onError(error);
      });
  }

  private cloneRequest(request: HttpRequest<any>): HttpRequest<any> {

    const headerKeys = constants.apiRequestHeaderKeys;
    const defaultHeaderOptions = constants.apiRequestHeaders.default;

    request = request.clone({ headers: request.headers.set(headerKeys.contentType, defaultHeaderOptions.contentType)});

    request = request.clone({url: environment.apiBaseUrl + request.url});
    return request;
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error.error);
  }

  private onSuccess(response: Response): void {
  }

  private onError(error: any): void {
    if (error.status === 400) {
      let body = error;
      console.error(body);
    }
  }
}
