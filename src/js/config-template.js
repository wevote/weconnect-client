/* eslint-disable */
// Note that we import these values where needed as "webAppConfig"
module.exports = {
  WECONNECT_NAME_FOR_BROWSER_TAB_TITLE: 'WeConnect',
  WECONNECT_URL_PROTOCOL: 'http://', // 'http://' for local dev (if not using SSL), or 'https://' for live server
  WECONNECT_HOSTNAME: 'localhost:4000', // Don't add 'http...' here.  Live server: 'WeVote.US', Quality: 'quality.WeVote.US', developers: 'localhost:4000'
  WECONNECT_IMAGE_PATH_FOR_CORDOVA: 'https://wevote.us',   // If you are not working with Cordova, you don't need to change this
  SECURE_CERTIFICATE_INSTALLED: false,

  ///////////////////////////////////////////////
  // Keep both configuration blocks below, but only uncomment one of them at a time.
  //// Connecting to local WeConnect APIs ////
  WECONNECT_SERVER_ROOT_URL: 'http://localhost:8080/',
  WECONNECT_SERVER_ADMIN_ROOT_URL: 'http://localhost:8080/admin/',
  WECONNECT_SERVER_API_ROOT_URL: 'http://localhost:8080/apis/v1/',
  WECONNECT_SERVER_API_CDN_ROOT_URL: 'http://localhost:8080/apis/v1/',
  //// Connecting to live WeConnect APIs ////
  // WECONNECT_SERVER_ROOT_URL: 'https://weconnectserver.org/',
  // WECONNECT_SERVER_ADMIN_ROOT_URL: 'https://weconnectserver.org/admin/',
  // WECONNECT_SERVER_API_ROOT_URL: 'https://weconnectserver.org/apis/v1/',
  // WECONNECT_SERVER_API_CDN_ROOT_URL: 'https://cdn.weconnectserver.org/apis/v1/',

  // For when we need to connect to the WeVoteServer APIs
  WE_VOTE_URL_PROTOCOL: 'http://', // 'http://' for local dev (if not using SSL), or 'https://' for live server
  WE_VOTE_HOSTNAME: 'localhost:3000', // Don't add 'http...' here.  Live server: 'WeVote.US', Quality: 'quality.WeVote.US', developers: 'localhost:3000'

  ///////////////////////////////////////////////
  // Keep both configuration blocks below, but only uncomment one of them at a time.
  //// Connecting to local WeVoteServer APIs ////
  // WE_VOTE_SERVER_ROOT_URL: 'http://localhost:8000/',
  // WE_VOTE_SERVER_ADMIN_ROOT_URL: 'http://localhost:8000/admin/',
  // WE_VOTE_SERVER_API_ROOT_URL: 'http://localhost:8000/apis/v1/',
  // WE_VOTE_SERVER_API_CDN_ROOT_URL: 'http://localhost:8000/apis/v1/',
  //// Connecting to live WeVoteServer APIs ////
  WE_VOTE_SERVER_ROOT_URL: 'https://api.wevoteusa.org/',
  WE_VOTE_SERVER_ADMIN_ROOT_URL: 'https://api.wevoteusa.org/admin/',
  WE_VOTE_SERVER_API_ROOT_URL: 'https://api.wevoteusa.org/apis/v1/',
  WE_VOTE_SERVER_API_CDN_ROOT_URL: 'https://cdn.wevoteusa.org/apis/v1/',

  ENABLE_NEXT_RELEASE_FEATURES: true,
  ENABLE_WORKBOX_SERVICE_WORKER: false,  // After setting this false, in Chrome DevTools go to Application Tab, Application/Service Worker and for the sw.js click the "unregister" button to the right

  DEBUG_MODE: false,
  SHOW_TEST_OPTIONS: false,    // On the DeviceDialog and elsewhere

  LOG_RENDER_EVENTS: false,
  LOG_ONLY_FIRST_RENDER_EVENTS: false,
  LOG_HTTP_REQUESTS: false,
  LOG_ROUTING: false,
  LOG_SIGNIN_STEPS: false,  // oAuthLog function prints to console
  LOG_CORDOVA_OFFSETS: false,
  SHOW_CORDOVA_URL_FIELD: false,  // Only needed for debugging in Cordova

  // Use 1 or 0 as opposed to true or false
  test: {
    use_test_election: 0,
  },

  location: {
    text_for_map_search: '',
  },

  ENABLE_FACEBOOK: false,
  ENABLE_TWITTER: false,

  // API Keys, some of these are publishable (not secret)
  GOOGLE_ADS_TRACKING_ID: '',
  GOOGLE_TAG_MANAGER_ID: '',
  GOOGLE_ANALYTICS_TRACKING_ID: '',
  GOOGLE_MAPS_API_KEY: '',
  GOOGLE_RECAPTCHA_KEY: '',
  OPEN_REPLAY_PROJECT_KEY: '',
  OPEN_REPLAY_INGEST_POINT: 'https://openreplay.wevote.us/ingest',
};
