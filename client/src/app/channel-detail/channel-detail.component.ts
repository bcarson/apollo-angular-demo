import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, PreloadingStrategy } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';

import { Channel, messagesSubscription } from '../schema';

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
      .subscribe({
        query: messagesSubscription,
        variables: { channelId: +id }
      })
      .map(response => response.data['channel']);
  }
}
