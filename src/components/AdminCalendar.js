import React, { Component } from "react";

//components
import { FormGroup } from "react-bootstrap";
import AdminMonthCal from "./AdminMonthCal.js";
import AdminWeekCal from "./AdminWeekCal.js";
import LunchAttendance from "./LunchAttendance.js";

//data
import userList from "../dummy_data/users.json";
import DietaryPref from "../dummy_data/DietaryPref.json";
import DpDailySummary from "./DpDailySummary.js";

class AdminCalendar extends Component {
  constructor(props) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.state = {
      calendar: "week",
      selectedDate: "",
      daysUsers: []
    };
  }

  setDate(date, daysUsers) {
    this.setState({ selectedDate: date, daysUsers });
  }
  // componentDidUpdate() {
  //   console.log(this.state);
  // }

  //   signUp() {
  //     let dates = {
  //       lunch_dates: document.getElementById("selected-dates").innerHTML
  //     };
  //     fetch("http://192.168.0.8:8080/updateuser", {
  //       method: "POST",
  //       body: JSON.stringify(dates),
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     }).then(res => {
  //       if (res.status === 200) {
  //         alert("successs");
  //       }
  //     });
  //   }

  displayCal() {
    if (this.state.calendar === "week")
      return <AdminWeekCal userList={userList} setDate={this.setDate} />;
    else if (this.state.calendar === "month")
      return <AdminMonthCal userList={userList} setDate={this.setDate} />;
  }

  render() {
    return (
      <div className="main-container">
        <div className="container-title">Lunch Attendance</div>
        <div className="admin-calendar container-content">
          <div>{this.displayCal()}</div>
          <FormGroup>
            <div className="daily-summary">
              <div className="daily-summary-title">
                {`${this.state.selectedDate}  (${
                  this.state.daysUsers.length
                } Attendees)`}
              </div>
              <DpDailySummary
                dps={DietaryPref.dietary_preferences}
                daysUsers={this.state.daysUsers}
              />
            </div>
          </FormGroup>
          <FormGroup>
            {/* <div className="daily-summary-title">
              User Restrictions {this.state.selectedDate}
            </div> */}
            <LunchAttendance
              selectedDate={this.state.selectedDate}
              userList={userList}
              daysUsers={this.state.daysUsers}
              dps={DietaryPref.dietary_preferences}
            />
          </FormGroup>
        </div>
      </div>
    );
  }
}
export default AdminCalendar;
