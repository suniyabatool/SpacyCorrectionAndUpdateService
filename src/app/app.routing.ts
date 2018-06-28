import {RouterModule, Routes} from '@angular/router';
import {ClassifyComponent} from './classify/classify.component';
import {TrainAndUploadComponent} from './train-and-upload/train-and-upload.component';

const AP_ROUTES: Routes = [
  {
    path: '',
    component: ClassifyComponent,
    data: {title: 'Classify Model'}
  },
];

/*, {useHash: true}*/
export const AppRouting = RouterModule.forRoot(AP_ROUTES);
