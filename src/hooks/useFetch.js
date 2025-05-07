export const useFetch = () => {
  return async (url, options = {}) => {
    const res = await fetch(url, {
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      /* --- NEW: smarter error extraction --- */
      let errMsg = `HTTP ${res.status}`;
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        if (json.message) errMsg = json.message;
      } catch {
        errMsg = text || errMsg;
      }

      throw new Error(errMsg);
    }

    /* success path */
    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");
    return isJson ? await res.json() : await res.text();
  };
};
