// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/** @ignore */
export const environment = {
  production: false,
  cordaApi: 'http://localhost:50005',
  /**
   * TODO: refatorar este dicionário para um método parseOrg em corda.service ou equivalente
   * This is a list of known corda nodes with their respective IDs.
   *
   * The IDs are used with the API to indicate in which node the flow should start
   */
  cordaOrgs : [
    { id: 'PartyA', cordaId: 'O=PartyA, L=London, C=GB'},
    { id: 'PartyB', cordaId: 'O=PartyB, L=New York, C=US'},
    { id: 'PartyC', cordaId: 'O=PartyC, L=New York, C=US'},
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
