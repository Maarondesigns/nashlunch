import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";

//functions
import { getMonthName } from "../functions/dates/getMonthName";
import { getDays } from "../functions/dates/getDays";
import { formatDate } from "../functions/dates/formatDate";

//components
import DatePickerSummary from "./DatePickerSummary";
import { interpolateScroll } from "../functions/interpolateScroll";
import EditingDate from "./EditingDate";
import YearCalendar from "./YearCalendar";

class DatePicker extends Component {
  constructor() {
    super();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.yearCalendar = this.yearCalendar.bind(this);
    this.state = {
      cellSize: (window.innerWidth * 0.9 - 40) / 7,
      viewingMonth: new Date().getMonth(),
      viewingYear: new Date().getFullYear(),
      selectedDates: [],
      factor: 1,
      editingDate: [null, false],
      yearCalendar: false,
      allDates: [],
      loadedMonths: []
    };
  }

  componentWillReceiveProps() {
    if (this.props.clearCalendar === true) {
      this.setState({ selectedDates: [] });
    }
  }

  componentDidUpdate() {
    this.props.setParentDates(this.state.selectedDates);

    let allDates = [];
    document
      .querySelectorAll(".month-cell")
      .forEach(cell => allDates.push(cell.dataset.date));
    if (allDates.length !== this.state.allDates.length) {
      this.setState({ allDates });
    }
  }

  getMonthObjects(array) {
    var now = new Date();
    //get data from current date object
    var year = now.getYear();
    if (year < 1000) year += 1900;
    var month = now.getMonth();
    // var date = now.getDate();

    let months = array.map(x => {
      let obj = {};
      let thisMonth = month + x;
      if (thisMonth < 0) {
        obj.month = thisMonth + 12;
        obj.year = year - 1;
      } else if (thisMonth > 11) {
        obj.month = thisMonth - 12;
        obj.year = year + 1;
      } else {
        obj.month = thisMonth;
        obj.year = year;
      }
      obj.lastDate = getDays(obj.month, obj.year);
      obj.firstDay = new Date(obj.year, obj.month).getDay() - 1;
      if (obj.firstDay === -1) obj.firstDay = 6;
      obj.rows = getRows(obj);
      return obj;
    });
    //number of rows in given month
    function getRows(x) {
      let rows = [];
      for (let i = 1; i <= Math.ceil((x.lastDate + x.firstDay) / 7); i++) {
        rows.push(i);
      }
      return rows;
    }

    return months;
  }

  changeMonth(input) {
    let nextMonth;
    if (input === "minus") nextMonth = -1;
    if (input === "plus") nextMonth = 1;

    let viewingMonth, viewingYear;
    let stateVM = this.state.viewingMonth,
      stateVY = this.state.viewingYear;
    if (stateVM === 0 && input === "minus") {
      viewingMonth = 11;
      viewingYear = stateVY += nextMonth;
    } else if (stateVM === 11 && input === "plus") {
      viewingMonth = 0;
      viewingYear = stateVY += nextMonth;
    } else {
      viewingMonth = stateVM += nextMonth;
      viewingYear = stateVY;
    }

    this.setState({ viewingMonth, viewingYear });
    interpolateScroll(viewingMonth, viewingYear);
    //load more months if necessary
    let loadedMonths = this.state.loadedMonths;
    let monthNums = this.getMonthObjects(this.state.loadedMonths);

    if (
      viewingMonth === monthNums[0].month &&
      viewingYear === monthNums[0].year
    ) {
      loadedMonths.unshift(loadedMonths[0] - 1);
      this.setState({ loadedMonths });
    } else if (
      viewingMonth === monthNums[monthNums.length - 1].month &&
      viewingYear === monthNums[monthNums.length - 1].year
    ) {
      loadedMonths.push(loadedMonths[loadedMonths.length - 1] + 1);
      this.setState({ loadedMonths });
    }
  }

  yearCalendar() {
    this.setState({ yearCalendar: true });
  }

  selectByDay(target) {
    let date = new Date(formatDate(target.getAttribute("data-date")));
    let selectedTimes = this.state.selectedDates.map(x => x.getTime());
    if (selectedTimes.indexOf(date.getTime()) === -1) {
      // target.style.backgroundColor = "rgba(50,70,200,0.5)";
      this.setState({
        selectedDates: [...this.state.selectedDates, date]
      });
    } else {
      // target.style.backgroundColor = "none";
      this.setState({
        selectedDates: this.state.selectedDates.filter(
          x => x.getTime() !== date.getTime()
        )
      });
    }
  }

