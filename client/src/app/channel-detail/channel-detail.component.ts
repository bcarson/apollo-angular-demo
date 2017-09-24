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
  /*
  *
  * if I make channel$ type ApolloQueryObservable, I get errors like:
  * Property 'flatMap' does not exist on type 'ApolloQueryObservable<Channel>' (if I use flatMap)
  * or
  * Type 'Observable<any>' is not assignable to type 'ApolloQueryObservable<Channel>'.
  * Property 'apollo' is missing in type 'Observable<any>' (if I use map)
  *
  * if I make channel$ type Observable, at least I can compile successfully 
  * but I still don't think this is correct, I want to use ApolloQueryObservable.
  * 
  * Even if I use type Observable and get it to compile (and console log the data successfully),
  * I cannot get this data to render in the dom unless I use the json pipe...what am I doing wrong?
  *
  * (see also channel-detail.component.html)
  */
  // channel$: ApolloQueryObservable<Channel>;
  channel$: Observable<Channel>;
  channel: Channel;
  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    const id: number = this.route.snapshot.params['id'];
    console.log('id from route.params: ', id); // <-- this is working
    this.channel$ = this.apollo
      .watchQuery<Channel>({
        query: channelDetailQuery,
        variables: { channelId: +id } // <-- I know this is working
      })
      .map(response => response.data['channel'])
      .do(channel => console.log('channel', channel.name, channel.messages)); // <-- because this shows the data I want

    /*
      * If I subscribe to the query and assign this.channel inside the subscription,
      * I can get my data to show up in the dom. 
      */
    // this.apollo
    //   .watchQuery<Channel>({
    //     query: channelDetailQuery,
    //     variables: { channelId: +id }
    //   })
    //   // .map(({ data }) => data['channel']) // <-- I can use map to select ['channel'] before I subscribe
    //   .do(data => console.log('data', data)) // <-- this shows the data I want
    //   .subscribe(({ data }) => {
    //     console.log('one', data['channel']); // <-- or I can wait and select the channel from data here, this also works
    //     this.channel = data['channel']; <-- but either way, I can't get my data to the dom w/o subscribing!!
    //   });
  }
}
