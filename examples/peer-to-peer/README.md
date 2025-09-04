# Peer-to-Peer Payment Example

This script sends money between two wallet addresses using the [Node Open Payments client](https://github.com/interledger/open-payments-node/tree/main/packages/open-payments).

The script creates an incoming payment on the receiving wallet address, and a quote on the sending wallet address (after getting grants for both). It also creates an interactive outgoing payment grant, which will require user interaction.

The script then finalizes the grant (after it's accepted interactively via the browser), and creates the outgoing payment.

### Steps

1. Make sure you have NodeJS installed
2. Run `pnpm install`
3. Get a private key, client wallet address and keyId from an Open Payments enabled wallet, and add them in the script.

> You can use our [test wallet](https://wallet.interledger-test.dev) to create accounts, and generate developer keys for making payments via the Open Payments APIs. Instructions about how to use the test wallet are found at the [Open Payments API documentation](https://openpayments.dev/sdk/before-you-begin/).

4. Pick a receiving wallet address, a sending wallet address, and add them as variables in the script.
5. Run `node index.js`
6. Click on the outputted URL, to accept the outgoing payment grant.
7. Return to the terminal, hit enter. After this, the script will create the outgoing payment and funds will move between the receiver and the sender!