  selectByRange(target) {
    let start,
      end,
      date = new Date(formatDate(target.getAttribute("data-date"))),
      dates = this.state.selectedDates,
      dateTime = date.getTime(),
      daysInMillis = 1000 * 60 * 60 * 24,
      //existing lunch dates in milliseconds
      lunchDates = this.props.user.lunch_dates.days_in_range.map(x =>
        new Date(formatDate(x)).getTime()
      );

    //deselect range and start again
    if (dates.length !== 1) {
      this.setState({
        selectedDates: [date]
      });
    } else {
      let stateTime = dates[0].getTime();
      //deselect single date if clicked
      if (dateTime === stateTime) {
        this.setState({
          selectedDates: []
        });
      } // set start / end based on where second date click occurs
      else if (dateTime < stateTime) {
        start = dateTime;
        end = stateTime;
      } else if (dateTime > stateTime) {
        end = dateTime;
        start = stateTime;
      }
      //increment one day at a time and push to array if it's not already in database
      let newDates = [];
      while (start <= end) {
        if (lunchDates.indexOf(start) === -1) {
          newDates.push(start);
        }

        start += daysInMillis;
      }
      //set array of dates
      let selectedDates = newDates
        .map(x => new Date(x))
        .filter(x => x.getDay() !== 6 && x.getDay() !== 0);
      this.setState({ selectedDates });
    }
  }

  editExistingDate(date) {
    this.setState({ editingDate: [[formatDate(date)], true] });
  }

  updateDimensions() {
    if (window.innerWidth > 1111) {
      this.setState({ factor: 2, cellSize: (1000 - 40) / 7 });
    } else {
      if (window.innerWidth < 600) {
        this.setState({ factor: 1 });
      } else this.setState({ factor: 2 });
      this.setState({ cellSize: (window.innerWidth * 0.9 - 40) / 7 });
    }

    setTimeout(() => {
      interpolateScroll(this.state.viewingMonth, this.state.viewingYear);
    }, 100);
  }

  componentDidMount() {
    this.setState({
      loadedMonths: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]
    });

    this.updateDimensions();

