# Kiota Client Exploration

This repository used Kiota to generate three clients from our OpenAPI specification: 

```
kiota generate -l typescript -d open-payments-specifications/openapi/auth-server.yaml -c authClient -o ./packages/kiota-client/auth/src 

kiota generate -l typescript -d open-payments-specifications/openapi/wallet-address-server.yaml -c walletAddressClient -o ./packages/kiota-client/wallet-address/src 

kiota generate -l typescript -d open-payments-specifications/openapi/resource-server.yaml -c resourceClient -o ./packages/kiota-client/resource/src 
```

In `src/index.ts` you will find how these clients can be imported, used, and customized. The script does not work for authenticated requests, it is simply to give an example of usage. After `pnpm install`, the script can be ran using `pnpm build && pnpm start`, provided you have ran `pnpm install`.

