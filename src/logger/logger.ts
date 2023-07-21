import pino from 'pino'
import * as fs from 'fs'
import pretty from 'pino-pretty'

const isJestRunning = process.env.JEST_WORKER_ID !== undefined;



function fileStream(file: string) {
    return fs.createWriteStream(file, { flags: 'a' })
}

const prettyStream = pretty({
    destination: fileStream('jsonRpc.txt')
})

const streams: any[] = [
    {
        stream: prettyStream
    }
]



const globalLogger = pino({
    level: 'info',
}, pino.multistream(streams))

export default globalLogger;


export function getAppLogger(className?: string): pino.Logger {
    return globalLogger
}