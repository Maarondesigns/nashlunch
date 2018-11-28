import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";

//functions
import { getMonthName } from "../functions/dates/getMonthName";
import { getDays } from "../functions/dates/getDays";
import { interpolateHzScroll } from "../functions/interpolateHzScroll";
import { formatDate } from "../functions/dates/formatDate";
import { reverseFormatDate } from "../functions/dates/reverseFormatDate";
import { HzScrollStep } from "../functions/HzScrollStep";
import { getMonthNum } from "../functions/dates/getMonthNum";

//components
import YearCalendar from "./YearCalendar";

class DatePicker2 extends Component {
  constructor() {
    super();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.yearCalendar = this.yearCalendar.bind(this);
    this.state = {
      cellSize: 0,
      viewingWeek: null,
      viewingMonth: getMonthName(new Date().getMonth()),
      viewingYear: new Date().getFullYear(),
      selectedDate: new Date(),
      weeksUsers: [],
      loadedMonths: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
      yearCalendar: false
    };
  }

  yearCalendar() {
    this.setState({ yearCalendar: true });
  }

  componentDidUpdate() {
    let months = this.getMonthObjects();
    let allWeeks = this.getAllWeeks(months);
    let weeksUsers = this.getUsers(
      allWeeks[this.state.viewingWeek],
      this.getAllUsers()
    );

    if (this.state.weeksUsers.length === 0 && weeksUsers.length !== 0) {
      this.setState({ weeksUsers });
      //   let day = reverseFormatDate(this.state.selectedDate);
      //   let daysUsers = weeksUsers.filter(
      //     user => user.lunch_dates[0].days_in_range.indexOf(day) !== -1
      //   );
      //   this.props.setDate(day, daysUsers);
    } else {
      let prevNames = this.state.weeksUsers.map(x => x.name);
      let newNames = weeksUsers.map(x => x.name);
      let trueFalse = [];
      prevNames.forEach((x, i) => trueFalse.push(x === newNames[i]));
      if (trueFalse.indexOf(false) !== -1) {
        this.setState({ weeksUsers });
      }
    }

    //update this weeks users based on screen size (number of weeks showing)
  }

