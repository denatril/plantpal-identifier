import 'dotenv/config';

export default {
  expo: {
    name: 'plant-analyzer',
    slug: 'plant-analyzer',
    version: '1.0.1',
    android: {
      versionCode: 3,
      package: 'com.volkner.plantify',
    },
    extra: {
    openaiApiKey: process.env.OPENAI_API_KEY,
      eas: {
        projectId: 'cab00c11-d8ba-4d67-b39e-039df5e4f6d9'
      }
    },
  },
};