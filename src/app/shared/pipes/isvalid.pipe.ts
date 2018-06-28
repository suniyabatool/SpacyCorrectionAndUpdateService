import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isvalid',
  pure: false
})
export class IsValidPipe implements PipeTransform {

  transform(control: any, validations?: string []): boolean {

    let validationFlag = false;
    validations.forEach((validation, index) => {
      if (control) {
        if (control.hasError(validation) && control.dirty) {
          validationFlag = true;
          return;
        }
      }
    });

    return validationFlag;
  }
}
