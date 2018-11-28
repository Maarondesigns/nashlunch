import React, { Component } from "react";
import { getMonthName } from "../functions/dates/getMonthName";

import { Glyphicon } from "react-bootstrap";

class YearCalendar extends Component {
  showMonths() {
    let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (
      <React.Fragment>
        <div className="year-cal-year">
          <Glyphicon glyph="chevron-left" />
          <div className="year-num">2018</div>
          <Glyphicon glyph="chevron-right" />
        </div>
        {months.map(month => {
          let background = "white";
          if (month === this.props.currentMonth) {
            background = "#17b586";
          }
          return (
            <div
              style={{ background }}
              className="year-cal-month"
              onClick={() => console.log(month)}
            >
              <div>{getMonthName(month)}</div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
  render() {
    let style;
    if (this.props.display) {
      style = { display: "flex" };
    } else style = { display: "none" };
    return (
      <div style={style} id="year-calendar-container">
        <div
          id="year-calendar-background"
          onClick={() => this.props.closeYrCal()}
        />
        <div id="year-calendar">{this.showMonths()}</div>
      </div>
    );
  }
}

export default YearCalendar;
