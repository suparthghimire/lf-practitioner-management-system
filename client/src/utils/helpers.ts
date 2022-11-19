const HELPERS = {
  TrailingDot: function (value: string, maxLen: number) {
    if (value.length > maxLen) {
      return value.substring(0, maxLen) + "...";
    }
    return value;
  },
};
export default HELPERS;
