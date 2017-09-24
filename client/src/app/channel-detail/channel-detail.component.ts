import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import gql from 'graphql-tag';

interface Message {
  id: number;
  text: string;
}

interface Channel {
  id: number;
  name: string;
  messages: Message[];
}

interface QueryResponse {
  channel: Channel;
}

export const channelDetailQuery = gql`
  query ChannelDetailQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.css']
})
export class ChannelDetailComponent implements OnInit {
  channel$: Observable<Channel>;
  channel: Channel;
  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    const id: number = this.route.snapshot.params['id'];
    this.channel$ = this.apollo
      .watchQuery<Channel>({
        query: channelDetailQuery,
        variables: { channelId: +id }
      })
      .map(response => response.data['channel'])
      .do(x => console.log('x', x.name, x.messages));

    // this.apollo
    //   .watchQuery<Channel>({
    //     query: channelDetailQuery,
    //     variables: { channelId: +id }
    //   })
    //   // .map(({ data }) => data['channel'])
    //   .do(data => console.log('data', data))
    //   .subscribe(({ data }) => {
    //     console.log('one', data['channel']);
    //     console.log('two', data);
    //     this.channel = data; // I should not need to do this...why can't I get it to show in the view?
    //   });
  }
}
