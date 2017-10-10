import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import 'rxjs/add/operator/map';

import { Channel, channelDetailQuery, messagesSubscription } from '../schema';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.css']
})
export class ChannelDetailComponent implements OnInit {
  channel$: ApolloQueryObservable<Channel>;
  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    // get the channel id from route params
    const id: number = this.route.snapshot.params['id'];

    /*
    * Pull the initial ChannelDetailQuery from GraphQL
    * returns:
    *   interface Channel {
    *   id: number;
    *   name: string;
    *   messages: Message[];
    * }
    */
    this.channel$ = this.apollo
      .watchQuery<Channel>({
        query: channelDetailQuery,
        variables: { channelId: +id }
      })
      .map(response => response.data['channel']) as any; // map needs 'as any' to work on ApolloQueryObservable

    /*
      * Listen for updates from the GraphQL server
      */
    this.apollo
      .subscribe({
        /* ^^^^^ this Subscribe is from Apollo */
        query: messagesSubscription,
        variables: { channelId: +id }
      })
      .subscribe(latest => {
        /* ^^^^^ this Subscribe is from RxJS */
        /*
        * Update the ChannelDetailQuery
        */
        this.channel$.updateQuery(old => {
          return {
            ...old,
            channel: {
              ...old.channel,
              messages: [...old.channel.messages, latest.messageAdded]
            }
          };
        });
      });
  }
}
