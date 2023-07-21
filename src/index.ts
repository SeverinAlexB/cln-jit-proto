import { createNode } from './cln/CLNode';


async function main() {
    const node = await createNode()
    
    
    
}

main().catch(e => {
    console.error(e)
    throw e
})