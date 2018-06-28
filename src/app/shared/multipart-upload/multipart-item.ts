import {MultipartUploader} from "./multipart-uploader";
import {AppUtils} from "../utils/app.util";

export class MultipartItem {
  public alias = 'file';
  public url = '/';
  public method = 'POST';
  public headers = [];
  public withCredentials = false;
  public formData:FormData = null;
  public isReady = false;
  public isUploading = false;
  public isUploaded = false;
  public isSuccess = false;
  public isCancel = false;
  public isError = false;
  public progress = 0;
  public index = null;
  public callback:Function = null;

  constructor(private uploader:MultipartUploader) {
  }

  public upload() {
    try {
      console.debug("multipart-item.ts & upload() ==>.");
      this.uploader.uploadItem(this);
    } catch (e) {
      console.error(e);
    }
  }

  public init(){
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    this.formData = new FormData();
    this.callback = null;
  }

  public onBeforeUpload() {
  }

  public onProgress(progress:number) {
  }

  public onSuccess(response:any, status:any, headers:any) {
  }

  public onError(response:any, status:any, headers:any) {
    if (response) {
      response = JSON.parse(response);
    }
    this.callback(response, status);
  }

  public onCancel(response:any, status:any, headers:any) {
  }

  public onComplete(response:any, status:any, headers:any) {

    if(status !== 400 && status !== 401) {
      this.callback(JSON.parse(response), status);
    }
    this.init();
  }

  private _updateStatus(progress: number, isReady: boolean, isUploading: boolean, isUploaded: boolean, isSuccess: boolean, isCancel: boolean, isError: boolean) {
    this.progress = progress;
    this.isReady = isReady;
    this.isUploading = isUploading;
    this.isUploaded = isUploaded;
    this.isSuccess = isSuccess;
    this.isCancel = isCancel;
    this.isError = isError;
  }

  private _onBeforeUpload() {
    this._updateStatus(0, true, true, false, false, false, false);
    this.onBeforeUpload();
  }

  private _onProgress(progress:number) {
    this.progress = progress;
    this.onProgress(progress);
  }

  private _onSuccess(response:any, status:any, headers:any) {
    this._updateStatus(100, false, false, true, true, false, false);
    this.index = null;
    this.onSuccess(response, status, headers);
  }

  private _onError(response:any, status:any, headers:any) {
    this._updateStatus(0, false, false, true, false, false, true);
    this.index = null;
    this.onError(response, status, headers);
  }

  private _onCancel(response:any, status:any, headers:any) {
    this._updateStatus(0, false, false, false, false, true, false);
    this.index = null;
    this.onCancel(response, status, headers);
  }

  private _onComplete(response:any, status:any, headers:any) {
    this.onComplete(response, status, headers);
  }

  private _prepareToUploading() {
    this.isReady = true;
  }
}
