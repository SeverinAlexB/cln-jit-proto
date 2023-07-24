/**
 * https://docs.corelightning.org/docs/a-day-in-the-life-of-a-plugin
 */

export interface IManifestResponse2305 {
    /**
     * During startup the options will be added to the list of command line options that lightningd accepts. 
     * If any options "name" is already taken startup will abort. The above will add a --greeting option with a 
     * default value of World and the specified description. Notice that currently string, integers, bool, and 
     * flag options are supported. If an option specifies dynamic: true, then it should allow a setvalue call for 
     * that option after initialization.
     */
    options: {
        name: string,
        type: string,
        default: string,
        description: string,
        deprecated: boolean,
        dynamic: boolean
    }[],
    /**
     * The rpcmethods are methods that will be exposed via lightningd's JSON-RPC over 
     * Unix-Socket interface, just like the builtin commands. Any parameters given to the 
     * JSON-RPC calls will be passed through verbatim. Notice that the name, description and usage fields
     * are mandatory, while the long_description can be omitted (it'll be set to description if it was not provided). 
     * usage should surround optional parameter names in [].
     */
    rpcmethods: {
            name: string,
            usage: string,
            description: string
        }[],
    subscriptions: string[],
    hooks: { 
        name: string, 
        before?: string[]
    }[],
    featurebits: {
        node: string,
        channel: string,
        init: string,
        invoice: string
    },
    /**
     * The notifications array allows plugins to announce which custom notifications they intend to send to lightningd. 
     * These custom notifications can then be subscribed to by other plugins, allowing them to communicate with each other 
     * via the existing publish-subscribe mechanism and react to events that happen in other plugins, or collect information 
     * based on the notification topics.
     */
    notifications: {
        method: string
    }[],
    nonnumericids: boolean,
    dynamic: boolean
}