import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
// import { Props } from "../Models/Price";
import PriceCard from "../Component/PriceCard";
import ReactFC from "react-fusioncharts";
const React = require("react");
const FusionCharts = require("fusioncharts");
const Charts = require("fusioncharts/fusioncharts.charts");
const Widgets = require("fusioncharts/fusioncharts.widgets");

ReactFC.fcRoot(FusionCharts, Charts, Widgets, CandyTheme);

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.BASE_URL = "https://api.coincap.io/v2/assets/";
    this.chartRef = null;
    this.state = {
      btcusd: "-",
      ltcusd: "-",
      ethusd: "-",
      btcusdchange: "-",
      ltcusdchange: "-",
      ethusdchange: "-",
      showChart: false,
      initValue: 0,
      dataSource: {
        chart: {
          caption: "Bitcoin",
          subCaption: "Live Ticker Data",
          xAxisName: "Current Time",
          yAxisName: "USD",
          numberPrefix: "$",
          refreshinterval: "2",
          slantLabels: "1",
          numdisplaysets: "12",
          labeldisplay: "rotate",
          showValues: "0",
          showRealTimeValue: "0",
          showhovereffect: "0",
          drawcrossline: "1",
          plottooltext: "Price: <b>$value</b> at $label Hrs",
          theme: "candy"
        },
        // Show/Hide Standard Range Selector
        extensions: {
          standardRangeSelector: {
            style: {
              "button-text": {}, //Object | String
              "button-background": {}, //Object | String
              "button-text:hover": {}, //Object | String
              "button-background:hover": {}, //Object | String
              "button-text:active": {}, //Object | String
              "button-background:active": {}, //Object | String
              separator: {} //Object | String
            }
          }
        },
        categories: [
          {
            category: [
              {
                label: this.clientDateTime().toString()
              }
            ]
          }
        ],
        dataset: [
          {
            data: [
              {
                value: 0
              }
            ]
          }
        ]
      }
    };
    this.chartConfigs = {
      type: "realtimeline",
      renderAt: "container",
      width: "100%",
      height: "350",
      dataFormat: "json"
    };
  }

  componentDidMount() {
    this.getDataFor("bitcoin", "btcusd");
    this.getDataFor("litecoin", "ltcusd");
    this.getDataFor("ethereum", "ethusd");
    this.getDataForChange("bitcoin", "btcusdchange");
    this.getDataForChange("litecoin", "ltcusdchange");
    this.getDataForChange("ethereum", "ethusdchange");
  }

  startUpdatingDataBitcoin() {
    setInterval(() => {
      fetch(this.BASE_URL + "bitcoin")
        .then(res => res.json())
        .then(d => {
          let x_axis = this.clientDateTime();
          let y_axis = d.data.priceUsd;
          if (this.chartRef != null) {
            this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
          }
        })

        .then(this.onLoad);
    }, 2000);
  }

  startUpdatingDataLitecoin() {
    setInterval(() => {
      fetch(this.BASE_URL + "litecoin")
        .then(res => res.json())
        .then(d => {
          let x_axis = this.clientDateTime();
          let y_axis = d.data.priceUsd;
          this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
        });
    }, 2000);
  }
  getListings() {
    setInterval(() => {
      console.log("0. calling getListings...");
      return fetch(`${this.BASE_URL}`)
        .then(response => response.json())
        .then(d => {
          let x_axis = this.clientDateTime();
          let y_axis = d.data.prop;
          this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
        });
    }, 2000);
  }

  startUpdatingDataEthereum() {
    setInterval(() => {
      fetch(this.BASE_URL + "ethereum")
        .then(res => res.json())
        .then(d => {
          let x_axis = this.clientDateTime();
          let y_axis = d.data.priceUsd;
          this.chartRef.feedData("&label=" + x_axis + "&value=" + y_axis);
        });
    }, 2000);
  }

  getDataFor(conversion, prop) {
    fetch(this.BASE_URL + conversion, {
      mode: "cors"
    })
      .then(res => res.json())
      .then(d => {
        if (prop === "btcusd") {
          const dataSource = this.state.dataSource;
          dataSource.chart.yAxisMaxValue = parseInt(d.data.priceUsd) + 5;
          dataSource.chart.yAxisMinValue = parseInt(d.data.priceUsd) - 5;
          dataSource.dataset[0]["data"][0].value = d.data.priceUsd;
          this.setState(
            {
              showChart: true,
              dataSource: dataSource,
              initValue: d.data.priceUsd
            },
            () => {
              this.startUpdatingDataBitcoin();
            }
          );
        }

        this.setState({
          [prop]: d.data.priceUsd
        });
      });
  }

  getDataForChange(conversion, prop) {
    fetch(this.BASE_URL + conversion, {
      mode: "cors"
    })
      .then(res => res.json())
      .then(d => {
        if (prop === "btcusdchange") {
          const dataSource = this.state.dataSource;
          dataSource.chart.yAxisMaxValue =
            parseInt(d.data.changePercent24Hr) + 5;
          dataSource.chart.yAxisMinValue =
            parseInt(d.data.changePercent24Hr) - 5;
          dataSource.dataset[0]["data"][0].value = d.data.changePercent24Hr;
          this.setState(
            {
              showChart: true,
              dataSource: dataSource,
              initValue: d.data.changePercent24Hr
            },
            () => {
              this.startUpdatingDataBitcoin();
            }
          );
        }

        this.setState({
          [prop]: d.data.changePercent24Hr
        });
      });
  }

  static addLeadingZero(num) {
    return num <= 9 ? "0" + num : num;
  }

  clientDateTime() {
    var date_time = new Date();
    var curr_hour = date_time.getHours();
    var zero_added_curr_hour = Body.addLeadingZero(curr_hour);
    var curr_min = date_time.getMinutes();
    var curr_sec = date_time.getSeconds();
    var curr_time = zero_added_curr_hour + ":" + curr_min + ":" + curr_sec;
    return curr_time;
  }

  getChartRef(chart) {
    this.chartRef = chart;
  }

  render() {
    return (
      <div>
        <div className="row mt-5 mt-xs-4">
          <div className="col-12 mb-3">
            <div className="card-deck custom-card-deck">
              <PriceCard
                header="Bitcoin(BTC)"
                src={"/bitcoin.png"}
                alt="fireSpot"
                label="(Price in USD)"
                change={this.state.changePercent24Hr}
                value={this.state.btcusd}
              ></PriceCard>
              <PriceCard
                header="Litecoin(LTC)"
                src={"/litecoin.png"}
                alt="fireSpot"
                label="(Price in USD)"
                value={this.state.ltcusd}
              >
                {" "}
              </PriceCard>
              <PriceCard
                header="Ethereum(ETH)"
                src={"/ethereum.png"}
                alt="fireSpot"
                label="(Price in USD)"
                value={this.state.ethusd}
              ></PriceCard>
            </div>
          </div>
          <div className="col-12">
            <div className="card custom-card mb-5 mb-xs-4">
              <div className="card-body">
                {this.state.showChart ? (
                  <ReactFC
                    {...this.chartConfigs}
                    dataSource={this.state.dataSource}
                    onRender={this.getChartRef.bind(this)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div> 
      </div>
    );
  }
}

export default Body;

// function ToggleButtonGroupControlled() {
//   const [value, setValue] = useState([1, 3]);

//   /*
//    * The second argument that will be passed to
//    * `handleChange` from `ToggleButtonGroup`
//    * is the SyntheticEvent object, but we are
//    * not using it in this example so we will omit it.
//    */
//   const handleChange = val => setValue(val);

//   return (
//     <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
//       <ToggleButton value={1}>Option 1</ToggleButton>
//       <ToggleButton value={2}>Option 2</ToggleButton>
//       <ToggleButton value={3}>Option 3</ToggleButton>
//     </ToggleButtonGroup>
//   );
// }

// render(<ToggleButtonGroupControlled />);
