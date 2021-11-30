import type { AWS } from '@serverless/typescript'
import {
  createAccount,
  readAccount,
  readAccountList,
  updateAccount,
  deleteAccount
} from 'src/lambdas';

const serverlessConfiguration: AWS = {
  service: 'aws-typescript-api',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  custom: {
    stage: '${opt:stage, self:provider.stage}',
    settings:{
      dev:{
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        DB_HOST: 'cluster0.hkbeh.mongodb.net/',
        DB_USERNAME: 'apiRoot',
        DB_PASSWORD: 'BpTNKCgFmhYcSfnm',
        DB: 'myFirstDatabase'
      },
      prod:{
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        DB_HOST: 'cluster0.hkbeh.mongodb.net/',
        DB_USERNAME: 'apiRoot',
        DB_PASSWORD: 'BpTNKCgFmhYcSfnm',
        DB: 'myFirstDatabase'
      }
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    lambdaHashingVersion: '20201221',
    region: 'eu-west-1',
    stage: 'dev'
  },
  // import the function via paths
  functions: {
    createAccount,
    readAccount,
    readAccountList,
    updateAccount,
    deleteAccount
  },
  package: { individually: true },
};
if (process.env.NODE_ENV === 'production') {
  serverlessConfiguration
      .provider
      .environment =
  serverlessConfiguration
      .custom
      .settings['prod'];
} else {
  serverlessConfiguration
      .provider
      .environment =
  serverlessConfiguration
      .custom
      .settings['dev'];
}

module.exports = serverlessConfiguration;
