import { JSONRPCServer } from "json-rpc-2.0";
import { getAppLogger } from './logger/logger';

const logger = getAppLogger()



async function main() {
    const server = new JSONRPCServer()
    server.addMethod('getmanifest', (args) => {
        return {
            "options": [
                // {
                //     "name": "cln-jit-proto",
                //     "type": "string",
                //     "default": "World",
                //     "description": "cln jit proto test description",
                //     "deprecated": false,
                //     "dynamic": false
                // }
            ],
            "rpcmethods": [
                {
                    "name": "hello",
                    "usage": "[name]",
                    "description": "Returns a personalized greeting for {greeting} (set via options)."
                },
            ],
            // "subscriptions": [
            //     "connect",
            //     "disconnect"
            // ],
            // "hooks": [
            //     { "name": "openchannel", "before": ["another_plugin"] },
            //     { "name": "htlc_accepted" }
            // ],
            // "featurebits": {
            //     "node": "D0000000",
            //     "channel": "D0000000",
            //     "init": "0E000000",
            //     "invoice": "00AD0000"
            // },
            // "notifications": [
            //     {
            //         "method": "mycustomnotification"
            //     }
            // ],
            "nonnumericids": true,
            "dynamic": true
        }
    })
    server.addMethod('init', (args) => {
        return {}
    })
    server.addMethod('hello', (params) => {
        return `Hello ${params}`
    })
    process.stdin.on("data", async data => {
        const request = JSON.parse(data.toString())
        try {
            logger.info(request, `Request received ${request.id} ${request.method}`)
            const response = await server.receive(request)
            const stringified = JSON.stringify(response)
            logger.info(response, `Response generated ${request.id} ${request.method}`)
            process.stdout.write(stringified + "\n")
        } catch (e) {
            logger.error({error:e}, `Error request ${request.id} ${request.method}`)
        }

    })
    logger.info('Plugin started')
}

main()