export const slugify = (text) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const generateDiscoveryUrl = (query, locStr = "India", catId = null) => {
  const parts = (locStr || "India").split(',').map(s => s.trim());
  let area = null;
  let city = parts[parts.length - 1] || "India";
  
  if (parts.length >= 2) {
    area = parts[0];
  }

  const citySlug = slugify(city);
  const querySlug = slugify(query);
  const areaPart = area ? `-in-${slugify(area)}` : "";

  return `/${citySlug}/${querySlug}${areaPart}`;
};
