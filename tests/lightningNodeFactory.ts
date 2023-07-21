import { ILndNodeConfig } from "../src/1_config/ILndNodeConfig"
import { readLndConnectionInfo2 } from "../src/1_lnd/lndNode/ILndConnectionInfo"
import { LndNode } from "../src/1_lnd/lndNode/LndNode"

/**
 * Main LND node that we interact with.
 */
const mainNodeConfig: ILndNodeConfig = {
    grpcSocket: '127.0.0.1:10001',
    certPath: '/Users/severinbuhler/.polar/networks/3/volumes/lnd/alice/tls.cert',
    macaroonPath: '/Users/severinbuhler/.polar/networks/3/volumes/lnd/alice/data/chain/bitcoin/regtest/admin.macaroon'
}

export async function mainNodeFactory(): Promise<LndNode> {
    const connectionInfo = readLndConnectionInfo2(mainNodeConfig)
    const node = new LndNode(connectionInfo)
    await node.connect()
    return node
}


/**
 * Counter LND node that we open channels to or make paymentst to.
 */
const counterNodeConfig: ILndNodeConfig = {
    grpcSocket: '127.0.0.1:10005',
    certPath: '/Users/severinbuhler/.polar/networks/3/volumes/lnd/erin/tls.cert',
    macaroonPath: '/Users/severinbuhler/.polar/networks/3/volumes/lnd/erin/data/chain/bitcoin/regtest/admin.macaroon'
}

export async function counterNodeFactory(): Promise<LndNode> {
    const connectionInfo = readLndConnectionInfo2(counterNodeConfig)
    const node = new LndNode(connectionInfo)
    await node.connect()
    return node
}


