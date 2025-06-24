const ctx = document.getElementById('achievementChart').getContext('2d');

const achievementChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      label: '% of Goals Achieved',
      data: [65, 70, 80, 85, 90, 92, 95],
      backgroundColor: '#2ecc71',
      borderRadius: 6,
      barThickness: 40
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.parsed.y + '%';
          }
        }
      }
    }
  }
});
