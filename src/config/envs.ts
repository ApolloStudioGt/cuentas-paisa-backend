import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_URL: string;
  FIREBASE_ADMIN_TYPE: string;
  FIREBASE_ADMIN_PROJECT_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY_ID: string;
  FIREBASE_ADMIN_PRIVATE_KEY: string;
  FIREBASE_ADMIN_CLIENT_EMAIL: string;
  FIREBASE_ADMIN_CLIENT_ID: string;
  FIREBASE_ADMIN_AUTH_URI: string;
  FIREBASE_ADMIN_TOKEN_URI: string;
  FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: string;
  FIREBASE_ADMIN_CLIENT_X509_CERT_URL: string;
  FIREBASE_ADMIN_UNIVERSE_DOMAIN: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID;
  FIREBASE_MESARUMENT_ID: string;
}

const envsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    FIREBASE_ADMIN_TYPE: joi.string().required(),
    FIREBASE_ADMIN_PROJECT_ID: joi.string().required(),
    FIREBASE_ADMIN_PRIVATE_KEY_ID: joi.string().required(),
    FIREBASE_ADMIN_PRIVATE_KEY: joi.string().required(),
    FIREBASE_ADMIN_CLIENT_EMAIL: joi.string().required(),
    FIREBASE_ADMIN_CLIENT_ID: joi.string().required(),
    FIREBASE_ADMIN_AUTH_URI: joi.string().required(),
    FIREBASE_ADMIN_TOKEN_URI: joi.string().required(),
    FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL: joi.string().required(),
    FIREBASE_ADMIN_CLIENT_X509_CERT_URL: joi.string().required(),
    FIREBASE_ADMIN_UNIVERSE_DOMAIN: joi.string().required(),
    FIREBASE_API_KEY: joi.string().required(),
    FIREBASE_AUTH_DOMAIN: joi.string().required(),
    FIREBASE_PROJECT_ID: joi.string().required(),
    FIREBASE_STORAGE_BUCKET: joi.string().required(),
    FIREBASE_MESSAGING_SENDER_ID: joi.string().required(),
    FIREBASE_APP_ID: joi.string().required(),
    FIREBASE_MESARUMENT_ID: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  databaseUrl: envVars.DATABASE_URL,
  firebaseAdminType: envVars.FIREBASE_ADMIN_TYPE,
  firebaseAdminProjectId: envVars.FIREBASE_ADMIN_PROJECT_ID,
  firebaseAdminPrivateKeyId: envVars.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  firebaseAdminPrivateKey: envVars.FIREBASE_ADMIN_PRIVATE_KEY,
  firebaseAdminClientEmail: envVars.FIREBASE_ADMIN_CLIENT_EMAIL,
  firebaseAdminClientId: envVars.FIREBASE_ADMIN_CLIENT_ID,
  firebaseAdminAuthUri: envVars.FIREBASE_ADMIN_AUTH_URI,
  firebaseAdminTokenUri: envVars.FIREBASE_ADMIN_TOKEN_URI,
  firebaseAdminAuthProviderX509CertUrl:
    envVars.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  firebaseAdminClientX509CertUrl: envVars.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  firebaseAdminUniverseDomain: envVars.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
  firebaseApiKey: envVars.FIREBASE_API_KEY,
  firebaseAuthDomain: envVars.FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: envVars.FIREBASE_PROJECT_ID,
  firebaseStorageBucket: envVars.FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: envVars.FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: envVars.FIREBASE_APP_ID,
  firebaseMesarumentId: envVars.FIREBASE_MESARUMENT_ID,
};
