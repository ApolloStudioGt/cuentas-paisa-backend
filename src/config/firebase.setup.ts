import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { envs } from './envs';
let app: admin.app.App = null;
@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    if (!app) {
      const serviceAccount: any = {
        type: envs.firebaseAdminType,
        project_id: envs.firebaseAdminProjectId,
        private_key_id: envs.firebaseAdminPrivateKeyId,
        private_key: envs.firebaseAdminPrivateKey,
        client_email: envs.firebaseAdminClientEmail,
        client_id: envs.firebaseAdminClientId,
        auth_uri: envs.firebaseAdminAuthUri,
        token_uri: envs.firebaseAdminTokenUri,
        auth_provider_x509_cert_url: envs.firebaseAdminAuthProviderX509CertUrl,
        client_x509_cert_url: envs.firebaseAdminClientX509CertUrl,
        universe_domain: envs.firebaseAdminUniverseDomain,
      };
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });

      const firebaseConfig = {
        apiKey: envs.firebaseApiKey,
        authDomain: envs.firebaseAuthDomain,
        projectId: envs.firebaseProjectId,
        storageBucket: envs.firebaseStorageBucket,
        messagingSenderId: envs.firebaseMessagingSenderId,
        appId: envs.firebaseAppId,
        measurementId: envs.firebaseMesarumentId,
      };

      initializeApp(firebaseConfig);
    }
  }
  setup() {
    return app;
  }
}
