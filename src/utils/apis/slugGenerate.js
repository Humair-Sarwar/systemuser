export const generateSlug = (text) => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9& ]/g, "")
    .replace(/\s+/g, "-");
};