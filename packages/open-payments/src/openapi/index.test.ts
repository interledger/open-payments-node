import {
  getResourceServerOpenAPI,
  getAuthServerOpenAPI,
  getWalletAddressServerOpenAPI
} from '.'

describe('OpenAPI', (): void => {
  describe('getResourceServerOpenAPI', () => {
    test('properly generates API paths', async () => {
      const openApi = await getResourceServerOpenAPI()

      expect(openApi).toBeDefined()
      expect(Object.keys(openApi.paths)).toEqual(
        expect.arrayContaining([
          '/incoming-payments',
          '/outgoing-payments',
          '/quotes',
          '/incoming-payments/{id}',
          '/incoming-payments/{id}/complete',
          '/outgoing-payments/{id}',
          '/quotes/{id}'
        ])
      )
    })
  })

  describe('getAuthServerOpenAPI', () => {
    test('properly generates API paths', async () => {
      const openApi = await getAuthServerOpenAPI()

      expect(openApi).toBeDefined()
      expect(Object.keys(openApi.paths)).toEqual(
        expect.arrayContaining(['/', '/continue/{id}', '/token/{id}'])
      )
    })
  })

  describe('getWalletAddressServerOpenAPI', () => {
    test('properly generates API paths', async () => {
      const openApi = await getWalletAddressServerOpenAPI()

      expect(openApi).toBeDefined()
      expect(Object.keys(openApi.paths)).toEqual(
        expect.arrayContaining(['/', '/jwks.json', '/did.json'])
      )
    })
  })
})
