export const isValid = (data) => {
  if (data === null) return false;
  if (data === undefined) return false;
  if (Object.keys(data).length === 0) return false;

  return true;
};

export const getValidDefaultValue = (data, defaultValue) => {
  if (isValid(data)) return data;
  else return defaultValue;
};
