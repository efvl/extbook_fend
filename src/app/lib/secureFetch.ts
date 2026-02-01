
export async function secureFetch(
  url: string,
  options?: RequestInit,
  retried = false
) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 && !retried) {
    const refresh = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refresh.ok) {
      return secureFetch(url, options, true);
    }
  }

  return res;
}