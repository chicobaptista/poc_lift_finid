import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndyService {

  constructor() { }

  createBankProfile() {
    return new Promise(resolve => {
      const profile = {
        did: 'did:sov:2wJPyULfLLnYTEFYzByfUR'
      };
      resolve(profile);
    });
  }

  createNewTransferDid() {
    return new Promise(resolve => {
      const transfer = {
        did: 'did:sov:29wksjcn38djfh47ruqrtcd5'
      };
      resolve(transfer);
    });
  }

  getTransferInfo(queryDid: string) {
    return new Promise(resolve => {

      const query = {
        operation: {
          did: queryDid,
          type: 'GET_NYM'
        }
      };
      const response = {
        submitterId: 'did:sov:29wksjcn38djfh47ruqrtcd5',
        signature: '1qaz2wsx3edc4rfv5tgb6yhn7ujm8iklop==',
        reqId: 'okn987yhbgFtErDsCXsw',
        operation: {
            type: 'NYM',
            did: 'did:sov:mnjkl98uipsndg2hdjdjuf7',
            document: {
                publicKey: [{
                    id: 'key1',
                    type: 'ED25519SignatureVerification',
                    publicKeyBase58: '...'
                }],
                authentication: [{
                    type: 'ED25519SigningAuthentication',
                    publicKey: 'key1'
                }],
                service: [{
                  type: 'agentService',
                  serviceEndpoint: 'https://www.sovrin.org/agents'
                }]
            }
        }
    };
      resolve(response);
    });
  }
}
