import Chart from 'chart.js/auto';

let myChart;

export const LineChart = (model) => {
  if (myChart) myChart.destroy();
  // data pre-task
  let date = [];
  let confirmed = [];
  let deaths = [];
  let trimedConfirmed = [];
  let trimedDeaths = [];

  let sw = false;
  let k, j;

  const trimConfirmed = (Confirmed) => {
    if (!sw) {
      k = Confirmed;
      sw = true;
      return k;
    }
    j = Confirmed - k;
    k = Confirmed;
    return j;
  };

  model.wholePeriodList.data.forEach((data) => {
    date.unshift(data.date);
    confirmed.unshift(data.confirmed);
    deaths.unshift(data.deaths);
  });

  confirmed.forEach((item) => trimedConfirmed.push(trimConfirmed(item)));
  deaths.forEach((item) => trimedDeaths.push(trimConfirmed(item)));

  draw(trimedConfirmed, date);
};

// drawing chart
const draw = (confirmed, day) => {
  const ctx = document.querySelector('#canvasJS').getContext('2d');

  // Gradient Fill
  let gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(58, 123, 213, 1)');
  gradient.addColorStop(1, 'rgba(0, 210, 255, 0.3)');

  const labels = day;
  const data = {
    labels,
    datasets: [
      {
        data: confirmed,
        label: 'Covid19 - Confirmed Cases',
        // fill: true,
        backgroundColor: gradient,
        // borderColor: '#fff',
        // pointBackgroundColor: 'rgb(189, 195, 199)',
        pointBackgroundColor: '#fab72b',
        borderColor: 'transparent',
        tension: 0.3,
      },
    ],
  };

  let delayed;
  const config = {
    // type: 'bar',
    type: 'line',
    data,
    options: {
      radius: 4,
      hitRadius: 30,
      hoverRadius: 10,
      // indexAxis: 'y',
      responsive: true,
      scales: {
        y: {
          stacked: true,
          // beginAtZero: true,
          ticks: {
            callback: function (value, index, values) {
              return `${value}명`;
            },
          },
        },
        x: {
          stacked: true,
          // ticks: {
          //   callback: function (val, index) {
          //     return index % 2 === 0 ? this.getLabelForValue(val) : '';
          //   },
          //   color: 'blue',
          // },
        },
      },
      // delay
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            // delay = context.dataIndex * 300 + context.datasetIndex * 100;
            delay = context.dataIndex * 2 + context.datasetIndex;
          }
          return delay;
        },
      },
    },
  };

  myChart = new Chart(ctx, config);
};
