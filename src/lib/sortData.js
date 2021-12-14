export const sortData = {
  total: (model, option) => {
    let foo;
    if (option === 'DESC') {
      foo = model.countriesTotalList.sort((a, b) => {
        if (a.TotalConfirmed < b.TotalConfirmed) return 1;
        if (a.TotalConfirmed > b.TotalConfirmed) return -1;
        return 0;
      });
      // foo.forEach((ele) => console.log(ele.Country, ele.TotalConfirmed));
    }
    if (option === 'ASC') {
      foo = model.countriesTotalList.sort((a, b) => {
        if (a.TotalConfirmed > b.TotalConfirmed) return 1;
        if (a.TotalConfirmed < b.TotalConfirmed) return -1;
        return 0;
      });
      // foo.forEach((ele) => console.log(ele.Country, ele.TotalConfirmed));
    }
    return foo;
  },
  towWeek: (model) => {
    console.log('@towWeek: ', model.countriesTotalList);
  },
  oneDay: (model) => {
    console.log('@oneDay: ', model.countriesTotalList);
  },
};
