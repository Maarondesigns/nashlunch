import React, { Component } from "react";

//functions
import { getMonthName } from "../functions/dates/getMonthName";
import { getDays } from "../functions/dates/getDays";

//components
import DatePickerSummary from "./DatePickerSummary";
import { interpolateScroll } from "../functions/interpolateScroll";

class DatePicker2 extends Component {
  constructor() {
    super();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      cellSize: (window.innerWidth * 0.9 - 40) / 7,
      viewingMonth: new Date().getMonth(),
      viewingYear: new Date().getFullYear(),
      selectedDates: [],
      factor: 1
    };
  }

  componentWillReceiveProps() {
    this.setState({
      selectedDates: []
    });
  }

  formatDate(target) {
    let split = target.split("-");
    if (split[1].length === 1) {
      split[1] = "0" + split[1];
    }
    if (split[2].length === 1) {
      split[2] = "0" + split[2];
    }
    //6PM GMT (zulu time) = 12pm
    return split.join("-") + "T18:00:00Z";
  }

  selectByDay(target) {
    let date = new Date(this.formatDate(target.getAttribute("data-date")));
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
      date = new Date(this.formatDate(target.getAttribute("data-date"))),
      dates = this.state.selectedDates,
      dateTime = date.getTime(),
      daysInMillis = 1000 * 60 * 60 * 24;

    if (dates.length !== 1) {
      this.setState({
        selectedDates: [date]
      });
    } else {
      let stateTime = dates[0].getTime();
      if (dateTime === stateTime) {
        this.setState({
          selectedDates: []
        });
      } else if (dateTime < stateTime) {
        start = dateTime;
        end = stateTime;
      } else if (dateTime > stateTime) {
        end = dateTime;
        start = stateTime;
      }
      let newDates = [];
      while (start <= end) {
        newDates.push(start);
        start += daysInMillis;
      }
      this.setState({ selectedDates: newDates.map(x => new Date(x)) });
    }
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
      interpolateScroll(this.state.viewingMonth);
    }, 100);
  }

  //   componentDidMount() {
  //     // this.scrollToMonth(this.state.viewingMonth);
  //     this.updateDimensions();
  //     // window.addEventListener("resize", this.updateDimensions);
  //     window.addEventListener("onorientationchange", () => {
  //       interpolateScroll(this.state.viewingMonth);
  //       // this.scrollToMonth(this.state.viewingMonth);
  //     });
  //   }

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

    function drawCal(now) {
      //get data from current date object
      var year = now.getYear();
      if (year < 1000) year += 1900;
      var month = now.getMonth();
      var date = now.getDate();

      //how many months to show, 0 is current
      let array = [-1, 0, 1, 2, 3];
      //extract month data from array number
      let months = array.map(x => {
        let obj = {};
        let thisMonth = month + x;
        if (thisMonth === -1) {
          obj.month = 11;
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
        obj.rows = getRows(obj);
        return obj;
      });

      // constant table settings
      var todayColor = "red";

      // create array of abbreviated day names
      var weekDay = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

      //number of rows in given month
      function getRows(x) {
        let rows = [];
        for (let i = 1; i <= Math.ceil((x.lastDate + x.firstDay) / 7); i++) {
          rows.push(i);
        }
        return rows;
      }

      return (
        <div id="calendar-month">
          <div className="datepicker-header">
            <div
              className="previous-month"
              onClick={() => {
                let viewingMonth, viewingYear;
                if (that.state.viewingMonth === 0) {
                  viewingMonth = 11;
                  viewingYear = that.state.viewingYear - 1;
                } else {
                  viewingMonth = that.state.viewingMonth - 1;
                  viewingYear = that.state.viewingYear;
                }
                that.setState({ viewingMonth, viewingYear });
                interpolateScroll(viewingMonth);
              }}
            >
              {"<"}
            </div>
            <span className="month-year">{`${getMonthName(
              that.state.viewingMonth
            )} ${that.state.viewingYear}`}</span>
            <div
              className="next-month"
              onClick={() => {
                let viewingMonth, viewingYear;
                if (that.state.viewingMonth === 11) {
                  viewingMonth = 0;
                  viewingYear = that.state.viewingYear + 1;
                } else {
                  viewingMonth = that.state.viewingMonth + 1;
                  viewingYear = that.state.viewingYear;
                }
                that.setState({ viewingMonth, viewingYear });
                interpolateScroll(viewingMonth);
              }}
            >
              {">"}
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
                          <tr className={getMonthName(x.month) + "-" + row}>
                            {weekDay.map(day => {
                              //set background color for selected dates
                              let color;
                              if (
                                formattedDates.indexOf(
                                  `${x.year}-${x.month}-${digit}`
                                ) === -1
                              ) {
                                color = "none";
                              } else color = "rgba(50,70,200,0.5)";

                              //blank cells before and after days of month
                              if (digit > x.lastDate) return <td />;
                              if (curCell < x.firstDay) {
                                curCell++;
                                return <td />;
                              } else {
                                //current date
                                if (digit === date && x.month === month) {
                                  digit++;
                                  return (
                                    <td
                                      style={{
                                        background: color
                                      }}
                                      key={`${x.year}-${x.month + 1}-${digit -
                                        1}`}
                                      data-date={`${x.year}-${x.month +
                                        1}-${digit - 1}`}
                                      data-day={day}
                                    >
                                      <font color={todayColor}>
                                        {digit - 1}
                                      </font>{" "}
                                    </td>
                                  );
                                } else {
                                  digit++;
                                  return (
                                    <td
                                      key={`${x.year}-${x.month + 1}-${digit -
                                        1}`}
                                      style={{
                                        background: color,
                                        width:
                                          that.state.cellSize /
                                          that.state.factor,
                                        height:
                                          that.state.cellSize /
                                          that.state.factor
                                      }}
                                      data-date={`${x.year}-${x.month +
                                        1}-${digit - 1}`}
                                      data-day={day}
                                      onClick={e => {
                                        if (that.props.selectBy === "day") {
                                          that.selectByDay(e.target);
                                        }
                                        if (that.props.selectBy === "range") {
                                          that.selectByRange(e.target);
                                        }
                                      }}
                                    >
                                      {digit - 1}
                                    </td>
                                  );
                                }
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

    // standard time attributes
    var now = new Date();

    // call function to draw calendar
    return drawCal(now);
  }

  render() {
    return (
      <React.Fragment>
        <div id="datepicker-container">{this.setCal()}</div>
        <DatePickerSummary selected={this.state.selectedDates} />
      </React.Fragment>
    );
  }
}

export default DatePicker2;