  setScrollListener() {
    let scrollTimer = -1;
    let that = this;

    function startScroll(e) {
      if (scrollTimer !== -1) clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        new Promise((resolve, reject) => {
          HzScrollStep(
            resolve,
            e.target,
            Math.floor(e.target.scrollLeft),
            Math.floor(that.state.cellSize)
          );
        }).then(data => {
          if (data !== null) {
            setTimeout(
              () =>
                that.setState({
                  viewingMonth: data.month,
                  viewingWeek: +data.week,
                  viewingYear: +data.year
                }),
              250
            );
          }
        });
      }, 500);
    }
    document
      .querySelector(".table-body")
      .addEventListener("scroll", e => startScroll(e));
  }

  updateDimensions() {
    if (window.innerWidth > 1111) {
      // container size minus padding, cal is 80% of container, show 26 days
      this.setState({ cellSize: Math.floor(((1000 - 40) * 0.8) / 26) });
    } else if (window.innerWidth > 800) {
      // container size is 90% of window, minus padding, cal is 80% of container, show 19 days
      this.setState({
        cellSize: Math.floor(((window.innerWidth * 0.9 - 40) * 0.8) / 19)
      });
    } else if (window.innerWidth > 500) {
      //show 12 days
      this.setState({
        cellSize: Math.floor(((window.innerWidth * 0.9 - 40) * 0.8) / 12)
      });
    } else {
      this.setState({
        // container size is 90% of window, no padding, cal is 70% of container, show 5 days
        cellSize: Math.floor((window.innerWidth * 0.9 * 0.7) / 5)
      });
    }

    setTimeout(() => {
      interpolateHzScroll(".week-" + this.state.viewingWeek);
    }, 100);
  }

  componentDidMount() {
    this.setScrollListener();
    let week = document.getElementById("today").classList[0].split("-")[1];

    this.setState({ viewingWeek: +week });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);

    setTimeout(() => {
      let day = reverseFormatDate(this.state.selectedDate);
      let daysUsers = this.state.weeksUsers.filter(
        user => user.lunch_dates[0].days_in_range.indexOf(day) !== -1
      );
      this.props.setDate(day, daysUsers);
    }, 500);
  }

  getAllUsers() {
    return this.props.userList.users.filter(
      user => user.lunch_dates.length > 0
    );
  }

  getUsers(week, users) {
    let weeksUsers = [];
    users.forEach(user => {
      let usersDays = user.lunch_dates[0].days_in_range;
      week.forEach(day => {
        if (usersDays.indexOf(day) !== -1 && weeksUsers.indexOf(user) === -1) {
          weeksUsers.push(user);
        }
      });
    });

    return weeksUsers;
  }

  displayWeeksUsers() {
    let users = this.state.weeksUsers;
    if (!users) {
      return <div>Loading...</div>;
    } else {
      return users.map(user => {
        let split = user.name.split(" ");
        if (window.innerWidth < 700) {
          return (
            <div key={user.name}>{split[0] + " " + split[1][0] + "."}</div>
          );
        }
        return <div key={user.name}>{user.name}</div>;
      });
    }
  }

  showUserBars(day, dayLetter) {
    // if (dayLetter === "S") return;
    let weeksUsers = this.state.weeksUsers;
    if (!weeksUsers) {
      return;
    } else {
      return weeksUsers.map(user => {
        let notToday = user.lunch_dates[0].days_in_range.indexOf(day) === -1;
        let factor = user.dietary_pref.length * 25;
        let style = {
          backgroundColor: `rgba(${25 + factor}, 50, ${200 - factor}, 0.5)`,
          borderBottom: "solid 1px rgb(220, 220, 220)"
        };
        if (notToday) style.backgroundColor = "none";
        if (dayLetter === "S") style.opacity = "0.3";
        return (
          <div key={user.name + "-bar"} style={style} className="user-bar" />
        );
      });
    }
  }

  getRows(x) {
    let weeks = [];
    let col = x.firstDay;
    let day = 1;
    for (let i = 1; i <= Math.ceil((x.lastDate + x.firstDay) / 7); i++) {
      let days = [];
      while (col < 7 && day <= x.lastDate) {
        days.push(`${x.year}-${x.month + 1}-${day}`);
        day++;
        col++;
      }
      col = 0;

      weeks.push(days);
    }
    return weeks;
  }

  getMonthObjects() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();

    let map = this.state.loadedMonths.map(x => {
      let obj = {};
      let thisMonth = month + x;
      if (thisMonth < 0) {
        obj.month = thisMonth + 11;
        obj.year = year - 1;
      } else if (thisMonth > 11) {
        obj.month = thisMonth - 12;
        obj.year = year + 1;
      } else {
        obj.month = thisMonth;
        obj.year = year;
      }
      obj.lastDate = getDays(obj.month, obj.year);
      let fd = new Date(obj.year, obj.month).getDay();
      fd !== 0 ? (obj.firstDay = fd - 1) : (obj.firstDay = fd + 6);
      obj.weeks = this.getRows(obj);
      return obj;
    });

    if (getMonthNum(this.state.viewingMonth) === map[map.length - 1].month) {
      let addMonth =
        this.state.loadedMonths[this.state.loadedMonths.length - 1] + 1;
      this.setState({ loadedMonths: [...this.state.loadedMonths, addMonth] });
    } else if (getMonthNum(this.state.viewingMonth) === map[0].month) {
      let subMonth = this.state.loadedMonths[0] - 1;
      this.setState({ loadedMonths: [subMonth, ...this.state.loadedMonths] });
    }
    return map;
  }

  getAllWeeks(months) {
    let allWeeks = [];
    let partOfWeek = [];

    months.forEach((m, i) => {
      m.weeks.forEach((w, ind) => {
        if (partOfWeek.length === 7) {
          allWeeks.push(partOfWeek);
          partOfWeek = [];
          allWeeks.push(w);
        } else if (w.length === 7) {
          allWeeks.push(w);
        } else if (i === 0 && ind === 0) {
          allWeeks.push(w);
        } else {
          w.forEach(d => {
            partOfWeek.push(d);
          });
        }
      });
    });
    return allWeeks;
  }

  drawCal() {
    //so this is usable inside other functions
    let that = this;

    let users = this.getAllUsers();

    //get data from current date object
    let now = new Date();
    let year = now.getYear();
    if (year < 1000) year += 1900;

    // create array of abbreviated day names
    let weekDay = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ];

    let months = this.getMonthObjects();

    let allWeeks = this.getAllWeeks(months);

    // if (!that.state.weekDates && that.state.viewingWeek) {
    //   that.setState({ weekDates: allWeeks[that.state.viewingWeek] });
    // }
    // if (!that.state.weeksUsers && that.state.viewingWeek) {
    //   that.getUsers(allWeeks[that.state.viewingWeek], users);
    // }

    return (
      <div id="calendar-week">
        <div className="datepicker-header">
          <div
            className="previous-month"
            onClick={() => {
              let viewingWeek = that.state.viewingWeek - 1;
              that.getUsers(allWeeks[viewingWeek], users);
              that.setState({ viewingWeek });
              interpolateHzScroll(".week-" + viewingWeek);
            }}
          >
            <Glyphicon glyph="chevron-left" />
          </div>
          <span className="month-year" onClick={that.yearCalendar}>
            {`${that.state.viewingMonth} ${that.state.viewingYear}`}
          </span>
          <div
            className="next-month"
            onClick={() => {
              let viewingWeek = that.state.viewingWeek + 1;

              that.getUsers(allWeeks[viewingWeek], users);
              that.setState({ viewingWeek });
              interpolateHzScroll(".week-" + viewingWeek);
            }}
          >
            <Glyphicon glyph="chevron-right" />
          </div>
        </div>
        <div className="week-calendar-container">
          <div className="this-weeks-names">{that.displayWeeksUsers()}</div>
          <div className="week-calendar table-body">
            <table>
              <tbody>
                <tr
                  style={{
                    display: "flex"
                  }}
                >
                  {allWeeks.map((week, weekIndex) => {
                    return week.map((day, dayIndex) => {
                      let style = {
                        width: that.state.cellSize,
                        minHeight: "125px"
                      };
                      let split = day.split("-"),
                        month = split[1],
                        dayDigit = split[2],
                        id = "";

                      style.display = "block";
                      style.background = "none";
                      style.border = "none";
                      style.marginTop = 0;

                      if (weekDay[dayIndex] === "Saturday") {
                        style.background = "rgb(250,250,250)";
                        style.borderLeft = "solid 1px rgba(0,0,0,0.3)";
                      }
                      if (weekDay[dayIndex] === "Sunday") {
                        style.background = "rgb(250,250,250)";
                        style.borderRight = "solid 1px rgba(0,0,0,0.3)";
                      }

                      if (reverseFormatDate(that.state.selectedDate) === day) {
                        id = "today";
                        style.background = "rgba(32, 201, 151,0.2)";
                        style.border = "solid 2px #20c997";
                        style.marginTop = "-2px";
                      }
                      return (
                        <td
                          className={
                            "week-" +
                            weekIndex +
                            " weekdays " +
                            getMonthName(month - 1)
                          }
                          id={id}
                          style={style}
                          key={day}
                          data-date={day}
                          data-day={weekDay[dayIndex]}
                          data-scroll={
                            that.state.cellSize * (weekIndex * 7 + dayIndex)
                          }
                          onClick={() => {
                            that.setState({
                              selectedDate: new Date(formatDate(day))
                            });
                            let daysUsers = that.state.weeksUsers.filter(
                              user =>
                                user.lunch_dates[0].days_in_range.indexOf(
                                  day
                                ) !== -1
                            );
                            that.props.setDate(day, daysUsers);
                          }}
                        >
                          <div className="week-day-name">
                            {weekDay[dayIndex][0]}
                          </div>
                          <div className="week-day-num">{dayDigit}</div>
                          {that.showUserBars(day, weekDay[dayIndex][0])}
                        </td>
                      );
                    });
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div id="datepicker-container">{this.drawCal()}</div>

        <YearCalendar
          closeYrCal={() => this.setState({ yearCalendar: false })}
          display={this.state.yearCalendar}
          currentMonth={getMonthNum(this.state.viewingMonth)}
        />
      </React.Fragment>
    );
  }
}

export default DatePicker2;
