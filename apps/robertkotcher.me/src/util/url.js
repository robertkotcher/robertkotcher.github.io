// URLSearchParams is not available in IE, so I'm going to toss together
// some quick functions for managing URL parameters

export function getUrlParams(windowRef) {
  return windowRef.location.search.substr(1)
    .split('&')
    .reduce((memo, val) => {
      // NOTE: "".split('&') -> ['']
      if (val) {
        const tuple = val.split('=');
        memo[tuple[0]] = tuple[1];
      }

      return memo;
    }, {});
}

export function setSingleUrlParam(windowRef, params) {
  const origin = windowRef.location.origin;
  const path = windowRef.location.pathname;

  const keys = Object.keys(params);
  const search = keys.reduce((memo, key, i) => {
    if (memo.length == 0) {
      memo += '?';
    }

    memo += `${key}=${params[key]}`;

    if (i < keys.length - 1) {
      memo += '&';
    }

    return memo;
  }, '');

  const newUrl = `${origin}${path}${search}`;

  windowRef.history.pushState({}, "", newUrl);
}
