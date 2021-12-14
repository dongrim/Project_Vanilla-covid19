export const Digit = (() => {
  const self = {
    set: (number) => {
      if (number === undefined) throw Error(`argument is undefined. (value: ${number})`);
      const numberString = number.toString();
      const len = numberString.length;

      if (len === 4) {
        return `${number.toPrecision(2).slice(0, 3)}K`;
      }
      if (len === 5) {
        return `${(number * 0.001).toPrecision(3)}K`;
      }
      if (len === 6) {
        return `${(number * 0.001).toPrecision(4)}K`;
      }
      if (len === 7) {
        return `${number.toPrecision(3).slice(0, 3)}M`;
      }
      if (len === 8) {
        return `${(number * 0.000001).toPrecision(3)}M`;
      }
      if (len === 9) {
        return `${(number * 0.000001).toPrecision(4)}M`;
      }
      return number;
    },
  };
  return self;
})();
