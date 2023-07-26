export function hexToUint8Arr(hex: string): Uint8Array {
    return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function uint8ArrToHex(arr: Uint8Array): string {
    const buffer = Buffer.from(arr)
    return buffer.toString('hex')
}
