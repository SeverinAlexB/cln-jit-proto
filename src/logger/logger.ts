import pino from 'pino'
import * as fs from 'fs'
import pretty from 'pino-pretty'


export function createPluginLogger(path: string): pino.Logger {
    const prettyStream = pretty({
        destination: fs.createWriteStream(path, { flags: 'a' })
    })
    
    return pino({
        level: 'info',
    }, pino.multistream([
        {
            stream: prettyStream
        }
    ]))
}