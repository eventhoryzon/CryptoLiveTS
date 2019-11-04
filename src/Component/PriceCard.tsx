const React = require("react");

// import { Props } from "../Models/Price";

// class PC extends React.Component<Props, {}> {
// render() {
const PriceCard = props => {
  const value =
    typeof parseInt(props.value) === "number" && !isNaN(parseInt(props.value))
      ? Math.round(parseInt(props.value))
      : props.value;
  return (
    <div className="card mr-0 custom-card">
      {/* // <div class="card border-primary mb-3" style="max-width: 18rem;">       */}
      <div className="card-body">
        <img
          src={props.src}
          alt={props.src}
          className="img-responsive float-right"
        />
        <h6 className="card-title mb-4 ">{props.header} </h6>

        <h2 className="mb-1 text-primary">${value}</h2>
        <div>
          {/* <Button outline color="success">Live Chart</Button>{' '} */}
        </div>

        <p className="card-text">
          <small className="text">{props.label}</small>
          <small className="text">{props.change}</small>
          {/* <div class=""></div> */}
        </p>
      </div>
    </div>
    // </div>
  );
};

export default PriceCard;
