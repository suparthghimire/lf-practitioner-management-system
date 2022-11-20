const HELPERS = {
  TrailingDot: function (value: string, maxLen: number) {
    if (value.length > maxLen) {
      return value.substring(0, maxLen) + "...";
    }
    return value;
  },
  ConvertToRadians: function (val: number) {
    return (Math.PI * val) / 180;
  },
  FixFloat(val: number, to: number) {
    return parseFloat(val.toFixed(to));
  },
};

export default HELPERS;
