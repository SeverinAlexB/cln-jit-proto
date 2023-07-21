# blocktank-lsp-ln2

Microservice worker to interact with Lightning Network nodes.
If you are looking for the previous version of this project checkout [blocktank-worker-ln v1](https://github.com/synonymdev/blocktank-worker-ln).

## Usage

* `npm install` Install dependencies.
* `npm run build` Build the project.
* `npm run start-service` Start the worker to listen on the API.
* `npm run start-watcher` Listens to LND events. *Dont run multiple instances of this command. MongoDb transactions don't work without a replicaset.*

### pm2

A `ecosystem.config.js` is provided to run the service with [pm2](https://pm2.keymetrics.io/).

- Build typescript to javascript: `npm run build`.
- Start service: `pm2 start ecosystem.config.js`.
  - Worker logs: `pm2 logs blocktank-lsp-ln2:worker`.
  - Watcher logs: `pm2 logs blocktank-lsp-ln2:watcher`.
- Stop service: `pm2 stop ecosystem.config.js`.

## Configuration

Configuration is done with the `config.json` file in the root of this project. See `config.json.example` for an example.

**Multiple nodes** can be configured. When creating a HODL invoice or a channel, the node will be selected randomly.

### LND

Add these two options to LND to support 0conf channels:

```
--protocol.option-scid-alias
--protocol.zero-conf
```


## APIs

### Bolt11 invoices

* `createHodlInvoice(amountSat: number, description: string, expiresInMs: number = 60*60*1000): IBolt11Invoice`
    * amountSat: amount in satoshis.
    * description: description of the invoice.
    * expiresInMs: time in milliseconds until the invoice expires. Default 1 hour.
    * Returns Bolt11Invoice object.

* `cancelHodlInvoice(invoiceId: string): void`
    * invoiceId: Id of the invoice to cancel.

* `settleHodlInvoice(invoiceId: string): void`
    * invoiceId: Id of the invoice to settle.

* `getInvoice(invoiceId: string): IBolt11Invoice`
    * invoiceId: Id of the invoice to get.
    * Returns Bolt11Invoice object.

* `createInvoice(amountSat: number, description: string, expiresInMs: number = 60*60*1000): IBolt11Invoice`
    * amountSat: amount in satoshis.
    * description: description of the invoice.
    * expiresInMs: time in milliseconds until the invoice expires. Default 1 hour.
    * Returns Bolt11Invoice object.


> **Note:** A HODL invoice in the state `holding` is automatically canceled 10 blocks before it runs into the payment CLTV timeout to prevent channel force closures. With a default of 40 blocks, the hold invoice needs to be settled within 30 blocks (about 5 hours) after it has been paid.

#### Events

The event `blocktank-lsp-ln2`.`invoiceChanged` will notify when an invoice state changes. The event data is of type `IInvoiceChangedEvent`.
The most important event is `Bolt11InvoiceState.HOLDING`. It indicates that the invoice has been paid but the payment has not been settled yet. You need to either call `settleHodlInvoice` (to settle the invoice) or `cancelHodlInvoice` (to refund the payment).

```typescript
export enum Bolt11InvoiceState {
    PENDING = 'pending', // Expect payment
    HOLDING = 'holding', // Payment received but not confirmed/rejected yet. Only hodl invoices can have this state.
    PAID = 'paid', // Payment confirmed
    CANCELED = 'canceled', // Payment rejected or invoice expired.
}

export interface IInvoiceChangedEvent {
    invoiceId: string,
    state: {
        old: HodlInvoiceState,
        new: HodlInvoiceState
    },
    updatedAt: Date
}
```

### Channel open

Open a channel with a peer. This includes establishing the peer connection.

* `orderChannel(connectionString: string, isPrivate: boolean, localBalanceSat: number, pushBalanceSat: number = 0): IOpenChannelOrder`
    * connectionString: connection string of the peer to open the channel with. pubkey@host:port
    * isPrivate: whether the channel should be private or not.
    * localBalanceSat: amount of satoshis to commit to the channel.
    * pushBalanceSat: amount of satoshis to push to the peer. Default 0.
    * Returns OpenChannelOrder object.
    * Throws `ChannelOpenError` if the channel could not be opened.
        * `error.code` shows the reason.

* `getOrderedChannel(id: string): IOpenChannelOrder`
    * id: id of the order to get.
    * Returns OpenChannelOrder object.

* `isNodeWithMinimumOnchainBalanceAvailable(minimumBalanceSat: number): boolean`
    * minimumBalanceSat: minimum amount of satoshis that should be available on the node.
    * Returns true if the node has at least the minimum balance available.

#### Events

The event `blocktank-lsp-ln2`.`channelChanged` will notify when a channel order state changes. The event data is of type `IOpenChannelEvent`.


```typescript
export enum OpenChannelOrderState {
    OPENING = 'opening',
    OPEN = 'open',
    CLOSED = 'closed',
}

export interface IOpenChannelEvent {
    orderId: string,
    state: {
        old: OpenChannelOrderState,
        new: OpenChannelOrderState
    },
    updatedAt: Date
}
```

### Payments

* `makePayment(request: string, maxFeePpm: number = 10*1000): IBolt11Payment`
    * request: bolt11 invoice to pay.
    * maxFeePpm: maximum fee in parts per million. Default 10*1000 = 1%.
    * Returns Bolt11Payment object.

* `getPayment(paymentId: string): IBolt11Payment`
    * paymentId: Payment id of the payment to get.
    * Returns Bolt11Payment object.


#### Events

The event `blocktank-lsp-ln2`.`paymentChanged` will notify when a payment state changes. The event data is of type `IBolt11PayChangedEvent`.

```typescript
interface IBolt11PayChangedEvent {
    paymentId: string,
    state: {
        old: Bolt11PaymentState,
        new: Bolt11PaymentState
    },
    updatedAt: Date
}
```

## Testing

Most tests are not working because they require e2e testing with multiple LND nodes.

Test LND nodes are configure in [tests/lightningNodeFactory.ts](tests/lightningNodeFactory.ts). Use the [blocktank-lsp-ln_2.polar.zip network](./tests/blocktank-lsp-ln_3.polar.zip) in Polar to run the tests.