import {
  AddChannelComponent,
  ChannelDetailComponent,
  ChannelListComponent
} from './index';

export const ROUTES = [
  { path: '', component: ChannelListComponent },
  { path: 'detail/:id', component: ChannelDetailComponent }
];
