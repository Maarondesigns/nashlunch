import React, { Component } from "react";

import { Glyphicon } from "react-bootstrap";

class LunchAttendance extends Component {
  displayHeadings() {
    // let commentMargin = 20 * this.props.dps.length + "px";
    return (
      <React.Fragment>
        <th className="th-user-name th-heading">Name</th>

        {this.props.dps.map((dp, i) => {
          {
            /* let marginLeft = 20 * i + "px"; */
          }
          return (
            <td
              className="td-heading"
              key={dp}
              style={{
                display: "inline-block",
                width: "20px",
                borderRight: "solid 0.5px rgba(0,0,0,0.1)",
                transform: "rotate(-55deg)",
                transformOrigin: "40% 0"
              }}
            >
              <span>{dp}</span>
            </td>
          );
        })}
        <td
          className="td-heading"
          style={{
            borderRight: "solid 0.5px rgba(0,0,0,0.1)"
          }}
        >
          Comment / Other
        </td>
      </React.Fragment>
    );
  }
  displayUsers() {
    const displayPrefs = dp => {
      return this.props.dps.map((x, i) => {
        if (dp.indexOf(this.props.dps[i]) !== -1) {
          return (
            <td
              key={x}
              style={{
                display: "inline-block",
                width: "20px",
                borderRight: "solid 0.5px rgba(0,0,0,0.1)"
              }}
            >
              <Glyphicon style={{ color: "red" }} glyph="remove" />
            </td>
          );
        } else
          return (
            <td
              key={x}
              style={{
                display: "inline-block",
                width: "20px",
                borderRight: "solid 0.5px rgba(0,0,0,0.1)",
                color: "rgba(0,0,0,0)"
              }}
            >
              _
            </td>
          );
      });
    };
    return this.props.daysUsers.map((user, i) => {
      let name = user.name;
      if (window.innerWidth < 800) {
        let split = user.name.split(" ");
        split[1] = split[1][0] + ".";
        name = split.join(" ");
      }
      return (
        <tr style={{ display: "flex" }} key={"row-" + i}>
          <th key={user.name} className="th-user-name">
            {name}
          </th>
          {displayPrefs(user.dietary_pref)}
          <td key={i} className="other">
            {user.other}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="lunch-attendees">
          <table style={{ paddingTop: "40px" }}>
            <thead className="thead-header">
              <tr style={{ display: "flex" }}>{this.displayHeadings()}</tr>
            </thead>
            <tbody>{this.displayUsers()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default LunchAttendance;
