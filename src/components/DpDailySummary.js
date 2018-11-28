import React, { Component } from "react";

//components
import { Badge } from "react-bootstrap";

class DpDailySummary extends Component {
  render() {
    return (
      <div id="daily-summary-content">
        {this.props.dps.map(dp => {
          let userNum = this.props.daysUsers.filter(u => {
            return u.dietary_pref.indexOf(dp) !== -1;
          }).length;
          let backgroundColor = "lightgray",
            fontWeight = "normal";
          if (userNum > 0) {
            backgroundColor = "red";
            fontWeight = "bold";
          }

          return (
            <div>
              <Badge style={{ backgroundColor, fontWeight }}>{userNum}</Badge>
              <span style={{ fontWeight }}> {dp}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default DpDailySummary;
