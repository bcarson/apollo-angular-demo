import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

interface Channel {
  id: number;
  name: string;
}

export const channelsListQuery = gql`
  query ChannelsListQuery {
    channels {
      id
      name
    }
  }
`;

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
