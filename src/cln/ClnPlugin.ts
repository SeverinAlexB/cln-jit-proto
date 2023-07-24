import { JSONRPCServer, SimpleJSONRPCMethod } from "json-rpc-2.0";
import { IInitOptions2305 } from "./IInitOptions2305";
import { IManifestResponse2305 } from "./IManifestResponse2305";
import { createPluginLogger } from "../logger/logger";
import pino from 'pino'


export interface IAddRpcMethodOptions {
    /**
     * Name of the method
     */
    name: string,
    /**
     * Method arguments. Optional parameters must be put into [] brackets.
     */
    usage: string,
    description: string,
    long_description?: string,
    deprecated?: boolean
}

export interface IAddHookMethodOptions {
    /**
     * Name of the method
     */
    name: string,
    before?: string[]
}

export class ClnPlugin {
    public options: IInitOptions2305
    public server = new JSONRPCServer()
    public allowDeprecatedApis: boolean
    public logger: pino.Logger
    constructor(public manifest: Partial<IManifestResponse2305> = {}, loggingFilePath: string = 'clnPluginLog.txt') {
        this.logger = createPluginLogger(loggingFilePath)

        if (!manifest.options) {
            manifest.options = [] // Default value that is needed.
        }
        this.server.addMethod('getmanifest', (args) => {
            this.allowDeprecatedApis = args['allow-deprecated-apis']
            if (this.allowDeprecatedApis) {
                this.logger.info(`User set allow-deprecated-apis to false.`)
            }
            return this.manifest
        })
        this.server.addMethod('init', (args) => {
            this.options = args
            return {}
        })
    }

    /**
     * Add new method to RPC
     * @param options 
     * @param method 
     */
    addRpcMethod(options: IAddRpcMethodOptions, method: SimpleJSONRPCMethod) {
        this.server.addMethod(options.name, method)

        // Add to manifest if not already in there.
        if (!Array.isArray(this.manifest.rpcmethods)) {
            this.manifest.rpcmethods = []
        }
        const alreadyInThere = this.manifest.rpcmethods.find(obj => obj.name === options.name)
        if (!alreadyInThere) {
            this.manifest.rpcmethods.push({
                ...options
            })
        }
    }

    /**
     * Add new hook method
     * @param options 
     * @param method 
     */
    addHookMethod(options: IAddHookMethodOptions, method: SimpleJSONRPCMethod) {
        this.server.addMethod(options.name, method)

        // Add to manifest if not already in there.
        if (!Array.isArray(this.manifest.hooks)) {
            this.manifest.hooks = []
        }
        const alreadyInThere = this.manifest.hooks.find(obj => obj.name === options.name)
        if (!alreadyInThere) {
            this.manifest.hooks.push({
                ...options
            })
        }
    }

    /**
     * Hijects stdin and stdout and responds to JSONRPC requests from core-lightning.
     */
    start() {
        process.stdin.on("data", async data => {
            const request = JSON.parse(data.toString())
            try {
                this.logger.info(request, `Request received ${request.id} ${request.method}`)
                const response = await this.server.receive(request)
                const stringified = JSON.stringify(response)
                this.logger.info(response, `Response generated ${request.id} ${request.method}`)
                process.stdout.write(stringified + "\n")
            } catch (e) {
                this.logger.error({ error: e }, `Error request ${request.id} ${request.method}`)
                throw e
            }

        })
    }
}