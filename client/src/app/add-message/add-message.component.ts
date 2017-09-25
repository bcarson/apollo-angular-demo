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
        update: (store, { data: { addMessage } }) => {
          const data = store.readQuery({
            query: channelDetailQuery,
            variables: {
              channelId: +this.channelId
            }
          });

          data['channel'].messages.push(addMessage);
          store.writeQuery({ query: channelDetailQuery, data });
        }
      })
      .subscribe(
        ({ data }) => {
          console.log('got data:', data);
          this.newMessage = null;
        },
        error => console.log('oops!', error)
      );
  }
}
