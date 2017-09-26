import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { channelsListQuery, addChannel } from '../schema';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent {
  newChannel: string;
  constructor(private apollo: Apollo) {}

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
        // ],
        optimisticResponse: {
          addChannel: {
            name: this.newChannel,
            id: Math.round(Math.random() * -1000000),
            __typename: 'Channel'
          }
        },
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
