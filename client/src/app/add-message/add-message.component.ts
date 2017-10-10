import { Component, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { channelDetailQuery, addMessage, MessageInput } from '../schema';

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css']
})
export class AddMessageComponent {
  @Input() channelId: number;
  newMessage: string;

  constructor(private apollo: Apollo) {}

  addMessage() {
    this.apollo
      .mutate({
        mutation: addMessage,
        variables: {
          messageInput: {
            channelId: this.channelId,
            text: this.newMessage
          }
        },
        optimisticResponse: {
          addMessage: {
            text: this.newMessage,
            id: Math.round(Math.random() * -10000),
            __typename: 'Message'
          }
        },
        update: (store, { data: { addMessage } }) => {
          const data = store.readQuery({
            query: channelDetailQuery,
            variables: {
              channelId: +this.channelId
            }
          });
          store.writeQuery({ query: channelDetailQuery, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('Message added:', data['addMessage'].text);
          this.newMessage = null;
        },
        error => console.log('oops!', error)
      );
  }
}
