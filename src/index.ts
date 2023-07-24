import { ClnPlugin } from "./cln/ClnPlugin";





async function main() {
    const plugin = new ClnPlugin()

    plugin.addRpcMethod({
        name: 'hello',
        usage: "name1",
        description: "Returns a personalized greeting for {greeting} (set via options)."
    },(params => {
        if (!Array.isArray(params) || params.length !== 1) {
            throw new Error('Needs 1 arg')
        }
        return `Hello ${params[0]}`
    }))

    plugin.addHookMethod({
        name: 'htlc_accepted'
    }, (params) => {
        return {
            result: 'continue'
        }
    })

    plugin.start()
    plugin.logger.info('Plugin started')
}

main()