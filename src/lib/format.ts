const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(iso: string) {
  return DATE.format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return DATE_TIME.format(new Date(iso));
}
