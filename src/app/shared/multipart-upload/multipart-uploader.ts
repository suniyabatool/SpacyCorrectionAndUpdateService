import {MultipartItem} from "./multipart-item";
export class MultipartUploader {
  public url;
  public authToken;
  public isUploading = false;
  public progress = 0;
  public isHTML5 = true;
  public timeout = 10000;

  constructor(public options:any) {
    // Object.assign(this, options);
    this.url = options.url;
    this.authToken = options.authToken;
  }

  public setUrl(url:string){
    this.url = url;
  }

  public uploadItem(item:MultipartItem) {
    console.debug("multipart-uploader.ts & uploadItem() ==>.");
    if (this.isUploading) {
      console.debug("multipart-uploader.ts & uploadItem() uploader is uploading now.");
      return;
    }
    this.isUploading = true;
    this._xhrTransport(item);
  }

  private _onBeforeUploadItem(item:any) {
    item._onBeforeUpload();
  }


  private _parseHeaders(headers:any) {
    const parsed:any = {};
    let key:any, val:any, i:any;

    if (!headers) {
      return parsed;
    }

    headers.split('\n').map((line:any) => {
      i = line.indexOf(':');
      key = line.slice(0, i).trim().toLowerCase();
      val = line.slice(i + 1).trim();

      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

    return parsed;
  }

  private _transformResponse(response:any, headers:any):any {
    return response;
  }

  private _isSuccessCode(status:any) {
    return (status >= 200 && status < 300) || status === 304;
  }

  private _render() {
    // todo: ?
  }

  _xhrTransport(item:any) {
    const xhr = item._xhr = new XMLHttpRequest();
    //xhr.timeout = this.timeout;

    this._onBeforeUploadItem(item);

    this._registerEvents(xhr, item);

    xhr.open(item.method, this.url, true);
    xhr.withCredentials = item.withCredentials;

    xhr.send(item.formData);
    this._render();
  }

  public onSuccessItem(item:any, response:any, status:any, headers:any) {
  }

  public onErrorItem(item:any, response:any, status:any, headers:any) {
    this.isUploading = false;
  }

  public onCancelItem(item:any, response:any, status:any, headers:any) {
  }

  public onCompleteItem(item:any, response:any, status:any, headers:any) {
  }

  private _onSuccessItem(item:any, response:any, status:any, headers:any) {
    item._onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
  }

  public _onErrorItem(item:any, response:any, status:any, headers:any) {
    console.debug("multipart-uploader.ts & _onErrorItem() ==>" + " Error status:" + status);
    item._onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
  }

  private _onCancelItem(item:any, response:any, status:any, headers:any) {
    item._onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
  }

  public _onCompleteItem(item:any, response:any, status:any, headers:any) {
    item._onComplete(response, status, headers);
    this.onCompleteItem(item, response, status, headers);

    this.isUploading = false;

    //this.progress = this._getTotalProgress();
    this._render();
  }

  private _onErrorAndTimeout(xhr, item) {
    const headers = this._parseHeaders(xhr.getAllResponseHeaders());
    const response = this._transformResponse(xhr.response, headers);
    this._onErrorItem(item, response, xhr.status, headers);
    //this._onCompleteItem(item, response, xhr.status, headers);
  }

  private _registerEvents(xhr, item) {
    xhr.upload.onprogress = (event) => {
      item.progress = (100 * event.loaded/event.total).toFixed(0);
      console.log( item.progress + "%");
    };

    xhr.onload = () => {
      console.debug("multipart-uploader.ts & _xhrTransport.onload() ==>");
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      const gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      const method = '_on' + gist + 'Item';
      (<any>this)[method](item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };

    xhr.onerror = () => {
      this._onErrorAndTimeout(xhr, item);
    };

    xhr.ontimeout = () => {
      this._onErrorAndTimeout(xhr, item);
    };

    xhr.onabort = () => {
      const headers = this._parseHeaders(xhr.getAllResponseHeaders());
      const response = this._transformResponse(xhr.response, headers);
      //this._onCancelItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
  }
}
