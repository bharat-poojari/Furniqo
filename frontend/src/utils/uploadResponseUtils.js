export const getUploadUrl = (response) => {
  if (!response) return null;
  return response.url || response.imageUrl || response.data?.url || response.data?.imageUrl || response.data?.data?.url || null;
};

export const getUploadUrls = (response) => {
  if (!response) return [];
  const urls = response.urls || response.data?.urls || response.data?.data?.urls || response.images || response.uploads || response.data?.images || [];
  if (Array.isArray(urls)) {
    return urls.map((item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl)).filter(Boolean);
  }
  return [];
};

export const getUploadedImages = (response) => {
  if (!response) return [];
  const images = response.images || response.data?.images || response.data?.data?.images || response.uploads || [];
  if (Array.isArray(images)) {
    return images.map((item) => (typeof item === 'string' ? item : item?.url || item?.imageUrl)).filter(Boolean);
  }
  return [];
};
