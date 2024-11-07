export const fetchWithAuth: typeof fetch = (request, opts?) => {
  return fetch(request, {
    ...opts,
    headers: {
      ...opts?.headers,
    }
  })
}

function _fetchWithAuth(request: any, opts?: any) {
  return $fetch(request, {
    ...opts,
    headers: {
      ...opts?.headers,
    }
  })
}

_fetchWithAuth.raw = $fetch.raw
_fetchWithAuth.create = $fetch.create

export const $fetchWithAuth = _fetchWithAuth as typeof $fetch