    window.addEventListener("onorientationchange", () => {
      interpolateScroll(this.state.viewingMonth, this.state.viewingYear);
    });
  }

  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.updateDimensions);
  // }

  // scrollToMonth(month) {
  //   let thisMonthTop = document.querySelector("." + getMonthName(month) + "-1")
  //     .offsetTop;
  //   document.querySelector(".table-body").scrollTop = thisMonthTop;
  // }

  setCal() {
    //so this is usable inside other functions
    let that = this;
    let formattedDates = this.state.selectedDates.map(
      x => `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`
    );

    //sort selected dates and see if it is inside range, start or end, then map class name
    let isInRange;
    if (this.state.allDates.length > 0 && this.state.selectedDates.length > 0) {
      let sortedFormat = formattedDates
        .sort((a, b) => a.split("-")[2] - b.split("-")[2])
        .sort((a, b) => a.split("-")[1] - b.split("-")[1])
        .sort((a, b) => a.split("-")[0] - b.split("-")[0]);

      isInRange = sortedFormat.map((date, i) => {
        //fixes month number not matching
        let ad = this.state.allDates.map(x => {
          let split = x.split("-");
          split[1] = +split[1] - 1;
          return split.join("-");
        });
        let index = ad.indexOf(date);
        if (
          sortedFormat[i - 1] === ad[index - 1] &&
          sortedFormat[i + 1] === ad[index + 1]
        ) {
          return "inside-range";
        } else if (
          sortedFormat[i - 1] !== ad[index - 1] &&
          sortedFormat[i + 1] === ad[index + 1]
        ) {
          return "start-range";
        } else if (
          sortedFormat[i - 1] === ad[index - 1] &&
          sortedFormat[i + 1] !== ad[index + 1]
        ) {
          return "end-range";
        } else return "";
      });
    }

    let now = new Date();
    let time = now.getTime();
    let month = now.getMonth();
    let date = now.getDate();
    //how many months to show
    let months;
    if (this.state.loadedMonths.length === 0) {
      months = this.getMonthObjects([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
    } else months = this.getMonthObjects(this.state.loadedMonths);

    // create array of abbreviated day names
    var weekDay = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    let lunchDates = [];
    if (that.props.user) {
      lunchDates = that.props.user.lunch_dates.days_in_range;
    }
    if (months.length === 0) {
      return <div>Loading</div>;
    }
    return (
      <div id="calendar-month">
        <div className="datepicker-header" style={{ marginBottom: "10px" }}>
          <div
            className="previous-month"
            onClick={() => that.changeMonth("minus")}
          >
            <Glyphicon glyph="chevron-left" />
          </div>
          <div
            className="month-year"
            onClick={that.yearCalendar}
          >{`${getMonthName(that.state.viewingMonth)} ${
            that.state.viewingYear
          }`}</div>
          <div className="next-month" onClick={() => that.changeMonth("plus")}>
            <Glyphicon glyph="chevron-right" />
          </div>
        </div>

        <div className="datepicker">
          <table>
            <thead className="datepicker table-head">
              <tr>
                {weekDay.map(day => {
                  return (
                    <th
                      style={{
                        width: that.state.cellSize / that.state.factor
                      }}
                      key={day}
                    >
                      {day}
                    </th>
                  );
                })}
              </tr>
            </thead>
          </table>
        </div>
        <div
          className="datepicker table-body"
          style={{
            maxHeight:
              months.filter(x => x.month === that.state.viewingMonth)[0].rows
                .length *
              (that.state.cellSize / that.state.factor)
          }}
        >
          <table>
            <tbody>
              {months.map(x => {
                //day of month
                let digit = 1;
                //iterator through all cells
                let curCell = 0;

                return (
                  <React.Fragment>
                    {x.rows.map(row => {
                      return (
                        <tr
                          style={{
                            borderTop: "solid 2px white",
                            borderBottom: "solid 2px white"
                          }}
                          key={`${x.month}-${row}`}
                          className={
                            getMonthName(x.month) + "-row" + row + "-" + x.year
                          }
                        >
                          {weekDay.map(day => {
                            //set classes
                            let classes = "month-cell";
                            if (digit === date && x.month === month) {
                              classes += " today";
                            }
                            let selectedIndex = formattedDates.indexOf(
                              `${x.year}-${x.month}-${digit}`
                            );
                            if (selectedIndex !== -1) {
                              classes += " signed-up";
                              if (isInRange) {
                                classes += ` ${isInRange[selectedIndex]}`;
                              }
                            }
                            //set dateFormat
                            let dataDate = `${x.year}-${x.month + 1}-${digit}`;
                            let dateobj = new Date(formatDate(dataDate));

                            //set color, functions and content
                            let background, onClick, content;

                            //if user is already signed up for date
                            if (lunchDates.indexOf(dataDate) !== -1) {
                              onClick = e => {
                                that.editExistingDate(dataDate);
                              };

                              content = () => {
                                let hasPassed;
                                if (dateobj.getTime() < time) {
                                  hasPassed = "passed-date";
                                } else {
                                  hasPassed = "future-date";
                                }
                                return (
                                  <React.Fragment>
                                    <div>{digit - 1}</div>
                                    <div className={`guest-num ${hasPassed}`} />
                                  </React.Fragment>
                                );
                              };
                            } else {
                              //if user is not signed up for date
                              content = () => <div>{digit - 1}</div>;
                              //can't click on saturday or sunday
                              if (day === "Sa" || day === "Su") {
                                onClick = e => {};
                              } else {
                                onClick = e => {
                                  let target = e.target;
                                  if (target.nodeName === "DIV")
                                    target = target.parentNode;
                                  if (that.props.selectBy === "day") {
                                    that.selectByDay(target);
                                  }
                                  if (that.props.selectBy === "range") {
                                    that.selectByRange(target);
                                  }
                                };
                              }
                            }

                            //if not in selected date range
                            if (
                              formattedDates.indexOf(
                                `${x.year}-${x.month}-${digit}`
                              ) === -1
                            ) {
                              if (that.props.editSelectedDates === true) {
                                onClick = () => {
                                  return;
                                };
                              } else background = "none";
                            } else {
                              //if in selected date range
                              if (that.props.editSelectedDates === true) {
                                background = "rgba(255, 50, 50, 0.6)";
                                onClick = e => {
                                  that.editExistingDate(dataDate);
                                };
                              } else background = "rgba(0, 155, 100, 0.6)";
                            }

                            //blank cells before and after days of month
                            if (digit > x.lastDate)
                              return <td key={Math.random()} />;
                            if (curCell < x.firstDay) {
                              curCell++;
                              return <td key={Math.random()} />;
                            } else {
                              digit++;

                              return (
                                <td
                                  key={dataDate}
                                  className={classes}
                                  style={{
                                    background,
                                    width:
                                      that.state.cellSize / that.state.factor,
                                    height:
                                      that.state.cellSize / that.state.factor
                                  }}
                                  data-date={dataDate}
                                  data-day={day}
                                  onClick={onClick}
                                >
                                  {content()}
                                </td>
                              );
                            }
                          })}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div id="datepicker-container">{this.setCal()}</div>
        {/* <DatePickerSummary selected={this.state.selectedDates} /> */}
        <EditingDate
          editingDate={this.state.editingDate}
          doneEditing={() => this.setState({ editingDate: [null, false] })}
        />
        <YearCalendar
          closeYrCal={() => this.setState({ yearCalendar: false })}
          display={this.state.yearCalendar}
          currentMonth={this.state.viewingMonth}
        />
      </React.Fragment>
    );
  }
}

export default DatePicker;
