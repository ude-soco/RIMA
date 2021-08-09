import React from "react";
import ReactApexChart from "react-apexcharts";



class CompareTimeLineChart extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [
          {
            name: 'Bob',
            data: [
              {
                x: 'Design',
                y: [
                  new Date('2019-03-05').getTime(),
                  new Date('2019-03-08').getTime()
                ]
              },
              {
                x: 'Code',
                y: [
                  new Date('2019-03-02').getTime(),
                  new Date('2019-03-05').getTime()
                ]
              },
              {
                x: 'Code',
                y: [
                  new Date('2019-03-05').getTime(),
                  new Date('2019-03-07').getTime()
                ]
              },
              {
                x: 'Test',
                y: [
                  new Date('2019-03-03').getTime(),
                  new Date('2019-03-09').getTime()
                ]
              },
              {
                x: 'Test',
                y: [
                  new Date('2019-03-08').getTime(),
                  new Date('2019-03-11').getTime()
                ]
              },
              {
                x: 'Validation',
                y: [
                  new Date('2019-03-11').getTime(),
                  new Date('2019-03-16').getTime()
                ]
              },
              {
                x: 'Design',
                y: [
                  new Date('2019-03-01').getTime(),
                  new Date('2019-03-03').getTime()
                ],
              }
            ]
          },
          {
            name: 'Joe',
            data: [
              {
                x: 'Design',
                y: [
                  new Date('2019-03-02').getTime(),
                  new Date('2019-03-05').getTime()
                ]
              },
              {
                x: 'Test',
                y: [
                  new Date('2019-03-06').getTime(),
                  new Date('2019-03-16').getTime()
                ],
                goals: [
                  {
                    name: 'Break',
                    value: new Date('2019-03-10').getTime(),
                    strokeColor: '#CD2F2A'
                  }
                ]
              },
              {
                x: 'Code',
                y: [
                  new Date('2019-03-03').getTime(),
                  new Date('2019-03-07').getTime()
                ]
              },
              {
                x: 'Deployment',
                y: [
                  new Date('2019-03-20').getTime(),
                  new Date('2019-03-22').getTime()
                ]
              },
              {
                x: 'Design',
                y: [
                  new Date('2019-03-10').getTime(),
                  new Date('2019-03-16').getTime()
                ]
              }
            ]
          },
          {
            name: 'Dan',
            data: [
              {
                x: 'Code',
                y: [
                  new Date('2019-03-10').getTime(),
                  new Date('2019-03-17').getTime()
                ]
              },
              {
                x: 'Validation',
                y: [
                  new Date('2019-03-05').getTime(),
                  new Date('2019-03-09').getTime()
                ],
                goals: [
                  {
                    name: 'Break',
                    value: new Date('2019-03-07').getTime(),
                    strokeColor: '#CD2F2A'
                  }
                ]
              },
            ]
          }
        ],
        options: {
          chart: {
            height: 450,
            type: 'rangeBar'
          },
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: '80%'
            }
          },
          xaxis: {
            type: 'datetime'
          },
          stroke: {
            width: 1
          },
          fill: {
            type: 'solid',
            opacity: 0.6
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left'
          }
        },
      
      
      };
    }

  

    render() {
      return (
        

  <div id="chart">
<ReactApexChart options={this.state.options} series={this.state.series} type="rangeBar" height={450} />
</div>


      );
    }
  }

  export default CompareTimeLineChart;