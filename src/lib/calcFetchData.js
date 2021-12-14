import axios from 'axios';

export const ApiData = async (model) => {
  // #0
  const fetchGlobalData = async () => {
    const uri = 'https://api.covid19api.com/summary';
    const data = await fetch(uri);
    const json = await data.json();
    const {
      Country,
      CountryCode,
      Date,
      NewConfirmed,
      TotalConfirmed,
      NewDeaths,
      TotalDeaths,
      NewRecovered,
      TotalRecovered,
    } = await json.Global;

    model.globalSummary = {
      Country,
      CountryCode,
      Date,
      NewConfirmed,
      TotalConfirmed,
      NewDeaths,
      TotalDeaths,
      NewRecovered,
      TotalRecovered,
    };
  };
  await fetchGlobalData().then(() => console.log('#Global fetch: complete'));

  // #1
  const fetchCountriesData = async () => {
    const uri = 'https://api.covid19api.com/summary';
    const data = await fetch(uri);
    const json = await data.json();
    const countries = await json.Countries;

    countries.forEach((countrie) => {
      // error foreach
      const {
        ID,
        Country,
        Slug,
        Date,
        TotalConfirmed,
        NewConfirmed,
        TotalDeaths,
        NewDeaths,
        // TotalRecovered,
        // NewRecovered,
      } = countrie;

      model.countriesTotalList.push({
        ID,
        Country,
        Slug,
        Date,
        TotalConfirmed,
        NewConfirmed,
        TotalDeaths,
        NewDeaths,
      });
    });
  };
  await fetchCountriesData()
    .then(() => {
      model.isLoading = false;
    })
    .then(() => console.log('#Country-Totals fetch: complete'));

  // #2
  const fetchCountriesTwoWeek = async () => {
    // Calculation for search period format(yyyy-mm-dd or yyyy-m-d)
    const twoWeeksMillisecond = 1296000000;
    const todayMillisecond = Date.now();
    const twoWeeksDate = new Date(todayMillisecond - twoWeeksMillisecond).toLocaleString();
    const lastIndex = twoWeeksDate.lastIndexOf('.');
    const modifiedFormat = twoWeeksDate
      .slice(0, lastIndex)
      .replaceAll('.', '-')
      .replaceAll(' ', '');

    // Push country list to an array
    const countryList = [];
    async function getCountryList() {
      const uri = 'https://api.covid19api.com/countries';
      const data = await fetch(uri);
      console.log('#Country-push-list fetch');
      const json = await data.json();
      json.map((v) => countryList.push(v.Slug));
    }
    await getCountryList();

    const country2WeeksData = {};
    const requests = countryList.map(
      (country, index) =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve(fetch2WeeksData(country));
          }, 600 * index)
        )
    );
    Promise.all(requests).then(() => generate2WeeksData(country2WeeksData));

    async function fetch2WeeksData(country) {
      const uri = `https://api.covid19api.com/live/country/${country}/status/confirmed/date/${modifiedFormat}`;
      const data = await fetch(uri);
      console.log('#2-Week fetch');
      const json = await data.json();
      country2WeeksData[country] = json;
    }

    const generate2WeeksData = (data) => {
      countryList.map((country) => {
        if (data[country].length === 15) {
          const twoWeeksCaseSum = data[country][14].Confirmed - data[country][0].Confirmed;
          const twoWeeksDeathSum = data[country][14].Deaths - data[country][0].Deaths;
          model.countriesTwoWeekList.push({
            country,
            twoWeeksCase: twoWeeksCaseSum,
            twoWeeksDeath: twoWeeksDeathSum,
          });
        }
        return 0;
      });
      console.log('@@final', model.countriesTwoWeekList);

      // data.countries.forEach((countrie) => {
      //   const {
      //     ID,
      //     Country,
      //     Date,
      //     TotalConfirmed,
      //     NewConfirmed,
      //     TotalDeaths,
      //     NewDeaths,
      //     TotalRecovered,
      //     NewRecovered,
      //   } = countrie;

      //   model.countriesTwoWeekList.push({
      //     ID,
      //     Country,
      //     Date,
      //     TotalConfirmed,
      //     NewConfirmed,
      //     TotalDeaths,
      //     NewDeaths,
      //   });
      // });
    };
  };
  // await fetchCountryTwoWeeks();
};

export const ApiDataOfWholePeriod = async (slug, model) => {
  const response = { location: slug, data: [] };
  const uri = `https://api.covid19api.com/total/country/${slug}`;
  const res = await axios.get(uri);
  const json = res.data;
  json.forEach((oneDay) => {
    let chunkData = {
      date: oneDay.Date.split('T')[0],
      confirmed: oneDay.Confirmed,
      deaths: oneDay.Deaths,
    };
    response.data.push(chunkData);

    // const len = String(oneDay.Confirmed).length;
    // console.log(`${oneDay.Date.split('T')[0]} / ${oneDay.Confirmed} / ${len}`);
  });
  response.data.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    }
    if (a.date < b.date) {
      return 1;
    }
    return 0;
  });
  model.wholePeriodList = response;
  console.log('#Whole-Period fetch: complete');
};
