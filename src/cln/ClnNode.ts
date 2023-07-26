import { uint8ArrToHex } from "../helpers/uint8hex";
import { IHtlcAccepted } from "../onion/IHtlcAccepted";
import { GetinfoResponse } from "../proto/cln/node_pb";
import { ClnGrpcType, IGrpcCredentials, IGrpcPathCredentials, createGrpc, readGrpcPathCredentials } from "./createGrpc";

export class ClnNode {
    private _info: GetinfoResponse
    public grpc: ClnGrpcType
    constructor(public credentials: IGrpcCredentials) {

    }

    /**
     * Factory for paths.
     * @param credentials 
     * @returns 
     */
    static byPaths(credentials: IGrpcPathCredentials) {
        const cred = readGrpcPathCredentials(credentials)
        return new ClnNode(cred)
    }

    /**
     * Establish GRPC connection.
     */
    async connect() {
        const client = await createGrpc(this.credentials)
        try {
            this._info = await client.getinfo({})
            this.grpc = client
        } catch (e) {
            throw new Error(`Failed to connect to grpc. ${e}`, {
                cause: e
            })
        }
    }

    get isConnected(): boolean {
        return !!this._info
    }

    get alias(): string {
        return this._info.alias
    }

    get pubkey(): string {
        return uint8ArrToHex(this._info.id)
    }

    get version(): string {
        return this._info.version
    }

    get description(): string {
        if (this.isConnected) {
            return `${this.alias} ${this.pubkey} ${this.version}`
        } else {
            return `GRPC-${this.credentials.grpcHost}`
        }
    }

    async getPeerChannels(id?: string) {
        return await this.grpc.listPeerChannels({
        })
    }


}