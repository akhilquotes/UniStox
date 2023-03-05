import React from "react";

const StatusCard = ({ bgColor, title, text, textColor }) => {
  return (
    <>
      <div className="card my-3">
        <div className="row g-0">
          <div className={`col-md-1 ${bgColor}`}>
            {/* <img src="..." className="img-fluid rounded-start" alt=" " /> */}
          </div>
          <div className="col-md-11">
            <div className="card-body" style={{ height: "10vh" }}>
              <span className="card-text">{title}</span>
              <p className={`card-text ${textColor}`}>{text}</p>
              {/* <p className="card-text">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusCard;
