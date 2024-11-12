export function http(url, options) {
  return fetch(url, options).then(res => res.json());
}

export function get(url) {
  return http(url, {
    method: 'GET'
  });
}

export function post(url, data) {
  return http(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  });
}