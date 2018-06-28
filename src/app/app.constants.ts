export const constants = {

  apiUrl: {
    train: '/Train',
    classify: '/Classify',
    update: '/Update'
  },

  pageUrl: {
    login: '/login',
  },

  apiRequestHeaders: {
    default: {
      contentType: 'application/json',
      ifModifiedSince: '0',
      cacheControl: 'no-cache',
      pragma: 'no-cache'
    }
  },

  apiRequestHeaderKeys: {
    contentType: 'Content-Type',
    authorization: 'Authorization',
    xAuthorization: 'X_AUTHORIZATION',
    source: 'X_SOURCE',
    authToken: 'X-Auth-Token',
    ifModifiedSince: 'If-Modified-Since',
    cacheControl: 'Cache-Control',
    pragma: 'Pragma'
  },
};
