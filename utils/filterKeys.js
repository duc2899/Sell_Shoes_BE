exports.filterKeys = (obj, keysToExclude) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keysToExclude.includes(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};
