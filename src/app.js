import './styles/style.css';
import { ApiData, ApiDataOfWholePeriod } from './lib/calcFetchData';
import { Digit } from './lib/digitTransform';
import { LineChart } from './lib/Chart/lineChart';
import { barChart } from './lib/Chart/barChart';
import { CalcChartData } from './lib/Chart/calcChartData';
import { sortData } from './lib/sortData';

// #1 Summary
// https://api.covid19api.com/summary
// #2 Two weeks
// https://api.covid19api.com/live/country/afghanistan/status/confirmed/date/2020-02-13
// #3 From beginning to today trend line
// https://api.covid19api.com/total/country/south-africa
// #4 List of country
// https://api.covid19api.com/countries

function $(element) {
  return document.querySelector(element);
}

const updateTime = $('#updateTimeJS');
const caseByCountryList = $('#caseByCountryListJS');
const headerWorldSpinner = $('#headerWorldSpinnerJS');
const worldCases = $('#worldCasesJS');
const worldDeaths = $('#worldDeathsJS');
const toggleCase = $('#toggleCaseJS');
const toggleDeath = $('#toggleDeathJS');
// const dayConfirmed = $('#dayConfirmedJS');
// const dayDeath = $('#dayDeathJS');
const locationBtn = $('#locationBtn');
const totalBtn = $('#totalBtn');
const twoWeekBtn = $('#twoWeekBtn');
const oneDayBtn = $('#oneDayBtn');

(function () {
  // #1 selected toggle button of case and death
  toggleCase.addEventListener('click', () => {
    model.toggle.btnCaseAndDeath = true;
    view.render();
  });
  toggleDeath.addEventListener('click', () => {
    model.toggle.btnCaseAndDeath = false;
    view.render();
  });

  // #2 ascend and descend(ASC, DESC)
  totalBtn.addEventListener('click', () => {
    if (!model.sort.total) {
      model.sort.total = true;
      const foo = sortData.total(model, 'DESC');
      model.countriesTotalList = foo;
      totalBtn.setAttribute('data-before', '↓');
    } else if (model.sort.total) {
      model.sort.total = false;
      const foo = sortData.total(model, 'ASC');
      model.countriesTotalList = foo;
      totalBtn.setAttribute('data-before', '↑');
    }
    view.render();
  });
  twoWeekBtn.addEventListener('click', () => sortData.towWeek(model));
  oneDayBtn.addEventListener('click', () => sortData.oneDay(model));
})();

// current time
function drawUpdatedTime(date, isLoading) {
  if (isLoading) {
    updateTime.innerHTML = '<div class="spinner" />';
    return;
  }
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: undefined,
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    second: undefined,
  };
  const result = new Date(date).toLocaleString('en-za', options);
  const modifiedResult = result.replace(/(\/|,)/g, '. ');
  const prefix = 'Last Updated at';

  updateTime.textContent = `${prefix} \u00A0${modifiedResult}`;
}

const drawGlobalIndex = (data, isLoading) => {
  if (isLoading) {
    worldCases.style.display = 'none';
    worldDeaths.style.display = 'none';
    headerWorldSpinner.setAttribute('class', 'spinner');
    return;
  }
  worldCases.style.display = 'block';
  worldDeaths.style.display = 'block';
  headerWorldSpinner.removeAttribute('class', 'spinner');
  const { NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths } = data;
  const casesChild = worldCases.children;
  const deathsChild = worldDeaths.children;
  casesChild[1].textContent = Digit.set(TotalConfirmed);
  casesChild[2].textContent = `+${Digit.set(NewConfirmed)}`;
  deathsChild[1].textContent = Digit.set(TotalDeaths);
  deathsChild[2].textContent = `+${Digit.set(NewDeaths)}`;
};

// view side
function mainTemplateHTML(data) {
  caseByCountryList.innerHTML = ''; // refresh data in scroll view box
  const container = document.createElement('div');
  container.className = 'conf__container';
  data.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'conf__item';
    div.id = item.Slug;
    const p1 = document.createElement('p');
    p1.className = 'conf__item__country';
    const p2 = document.createElement('span');
    p2.className = 'conf__item__total';
    const p3 = document.createElement('span');
    p3.className = 'conf__item__15day';
    const p4 = document.createElement('span');
    p4.className = 'conf__item__day';
    p1.textContent = item.Country;
    p2.textContent = model.toggle.btnCaseAndDeath
      ? Digit.set(item.TotalConfirmed)
      : Digit.set(item.TotalDeaths);
    p3.textContent = model.toggle.btnCaseAndDeath
      ? Digit.set(item.NewConfirmed)
      : Digit.set(item.NewDeaths);
    p4.textContent = model.toggle.btnCaseAndDeath
      ? Digit.set(item.NewConfirmed)
      : Digit.set(item.NewDeaths);
    div.append(p1, p2, p3, p4);
    container.append(div);
    div.addEventListener('click', () => {
      controller.fetchForDrawing(item.Slug); // conduct drawing
    });
  });
  return container;
}

// #1 Model
const model = {
  isLoading: true,
  toggle: { btnCaseAndDeath: true },
  globalSummary: [],
  countriesTotalList: [], // modify for sort(ascend, descend)
  countriesTwoWeekList: [],
  wholePeriodList: [],
  sort: {
    total: null,
    // etc.
  },
};

// #2 View
const view = {
  render: () => {
    if (model.isLoading) {
      drawUpdatedTime(null, true);
      drawGlobalIndex(null, true);
      caseByCountryList.innerHTML =
        '<div  style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><div class="spinner" /></div>';
    }
    if (!model.isLoading) {
      drawUpdatedTime(model.globalSummary.Date);
      drawGlobalIndex(model.globalSummary);
      caseByCountryList.appendChild(mainTemplateHTML(model.countriesTotalList));
    }
    // toggle buttons of case and death
    if (!model.toggle.btnCaseAndDeath) {
      toggleCase.classList.remove('selected');
      toggleDeath.classList.add('selected');
    } else if (model.toggle.btnCaseAndDeath) {
      toggleDeath.classList.remove('selected');
      toggleCase.classList.add('selected');
    }
  },
};

// #3 Controller
const controller = {
  initial: view.render,
  fetch: async () => {
    await ApiData(model);
    view.render();
  },
  fetchForDrawing: async (slug) => {
    await ApiDataOfWholePeriod(slug, model);
    // need to move below to view's part
    const res = await CalcChartData(model.wholePeriodList); // modify data before rendering
    barChart(res.dayConfirmedArr, res.dateArr, 'canvas1JS');
    barChart(res.dayDeathsArr, res.dateArr, 'canvas2JS');
    LineChart(model);
  },
};

// #4 Excute
controller.initial();
controller.fetch();
