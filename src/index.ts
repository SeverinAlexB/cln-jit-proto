import { ClnGrpcType, createGrpc } from "./cln/createGrpc";
import { ClnPlugin } from "./cln/ClnPlugin";
import { forwardPayment } from "./onion/forwardPayment";
import { ClnNode } from "./cln/ClnNode";
import { getAppGrpcCredentials } from "./cln/myCredentials";
import { determinePeerNodeId } from "./onion/determinePeerNodeId";
import { IHtlcAccepted } from "./onion/IHtlcAccepted";
import { uint8ArrToHex } from "./helpers/uint8hex";
import {createHash} from 'crypto'


async function main() {
    const plugin = new ClnPlugin()
    let node: ClnNode

    plugin.onInit(async options => {
        plugin.logger.info('Init grpc')
        const cred = getAppGrpcCredentials()
        node = new ClnNode(cred)
        await node.connect()
        plugin.logger.info(`Init grpc successful - ${node.description}`)
    })

    plugin.addRpcMethod({
        name: 'hello',
        usage: "name1",
        description: "Returns a personalized greeting for {greeting} (set via options)."
    }, (params => {
        if (!Array.isArray(params) || params.length !== 1) {
            throw new Error('Needs 1 arg')
        }
        return `Hello ${params[0]}`
    }))

    plugin.addHookMethod({
        name: 'htlc_accepted'
    }, async (params: IHtlcAccepted) => {
        try {
            const peerId = await determinePeerNodeId(node, params.onion.short_channel_id)
            plugin.logger.info(`Forward the htlc to ${peerId}.`)
            if (!peerId) {
                return {
                    result: 'continue'
                }
            }
            const response = await forwardPayment(node.grpc, params, peerId, plugin.logger)
            const preimage = uint8ArrToHex(response.paymentPreimage)
            const newPaymentHash = createHash('sha256').update(Buffer.from(response.paymentPreimage)).digest('hex')
            const hashesMatch = newPaymentHash === params?.htlc?.payment_hash
            plugin.logger.info({
                originalHash: params?.htlc?.payment_hash,
                newHash: newPaymentHash,
                preimage: preimage
            }, `Compare paymentHash. ${hashesMatch?'Match!':'No match.'}`)

            if (hashesMatch) {
                return {
                    "result": "resolve",
                    "payment_key": preimage
                  }
            } else {
                return {
                    result: 'continue'
                }
            }

        } catch (e) {
            plugin.logger.error({
                error: JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)))
            }, `Error forwarding onion.`)
            return {
                result: 'continue'
            }
        }




    })

    plugin.start()
    plugin.logger.info('Plugin started')
}

main()