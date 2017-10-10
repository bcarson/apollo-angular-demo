import { ApolloQueryResult } from 'apollo-client/core/types';
import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';

import { Channel, channelDetailQuery, messagesSubscription } from '../schema';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.css']
})
export class ChannelDetailComponent implements OnInit {
  channel$: ApolloQueryObservable<Channel>;
  channel: Channel;
  constructor(
    private apollo: Apollo,
    private appRef: ApplicationRef,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit() {
    const id: number = this.route.snapshot.params['id']; // get the channel id from route params

    /*
    * Pull the ChannelDetailQuery via GraphQL
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
      .map(response => response.data['channel']) as any; // map needs 'as any' on ApolloQueryObservable

    /*
      * Listen for updated from the GraphQL server
      */
    this.apollo
      .subscribe({
        query: messagesSubscription,
        variables: { channelId: +id }
      })
      .subscribe(data => {
        console.log('subscription fired!', data);
        // let's update our existing channel$ query
        this.channel$.updateQuery(prev => {
          return {
            ...prev,
            channel: {
              ...prev.channel,
              messages: [...prev.channel.messages, data.messageAdded]
            }
          };
        });
      });
  }
}
