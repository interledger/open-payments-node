### Kiota Client Experiment

https://learn.microsoft.com/en-us/openapi/kiota/quickstarts/typescript


#### Process

##### Installation

```
brew install kiota
```

##### Dependencies

While the guide say to use `npm install @microsoft/kiota-bundle`, I had issues with package resolution in our monorepo setup. Instead, I installed the dependencies separately. Check `package.json` for the exact versions.


##### Generation
```
kiota generate -l typescript -d open-payments-specifications/openapi/auth-server.yaml -c authClient -o ./packages/kiota-client/auth-server/src 
```

