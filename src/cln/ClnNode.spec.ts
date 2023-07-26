import { getAppGrpcCredentials } from './myCredentials'
import {ClnNode} from './ClnNode'
import { uint8ArrToHex } from '../helpers/uint8hex';

jest.setTimeout(60*1000)





describe('ClnNode', () => {

    test('getChannels', async () => {
        const cred = getAppGrpcCredentials()
        const node = new ClnNode(cred)
        await node.connect()
        console.log(node.description)
        const channels = await node.getPeerChannels()
        console.log(channels)

        for (const channel of channels.channels) {
            const peerId = uint8ArrToHex(channel.peerId!)
            const shortChannelId = channel.shortChannelId!
            const channelId = uint8ArrToHex(channel.channelId!)
            const fundingTxId = uint8ArrToHex(channel.fundingTxid!)
            const shortChannelIdAlias = channel.alias?.local
            console.log(uint8ArrToHex(channel.channelId!), channel.shortChannelId)
        }

    });




});


