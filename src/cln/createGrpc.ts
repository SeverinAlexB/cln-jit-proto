import { Node } from '../proto/cln/node_connect'

import { PromiseClient, createPromiseClient } from "@bufbuild/connect";
import { createGrpcTransport } from "@bufbuild/connect-node";
import { readFileSync } from 'fs'

export interface IGrpcCredentials {
    grpcHost: string,
    ca: Buffer,
    clientCert: Buffer,
    clientKey: Buffer
}

export interface IGrpcPathCredentials {
    grpcHost: string,
    caPath: string,
    clientCertPath: string,
    clientKeyPath: string
}

export function readGrpcPathCredentials(pathCred: IGrpcPathCredentials): IGrpcCredentials {
    const ca = readFileSync(pathCred.caPath)
    const clientCert = readFileSync(pathCred.clientCertPath)
    const clientKey = readFileSync(pathCred.clientKeyPath)

    return {
        grpcHost: pathCred.grpcHost,
        ca,
        clientCert,
        clientKey
    }
}



export type ClnGrpcType = PromiseClient<typeof Node>;

export async function createGrpc(credentials: IGrpcCredentials): Promise<ClnGrpcType> {
    const transport = createGrpcTransport({
        httpVersion: "2",
        baseUrl: "https://" + credentials.grpcHost,
        nodeOptions: {
            ca: credentials.ca,// root cert
            key: credentials.clientKey, // private key
            cert: credentials.clientCert, // my cert
            servername: 'cln'
        }
    });
    const client = createPromiseClient(Node, transport);
    return client
}
