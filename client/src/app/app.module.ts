import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from 'subscriptions-transport-ws';

import {
  AppComponent,
  AddChannelComponent,
  ChannelDetailComponent,
  ChannelListComponent
} from './index';

import { ROUTES } from './app.routes';
import { AddMessageComponent } from './add-message/add-message.component';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql'
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    }
  }
]);

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent,
    AddChannelComponent,
    ChannelListComponent,
    ChannelDetailComponent,
    AddMessageComponent
  ],
  imports: [
    ApolloModule.forRoot(provideClient),
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
