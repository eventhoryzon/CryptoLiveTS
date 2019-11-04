import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import { Props } from "../Models/Price";
import PriceCard from "../Component/PriceCard";
import ReactFC from "react-fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
// import React, { Component } from "react";
const React = require("react");
const FusionCharts = require("fusioncharts");
const Charts = require("fusioncharts/fusioncharts.charts");
const Widgets = require("fusioncharts/fusioncharts.widgets");

ReactFC.fcRoot(FusionCharts, TimeSeries);

const jsonify = res => res.json();
const dataFetch = fetch(
  "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/plotting-multiple-series-on-time-axis-data.json"
).then(jsonify);
const schemaFetch = fetch(
  "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/plotting-multiple-series-on-time-axis-schema.json"
).then(jsonify);

const dataSource = {
  chart: {},
  caption: {
    text: "Sales Analysis"
  },
  subcaption: {
    text: "Grocery & Footwear"
  },
  series: "Type",
  yaxis: [
    {
      plot: "Sales Value",
      title: "Sale Value",
      format: {
        prefix: "$"
      }
    }
  ]
};

class ChartViewer extends React.Component {
  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.state = {
      timeseriesDs: {
        type: "timeseries",
        renderAt: "container",
        width: "600",
        height: "400",
        dataSource
      }
    };
  }

  componentDidMount() {
    this.onFetchData();
  }

  onFetchData() {
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      timeseriesDs.dataSource.data = fusionTable;
      this.setState({
        timeseriesDs
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.timeseriesDs.dataSource.data ? (
          <ReactFC {...this.state.timeseriesDs} />
        ) : (
          "loading"
        )}
      </div>
    );
  }
}
