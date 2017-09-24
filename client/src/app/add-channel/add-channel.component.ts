import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { channelsListQuery } from '../channel-list/channel-list.component';

const addChannel = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {
  newChannel: string;
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    console.log('hello from newChannel ', this.newChannel);
  }

  addChannel() {
    this.apollo
      .mutate({
        mutation: addChannel,
        variables: {
          name: this.newChannel
        },
        // refetchQueries: [
        //   // update data in the Channels-List component
        //   {
        //     query: channelsListQuery
        //   }
        // ]
        update: (store, { data: { addChannel } }) => {
          const data = store.readQuery({ query: channelsListQuery });
          data['channels'].push(addChannel);
          store.writeQuery({ query: channelsListQuery, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('got data:', data);
          this.newChannel = '';
        },
        error => console.log('oops!', error)
      );
  }
}
