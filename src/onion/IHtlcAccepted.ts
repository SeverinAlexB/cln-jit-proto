export interface IHtlcAccepted {
    "onion": {
        "payload": string,
        "type": string,
        "short_channel_id": string,
        "forward_msat": number,
        "outgoing_cltv_value": number,
        "next_onion": string,
        "shared_secret": string
    },
    "forward_to": string,
    "htlc": {
        "short_channel_id": string,
        "id": number,
        "amount_msat": number,
        "cltv_expiry": number,
        "cltv_expiry_relative": number,
        "payment_hash": string
    }
}