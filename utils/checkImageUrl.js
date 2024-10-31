exports.isImageUrl = (url) => {
  const imagePattern = /\.(jpeg|jpg|gif|png|bmp)$/i;
  return imagePattern.test(url);
};
