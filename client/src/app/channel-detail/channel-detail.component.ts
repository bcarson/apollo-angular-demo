import { ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

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
    const id: number = this.route.snapshot.params['id'];
    this.channel$ = this.apollo
      .watchQuery<Channel>({
        query: channelDetailQuery,
        variables: { channelId: +id }
      })
      .map(response => response.data['channel']) as any;

    this.apollo
      .subscribe({
        query: messagesSubscription,
        variables: { channelId: +id }
      })
      .delay(0)
      .subscribe(data => {
        console.log('subscription fired!', data);
        this.channel$.updateQuery(prev => {
          console.log('prev', prev);
          const allMessages = prev.channel.messages || [];
          console.log('message', allMessages);
          return {
            ...prev,
            messages: [...allMessages, data.messageAdded]
          };
        });
      });
  }
}
