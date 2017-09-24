import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';

import { Channel, channelsListQuery } from '../schema';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent implements OnInit {
  channels$: Observable<Array<Channel>>;
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.channels$ = this.apollo
      .watchQuery<Channel>({
        query: channelsListQuery
        // pollInterval: 1000
      })
      .map(response => response.data['channels']);
  }
}
