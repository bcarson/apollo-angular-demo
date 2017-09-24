import { Component, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { channelDetailQuery, addMessage, Message } from '../schema';

@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css']
})
export class AddMessageComponent {
  @Input() channelId: number;
  constructor(private apollo: Apollo) {}
  newMessage: Message;
  addMessage() {
    console.log('channelId inside message: ', this.channelId);

    /*
    *  calling addMessage throws this error:
    *  Error: GraphQL error: Variable "$MessageInput" is not defined by operation "addMessage".
    *  GraphQL error: Variable "$name" is never used in operation "addMessage".
    */
    this.apollo
      .mutate({
        mutation: addMessage,
        variables: {
          text: this.newMessage
        },
        update: (store, { data: { addMessage } }) => {
          const data = store.readQuery({
            query: channelDetailQuery,
            variables: {
              channelId: +this.channelId
            }
          });

          data['channels'].messages.push(addMessage);
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
