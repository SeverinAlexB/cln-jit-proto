import { IGrpcCredentials, IGrpcPathCredentials, readGrpcPathCredentials } from "./createGrpc"
import { readFileSync } from 'fs'


const macCredentials: IGrpcPathCredentials = { // Mac
    grpcHost: '127.0.0.1:11002',
    caPath: '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/bob/lightningd/regtest/ca.pem',
    clientCertPath: '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/bob/lightningd/regtest/client.pem',
    clientKeyPath: '/Users/severinbuhler/.polar/networks/3/volumes/c-lightning/bob/lightningd/regtest/client-key.pem',
}

const dockerCredentials: IGrpcPathCredentials = { // Docker
    grpcHost: '127.0.0.1:11001',
    caPath: '/home/clightning/.lightning/regtest/ca.pem',
    clientCertPath: '/home/clightning/.lightning/regtest/client.pem',
    clientKeyPath: '/home/clightning/.lightning/regtest/client-key.pem',
}




export function getAppGrpcCredentials(): IGrpcCredentials {
    let cred = macCredentials
    try {
        readFileSync(macCredentials.caPath)
    } catch (e) {
        cred = dockerCredentials
    }

    return readGrpcPathCredentials(cred)
}




