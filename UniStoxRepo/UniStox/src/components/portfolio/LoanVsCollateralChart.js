import React, { Component } from "react";
import Chart from "react-apexcharts";

class LoanVsCollateralChart extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.loanAmount);
    this.state = {
      options: {
        chart: {
          id: "basic-bar",
          type: "bar",
          stacked: false,
          height: 400,
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
        },
        plotOptions: {
          bar: {
            distributed: true,
          },
        },
        colors: ["#f7c133", "#3b8a2d"],
        title: {
          text: "Total Loan vs Collateral",
          align: "left",
        },

        xaxis: {
          categories: ["Loan", "Collateral"],
        },
      },
      series: [
        {
          name: "Amount",
          data: [this.props.loanAmount, this.props.portfolio],
        },
      ],
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        series: [
          {
            data: [this.props.loanAmount, this.props.portfolio],
          },
        ],
      });
    }
  }
  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={350}
      />
    );
  }
}

export default LoanVsCollateralChart;
