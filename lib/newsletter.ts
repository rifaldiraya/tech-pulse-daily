/**
 * Newsletter delivery is delegated to Buttondown's public embed endpoint, so the
 * site stays fully static: the browser posts the form directly to Buttondown and
 * no API key or server route is involved. Set NEXT_PUBLIC_BUTTONDOWN_USERNAME in
 * .env.local to enable the form; without it the component keeps its demo state.
 */
const rawUsername = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME?.trim() ?? "";
const username = /^[A-Za-z0-9_-]+$/.test(rawUsername) ? rawUsername : "";

export const NEWSLETTER = {
  provider: "buttondown",
  username,
  enabled: username.length > 0,
  action: username
    ? `https://buttondown.com/api/emails/embed-subscribe/${username}`
    : undefined,
} as const;
