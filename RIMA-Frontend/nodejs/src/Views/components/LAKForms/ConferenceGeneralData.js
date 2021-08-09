import React, {useState,useEffect } from "react";
import ReactApexChart from "react-apexcharts";


class ConferenceGeneralData extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: this.props.series,
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ["lak2011", "lak2012", "lak2013", "lak2014", "lak2015", "lak2016", "lak2017", "lak2018", "lak2019", "lak2020", "lak2021"],
          },
          yaxis: {
            min: 10,
            max: 400,
            title: {
                text: 'Website Blog',
            },
            
          },
          fill: {
            opacity: 1
          },
        
        },
      
      
      };
    }

    componentDidMount = () =>{

      this.setState({
        options: {
          ...this.state.options,
          xaxis: {
            ...this.state.options.xaxis,
            categories: this.props.data
          }
        }
      })
    }

    render() {
      return (
        

        <div id="chart">
            <ReactApexChart 
            options={this.state.options} 

            series={this.props.series} type="bar" height={350} 
            />
        </div>


      );
    }
  }

  export default ConferenceGeneralData;