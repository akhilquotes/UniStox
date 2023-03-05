import React from "react";
import Chart from "react-apexcharts";

class StockPerformanceChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: this.props.series,
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
        colors: [this.props.color],

        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        title: {
          text: this.props.title,
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
              return val.toFixed(2);
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
              return val.toFixed(2);
            },
          },
        },
      },
    };
  }

  componentDidMount() {
    console.log(this.props.perfData);
    const monthlyData = this.props.perfData.map((x) => {
      let dateObj = new Date(x.Date);
      let timestamp = dateObj.getTime() + 1000 * 60 * 60 * 5.5;
      return [timestamp, x[this.props.keyCol]];
    });

    this.setState({
      series: [
        {
          data: monthlyData.sort(function (a, b) {
            return a[0] - b[0];
          }),
        },
      ],
    });
  }
  componentDidUpdate(prevProps) {
    console.log(this.props.perfData);
    if (prevProps.perfData !== this.props.perfData) {
      const monthlyData = this.props.perfData.map((x) => {
        let dateObj = new Date(x.Date);
        let timestamp = dateObj.getTime() + 1000 * 60 * 60 * 5.5;
        return [timestamp, x[this.props.keyCol]];
      });
      this.setState({
        series: [
          {
            data: monthlyData.sort(function (a, b) {
              return a[0] - b[0];
            }),
          },
        ],
      });
    }
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

export default StockPerformanceChart;
