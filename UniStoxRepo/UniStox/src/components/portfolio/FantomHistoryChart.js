import React from "react";
import Chart from "react-apexcharts";
import { getFantomHistoricalData } from "../Lib/StocksApi";

class FantomHistoryChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Close Price",
          data: [],
        },
      ],
      options: {
        chart: {
          type: "area",
          stacked: false,
          height: 350,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
        },
        colors: ["#79b545"], //f2a852

        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        title: {
          text: "FTM vs USD",
          align: "left",
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100],
          },
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return val.toFixed(5);
            },
          },
          title: {
            text: "Price",
          },
        },
        xaxis: {
          type: "datetime",
        },
        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return val.toFixed(5);
            },
          },
        },
      },
    };
  }

  componentDidMount() {
    getFantomHistoricalData()
      .then((resp) => resp.json())
      .then((item) => {
        const data = item["prices"];
        this.setState({ series: [{ data: data }] });
      });
  }
  componentDidUpdate() {
    getFantomHistoricalData()
      .then((resp) => resp.json())
      .then((item) => {
        const data = item["prices"];
        this.setState({ series: [{ data: data }] });
      });
  }
  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="area"
          height={350}
        />
      </div>
    );
  }
}

export default FantomHistoryChart;
