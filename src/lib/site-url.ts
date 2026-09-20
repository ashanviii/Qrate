// process.env.NEXT_PUBLIC_SITE_URL can be an empty string (e.g. a blank env
// var set in a hosting dashboard), not just unset — `||` catches that,
// `??` does not.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
