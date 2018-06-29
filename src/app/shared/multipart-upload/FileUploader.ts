import {MultipartItem} from "../multipart-upload/multipart-item";
import {MultipartUploader} from "../multipart-upload/multipart-uploader";
import {environment} from "../../../environments/environment";
import {AppUtils} from "../utils/app.util";
import {constants} from "../../app.constants";

export class FileUploader {

  onFileUpload: () => void;
  uploadCallback: (data, status) => void;
  file: File;
  error = '';
  isFileUploading = false;

  uploader: MultipartUploader;
  multipartItem: MultipartItem;

  constructor(file) {

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
      this.file = file;
      this.multipartItem.formData.append('file', this.file);

      this.multipartItem.callback = this.uploadCallback;
      this.multipartItem.upload();
    };
  }

  fileUploadCallback(file, status) {
    this.isFileUploading = false;

    if (!AppUtils.isUndefinedOrNull(file) && !AppUtils.isUndefinedOrNull(file.data)) {
      this.file = null;
    } else {
      if (AppUtils.isUndefinedOrNull(file)) {
        this.error = 'Fail to upload';
      } else {
        this.error = AppUtils.getError(file);
      }
    }
  }

  onSelectFile($event): void {
    const inputValue = $event.target;
    if (null == inputValue || null == inputValue.files[0]) {
      return;
    } else {
      this.file = inputValue.files[0];
    }
  }

  clearError() {
    this.error = '';
  }
}
