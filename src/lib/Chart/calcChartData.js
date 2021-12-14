class DataFormChanger {
  constructor() {
    this.k = null;
    this.j = null;
    this.sw = false;
  }

  date(val) {
    return val.split('T')[0].replaceAll('-', '.');
  }

  daily(val) {
    if (!this.sw) {
      this.k = val;
      this.sw = true;
      // return this.k;
    }
    this.j = this.k - val;
    this.k = val;
    return this.j;
  }
}

export const CalcChartData = async (model) => {
  const foo = new DataFormChanger();
  const foo1 = new DataFormChanger();

  // let location;
  let dateArr = [];
  let confirmedArr = []; // cumulate
  let deathsArr = []; // cumulate
  let dayConfirmedArr = [];
  let dayDeathsArr = [];

  try {
    model.data.forEach((result) => {
      // location = result.Country;
      dateArr.push(new DataFormChanger().date(result.date));
      confirmedArr.push(result.confirmed);
      deathsArr.push(result.deaths);
      dayConfirmedArr.push(foo.daily(result.confirmed));
      dayDeathsArr.push(foo1.daily(result.deaths));
    });
  } catch (e) {
    console.error(e);
  }

  return {
    // location,
    dateArr,
    confirmedArr,
    deathsArr,
    dayConfirmedArr,
    dayDeathsArr,
  };
};
