function loadDashboardCharts(){
  var options = {
    chart: {
      type: 'line',
      height: '400px'
    },
    series: [{
      name: 'sales',
      data: [30,40,35,50,49,60,70,91,125]
    }],
    xaxis: {
      categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
    },
    stroke:{
      curve: 'straight',
    },
    title: {
      text: 'Ventas',
      align: 'left',
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize:  24,
        fontWeight:  'bold',
        fontFamily:  'Helvetica',
        color:  '#263238'
      }
    },
    tooltip: {
      position: "right",
      verticalAlign: "top",
      containerMargin: {
        left: 35,
        right: 60
      },
      style: {
        color: '#263238',
        fontSize: 20
      }
    },
    responsive: [
      {
        breakpoint: 760,
        options: {
          chart: {
            height: 200,
          },
          title:{
            text: 'Compras',
          },
          tooltip: {
            fillSeriesColor: true,
            theme: 'dark',
            marker:{
              show: true
            },
            style:{
              fontSize: '14px'
            },
            x:{
              title: 'No'
            }
          }
        }
      }
    ]
  }
  
  var chart = new ApexCharts(document.querySelector("#chart"), options);
  
  chart.render();

  options = {
    chart: {
      width: "100%",
      height: 380,
      type: "bar"
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    series: [
      {
        data: [44, 55, 41, 64, 22, 43, 21]
      },
      {
        data: [53, 32, 33, 52, 13, 44, 32]
      }
    ],
    xaxis: {
      categories: [
        "Korea",
        "Canada",
        "Poland",
        "Italy",
        "France",
        "Japan",
        "China"
      ]
    },
    legend: {
      position: "right",
      verticalAlign: "top",
      containerMargin: {
        left: 35,
        right: 60
      }
    },
    responsive: [
      {
        breakpoint: 321,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          chart: {
            height: 200,
          },
          legend: {
            position: "bottom"
          },
          title:{
            text:'Compras2'
          }
        }
      }
    ]
  };
  
  chart = new ApexCharts(document.querySelector("#chart2"), options);
  
  chart.render();
  
}



