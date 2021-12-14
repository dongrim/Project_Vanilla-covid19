const time = document.querySelector('#timeJS');
const totalConfirmed1 = document.querySelector('#totalConfirmedJS');
const countryConfirmed = document.querySelector('#countryConfirmedJS');
/**
 * MVC
 * Mode => Database
 * View => Render
 * Controller => compute
 */

// current time
function getCurrentTime() {
  const milliSec = Date.now();
  const date = new Date(milliSec);
  // const result = date.toLocaleString('ko-KR', { timeZone: 'UTC' });
  const result = date.toLocaleString('ko-KR');
  time.textContent = result;
}

// global stats
async function fetchGlobalStats() {
  const url_global_stats = 'https://api.covid19api.com/summary';
  const data = await fetch(url_global_stats);
  const json = await data.json();
  console.warn(json);
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
  }: any = await json.Global;
  // model.totalConfirmed = Number(TotalConfirmed).toLocaleString();
  view.render();
}

// stats by countries
async function fetchByCountrie() {
  console.log('data fetching ... (confirmed cases by country)');
  const url_global_stats = 'https://api.covid19api.com/summary';
  const data = await fetch(url_global_stats);
  const json = await data.json();
  const countries = await json.Countries;
  countries.map((countrie: any) => {
    const { Country, Date, TotalConfirmed, TotalDeaths, TotalRecovered } =
      countrie;
    model.countryConfirmedList.push({
      Country,
      Date,
      TotalConfirmed,
      TotalDeaths,
      TotalRecovered,
    });
  });
  view.render();
}

// individual country stats
const fetchApi = async () => {
  const uri =
    'https://api.covid19api.com/live/country/south-africa/status/confirmed';
  const data = await fetch(uri);
  const result = await data.json();
  console.log(result);
};

// html template
function templateHTML(items: { TotalConfirmed: any, Country: any }[]) {
  const container = document.createElement('div');
  container.className = 'conf__container';
  items.map(item => {
    const div = document.createElement('div');
    div.className = 'conf__item';
    const span1 = document.createElement('span');
    span1.className = 'conf__item__number';
    const span2 = document.createElement('span');
    span2.className = 'conf__item__name';
    const hr = document.createElement('hr');
    span1.textContent = item.TotalConfirmed;
    span2.textContent = item.Country;
    div.append(span1, span2, hr);
    container.appendChild(div);
  });
  return container;
}


// #1 Model
const model: any = {
  summary: [],
  countryConfirmedList: [],
};

// #2 View
const view = {
  render: () => {
    // getCurrentTime(); // set initial time in advance
    // setInterval(getCurrentTime, 1000); // time alive

    totalConfirmed1.textContent = model.summary; // display total confiremd on the chart
    countryConfirmed.append(templateHTML(model.countryConfirmedList));
    console.log(templateHTML(model.countryConfirmedList));
  },
};

// #3 Controller
const controller = {
  initial: view.render,
  useEffect: (() => {
    fetchGlobalStats();
    fetchByCountrie();
  })(),
};

// #4 excute
controller.initial();
