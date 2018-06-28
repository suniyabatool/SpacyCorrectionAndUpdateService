import {Injectable} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import * as _ from "underscore";
import * as $ from "jquery";

@Injectable()
export class AppUtils {

  public static getError(response): string {
    let errorMessage = "Please try again!";
    if (!AppUtils.isUndefinedOrNull(response) && !AppUtils.isUndefinedOrNull(response.message)) {
      errorMessage = response.message;
      if(!AppUtils.isUndefinedOrNull(response['sub-message'])) {
        errorMessage = response['sub-message'] + ". " + errorMessage;
      }
    }

    return errorMessage;
  }

  public static isUndefinedOrNull(value): boolean {
    return (_.isUndefined(value) || _.isNull(value) || value.length === 0 || _.isEmpty(value));
  }

  public static markAsDirty(group: FormGroup) {
    group.markAsDirty();
    for (const i in group.controls) {
      if (group.controls[i] instanceof FormControl) {
        group.controls[i].markAsDirty();
      } else if (group.controls[i] instanceof FormGroup) {
        AppUtils.markAsDirty(<FormGroup>group.controls[i]);
      }
    }
  }

  public static deepCopy(to: Array<any>, from: Array<any>) {

    for (let i = 0; i < to.length; i++) {
      to.pop();
    }
    to.pop();
    for (let i = 0; i < from.length; i++) {
      to.push(from[i]);
    }
  }

  public static copyDataInForm(data, form) {
    Object.keys(data).forEach(name => {
      if (form.controls[name]) {
        form.controls[name].patchValue(data[name]);
      }
    });
  }

  public static enableForm(group: FormGroup, enable:boolean) {
    for (const i in group.controls) {
      if(enable) {
        group.controls[i].enable();
      } else {
        group.controls[i].disable();
      }
    }
  }

  public static copyObjectFields(newObject, oldObject) {
    Object.keys(newObject).forEach(name => {
      if (oldObject[name] || oldObject[name] == null) {
        oldObject[name] = newObject[name];
      }
    });
  }

  public static contains(criteriaName: string, array: any): boolean {
    let exists = false;

    if (!AppUtils.isUndefinedOrNull(array)) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].name === criteriaName) {
          exists = true;
          break;
        }
      }
    }

    return exists;
  }

  public static convertBytesInMB(sizeInBytes: number): number {
    return ((sizeInBytes / 1024) / 1024);
  }

  public static addAlphabaticsChars(charArray) {
    for (let i = 65; i <= 90; i++) {
      charArray.push(String.fromCharCode(i));
    }
  }

  public static convertArrayIntoString(array: string[]) : string {
    let str = "";
    const delimeter = ", ";

    for (let i = 0; i < array.length; i++) {
      if(i === (array.length - 1)) {
        str += array[i]
      } else {
        str += array[i] + delimeter;
      }
    }

    return str;
  }

  public static scrollToElement(element: string, delay: number = 50) {
    setTimeout(() => {
      $('html, body').animate({
        scrollTop: $(element).offset().top - 80
      }, 500);
    }, delay);
  }

  public static getFileExtension(fileName: string) : string {
    return "." + fileName.split('.').pop();
  }

}
