// The model sometimes writes "linkedin.com/in/..." without https://, and
// Markdown only turns addresses that start with https:// or www. into links.
// Add the missing https:// for the sites the twin talks about.
const BARE_LINK =
  /(^|[\s(])((?:www\.)?(?:linkedin\.com|github\.com|davidaguirre\.tech)(?:\/[^\s)]*)?)/g;

export function addMissingProtocols(text: string) {
  return text.replace(BARE_LINK, "$1https://$2");
}
