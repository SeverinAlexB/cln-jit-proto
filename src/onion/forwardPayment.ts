import { ClnGrpcType } from "../cln/createGrpc"
import { hexToUint8Arr } from "../helpers/uint8hex"
import { IHtlcAccepted } from "./IHtlcAccepted"
import { Logger } from "pino"



export async function forwardPayment(node: ClnGrpcType, htlcAccepted: IHtlcAccepted, nextNodeId: string, logger: Logger) {
    const request = {
        onion: hexToUint8Arr(htlcAccepted.onion.next_onion),
        firstHop: {
            id: hexToUint8Arr(nextNodeId),
            amountMsat: {
                msat: BigInt(htlcAccepted.onion.forward_msat)
            },
            delay: htlcAccepted.htlc.cltv_expiry
        },
        paymentHash: hexToUint8Arr(htlcAccepted.htlc.payment_hash),
        sharedSecrets: [
            hexToUint8Arr(htlcAccepted.onion.shared_secret)
        ]
    }
    
    try {
        const response = await node.sendOnion(request)
        logger.info({
            response
        }, `Sent onion`)

    } catch (e) {
        logger.error( {
            error: JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)))
        }, `Error during sendOnion`)
        throw e
    }

    try {
        const payResponse = await node.waitSendPay({
            paymentHash: hexToUint8Arr(htlcAccepted.htlc.payment_hash)
        })
        logger.info({
            payResponse
        }, `way to resolve response`)
        return payResponse
    } catch (e) {
        logger.error( {
            error: JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e)))
        }, `Error during waitSendPay`)
        throw e
    }
}