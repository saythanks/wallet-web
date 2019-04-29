export default {
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_0uIAzV8La',
    APP_CLIENT_ID: '7o7r9p6u3vcjsr1apk06blch3f',
    IDENTITY_POOL_ID: 'YOUR_IDENTITY_POOL_ID',
  },
  stripe: {
    apiKey:
      process.env.NODE_ENV === 'production'
        ? 'pk_live_3jLMLDZZo9MhvOMvWl6U7tnJ'
        : 'pk_test_Aa9HCt6t96ix37gxvpeqOKYL',
  },
  api: {
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://api.saythanks.me'
        : 'http://localhost:5000',
  },
}
