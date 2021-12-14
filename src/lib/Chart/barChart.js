import Chart from 'chart.js/auto';

let myChart1;
let myChart2;

export function barChart(value, day, id) {
  if (myChart1 && id === 'canvas1JS') {
    myChart1.destroy();
  }
  if (myChart2 && id === 'canvas2JS') {
    myChart2.destroy();
  }

  function $(_id) {
    return document.getElementById(_id);
  }

  (function initSizeOfCanvas() {
    $(id).width = 400;
    $(id).height = 2500;
  })();

  const ctx = $(id).getContext('2d');
  Chart.defaults.color = '#fff';
  // Chart.defaults.font.family = 'Georgia';

  let gradient = ctx.createLinearGradient(30, 0, 200, 0);
  if (id === 'canvas1JS') {
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(0.9, 'orange');
    gradient.addColorStop(1, '#fb8500');
  } else {
    gradient.addColorStop(0, 'orange');
    gradient.addColorStop(0.9, '#f02d3a');
    gradient.addColorStop(1, 'red');
  }

  const labels = day;
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: id === 'canvas1JS' ? 'Confirmed Cases (1-DAY)' : 'Deaths (1-DAY)',
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
    type: 'bar',
    data,
    options: {
      radius: 4,
      hitRadius: 30,
      hoverRadius: 10,
      indexAxis: 'y',
      responsive: true,
      scales: {
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            // callback: function (value, index, values) {
            //   return `${value}명`;
            // },
            color: 'white',
            font: {
              size: '12px',
            },
          },
        },
        x: {
          position: 'top',
          stacked: true,
          beginAtZero: true,
          ticks: {
            // callback: function (val, index) {
            //   return index % 2 === 0 ? this.getLabelForValue(val) : '';
            // },
            color: 'white',
          },
        },
      },
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
      plugins: {
        tooltip: {
          // enabled: false,
        },
      },
    },
  };

  if (id === 'canvas1JS') {
    myChart1 = new Chart(ctx, config);
  }
  if (id === 'canvas2JS') {
    myChart2 = new Chart(ctx, config);
  }
}
