import { Node } from '../proto/cln/node_connect'

import { PromiseClient, createPromiseClient } from "@bufbuild/connect";
import { createGrpcTransport } from "@bufbuild/connect-node";
import { readFileSync } from 'fs'

const grpcHost = '127.0.0.1:11007'
const caPath = '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/grace/lightningd/regtest/ca.pem'
const clientCertPath = '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/grace/lightningd/regtest/client.pem'
const clientKeyPath = '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/grace/lightningd/regtest/client-key.pem'

const ca = readFileSync(caPath)
const clientCert = readFileSync(clientCertPath)
const clientKey = readFileSync(clientKeyPath)


export async function createNode() {
    const transport = createGrpcTransport({
        httpVersion: "2",
        baseUrl: "https://" + grpcHost,
        nodeOptions: {
            ca: ca,// root cert
            key: clientKey, // private key
            cert: clientCert,
            servername: 'cln'
        }
    });
    const client = createPromiseClient(Node, transport);
    return client
}
