export const stripHtmlTags = (html: string | undefined) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};
