import React, { Component } from "react";

//components
import { Radio, FormGroup, Button, Glyphicon } from "react-bootstrap";
import DatePicker from "./DatePicker.js";
import EditingDate from "./EditingDate";
import { interpolateToggle } from "../functions/interpolateToggle.js";
import { formatDatePrettyShort } from "../functions/dates/formatDatePrettyShort.js";

//data
import user from "../dummy_data/CurrentUser";

class AttendLunch extends Component {
  constructor(props) {
    super(props);
    this.setDates = this.setDates.bind(this);
    this.addRange = this.addRange.bind(this);
    this.lockCalendar = this.lockCalendar.bind(this);
    this.unlockCalendar = this.unlockCalendar.bind(this);
    this.clearCalendar = this.clearCalendar.bind(this);
    this.state = {
      selectedDates: [],
      addedRanges: [],
      clearCalendar: false,
      editSelectedDates: false,
      editingDate: [null, false],
      select: "range",
      user: user
    };
  }

  toggleSelectionOptions(target) {
    if (target.classList.contains("show-selection-options")) {
      target.style.display = "none";
    } else {
      document.querySelector(".show-selection-options").style.display =
        "initial";
    }
    interpolateToggle(".selection-options-hide");
  }

  clearCalendar() {
    this.setState({
      selectedDates: [],
      editSelectedDates: false,
      clearCalendar: true
    });
  }
  unlockCalendar() {
    this.setState({ editSelectedDates: false });
  }
  lockCalendar() {
    this.setState({ editSelectedDates: true });
    document.getElementById("unlock-calendar").style.display = "block";
  }

  setDates(selectedDates) {
    let trueFalse = [];
    selectedDates.forEach((x, i) =>
      trueFalse.push(x === this.state.selectedDates[i])
    );
    if (
      trueFalse.indexOf(false) !== -1 ||
      selectedDates.length < this.state.selectedDates.length
    ) {
      this.setState({ selectedDates });
    }
  }

  addRange() {
    this.setState({
      addedRanges: [...this.state.addedRanges, this.state.selectedDates]
    });
    this.clearCalendar();
  }

  componentDidUpdate() {
    // if (
    //   this.state.selectedDates.length > 0 &&
    //   this.state.editSelectedDates === false
    // ) {
    //   document.getElementById("lock-calendar").style.display = "block";
    //   document.getElementById("unlock-calendar").style.display = "none";
    // } else document.getElementById("lock-calendar").style.display = "none";
    // //immediately changes back to false after datepicker revieves props
    if (this.state.clearCalendar === true) {
      this.setState({ clearCalendar: false });
    }
  }

  signUp() {
    let dates = {
      lunch_dates: document.getElementById("selected-dates").innerHTML
    };
    fetch("http://192.168.0.8:8080/updateuser", {
      method: "POST",
      body: JSON.stringify(dates),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === 200) {
        alert("successs");
      }
    });
  }

  componentDidMount() {
    // document.getElementById("select-range").checked = true;
    // let that = this;
    // fetch("http://192.168.0.8:8080/currentuser")
    //   .then(res => res.json())
    //   .then(user => {
    //     that.setState({ user });
    //   });
  }

  showRange(range) {
    if (range.length === 0) return;
    return (
      <div
        className="selected-ranges-date"
        onClick={e => this.editRange(e.target)}
      >
        <div data-date={range[0]}>
          {formatDatePrettyShort(range[0]).split(",")[0]}
        </div>
        <div data-date={range[range.length - 1]}>
          {formatDatePrettyShort(range[range.length - 1]).split(",")[0]}
        </div>
        <div>{range.length}</div>
        <div>Me</div>
      </div>
    );
  }

  editRange(target) {
    if (!target.classList.contains("selected-ranges-date")) {
      target = target.parentNode;
    }
    target.style.background = "#20c997";
  }

  render() {
    let button = document.querySelector(".sign-up-button");
    let backgroundColor = "white",
      color,
      opacity = 0;
    if (button) button.disabled = true;
    if (this.state.selectedDates.length > 0) {
      opacity = 1;
      backgroundColor = "#20c997";
      color = "white";
      button.disabled = false;
    }
    return (
      <div className="main-container">
        <div className="lunch-sign-up">
          <div className="lunch-sign-up-dates">
            <div style={{ opacity }}>
              <div>
                <Button onClick={this.addRange}>Add Range</Button>
                <Button onClick={this.clearCalendar}>Clear</Button>
              </div>
            </div>
          </div>
          <div className="lunch-sign-up-btn-container">
            <Button
              style={{
                backgroundColor,
                color
              }}
              className="sign-up-button"
              onClick={() => this.signUp()}
              disabled
            >
              Book Lunch
            </Button>
          </div>
        </div>
        <div className="container-content">
          <div id="datepicker">
            <DatePicker
              clearCalendar={this.state.clearCalendar}
              editSelectedDates={this.state.editSelectedDates}
              setParentDates={this.setDates}
              selectBy={this.state.select}
              user={this.state.user}
            />
          </div>
          {/* <FormGroup className="datepicker-selection-options">
            <Glyphicon
              className="show-selection-options"
              onClick={e => this.toggleSelectionOptions(e.target)}
              glyph="option-horizontal"
            />
            <div className="selection-options-hide">
              <div className="selection-options">
                <div>Select: </div>
                <div>
                  <Radio
                    id="select-range"
                    name="selectGroup"
                    key="select-range"
                    onClick={() => this.setState({ select: "range" })}
                    inline
                  >
                    Range
                  </Radio>
                </div>
                <div>
                  <Radio
                    id="select-day"
                    name="selectGroup"
                    key="select-day"
                    onClick={() => this.setState({ select: "day" })}
                    inline
                  >
                    Day
                  </Radio>
                </div>
                
                <div>
                  <Glyphicon
                    glyph="option-vertical"
                    onClick={e => this.toggleSelectionOptions(e.target)}
                  />
                </div>
              </div>
            </div>
          </FormGroup> */}
          <div>
            <div className="selected-ranges">
              <div className="selected-ranges-header">
                <div>From</div>
                <div>To</div>
                <div>#days</div>
                <div>For</div>
              </div>
              <div className="selected-ranges-body">
                {this.state.addedRanges.map(range => this.showRange(range))}
                {this.showRange(this.state.selectedDates)}
              </div>
            </div>
          </div>
          <FormGroup id="lock-calendar" style={{ display: "none" }}>
            {/* <Button bsSize="small" onClick={this.lockCalendar}>
              Lock Calendar and edit guest list
            </Button>
          </FormGroup>
          <FormGroup id="unlock-calendar" style={{ display: "none" }}>
            <Button
              style={{ marginRight: "10px" }}
              bsSize="small"
              onClick={() =>
                this.setState({ editingDate: [this.state.selectedDates, true] })
              }
            >
              Guestlist for All Dates
            </Button>
            <Button bsSize="small" onClick={this.unlockCalendar}>
              Change Dates
            </Button> */}
          </FormGroup>
          {/* <FormGroup>
            <Button bsSize="small" onClick={this.clearCalendar}>
              Clear Calendar
            </Button>
          </FormGroup> */}
        </div>
        <EditingDate
          editingDate={this.state.editingDate}
          doneEditing={() => this.setState({ editingDate: [null, false] })}
        />
      </div>
    );
  }
}
export default AttendLunch;
