import { ClnNode } from "../cln/ClnNode"
import { uint8ArrToHex } from "../helpers/uint8hex"

export async function determinePeerNodeId(node: ClnNode, nextChannelId: string): Promise<string | undefined> {
    const {channels} = await node.getPeerChannels()
    console.log(channels)
    const match = channels.find(channel => {
        return channel.shortChannelId === nextChannelId || channel.alias?.local === nextChannelId || channel.alias?.remote === nextChannelId
    })
    if (!match) {
        return undefined
    }
    return uint8ArrToHex(match.peerId)
}