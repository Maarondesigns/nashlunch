import React, { Component } from "react";

//components
import { ButtonGroup, Button, Glyphicon } from "react-bootstrap";
import { interpolateToggle } from "../functions/interpolateToggle";

class DatePickerSummary extends Component {
  render() {
    return (
      <div id="datepicker-summary-container">
        {this.props.selected.map((date, index) => {
          let month = date.getMonth() + 1;
          let year = date.getFullYear();
          let day = date.getDate();
          return (
            <div
              key={index}
              className="selected-date"
              data-date={`${year}-${month}-${day}`}
            >
              <div className="selected-date-title">
                <div>{`${year}-${month}-${day}`}</div>
                <div id="edit-selected-date">
                  <Button
                    bsSize="xsmall"
                    onClick={() =>
                      interpolateToggle(
                        `.edit-date-details[data-date="${year}-${month}-${day}"]`
                      )
                    }
                  >
                    <Glyphicon glyph="pencil" />
                  </Button>
                </div>
              </div>
              <div
                className="edit-date-details"
                data-date={`${year}-${month}-${day}`}
              >
                <div className="selected-date-details">
                  <div>
                    <div>Guests:</div>
                  </div>
                  <div>
                    <div>
                      <input
                        id={`guest-number-input-${index}`}
                        type="text"
                        value={0}
                      />
                    </div>
                  </div>
                  <div className="add-guest-button">
                    <div>
                      <ButtonGroup>
                        <Button bsSize="xsmall">
                          <Glyphicon
                            glyph="plus"
                            onClick={() => {
                              let input = document.getElementById(
                                `guest-number-input-${index}`
                              );
                              let value = +input.value;
                              value += 1;
                              input.value = value;
                            }}
                          />
                        </Button>
                        <Button bsSize="xsmall">
                          <Glyphicon
                            glyph="minus"
                            onClick={() => {
                              let input = document.getElementById(
                                `guest-number-input-${index}`
                              );
                              let value = +input.value;
                              value -= 1;
                              if (value < 0) value = 0;
                              input.value = value;
                            }}
                          />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default DatePickerSummary;
