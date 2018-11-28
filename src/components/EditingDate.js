import React from "react";
import {
  Modal,
  Button,
  Glyphicon,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  InputGroup
} from "react-bootstrap";

//data
import userList from "../dummy_data/users.json";
import DietaryPref from "../dummy_data/DietaryPref.json";

//functions
import { formatDatePretty } from "../functions/dates/formatDatePretty";

//variables
const dps = DietaryPref.dietary_preferences;

class EditingDate extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dietary_pref: [],
      addedGuests: []
    };
  }

  showTitle() {
    let dates = this.props.editingDate[0];
    if (dates) {
      if (dates.length === 1) return formatDatePretty(dates[0]);
      else return `Editing (${dates.length}) Dates`;
    }
  }

  checkboxChecked(e) {
    if (e.target.checked) {
      let value = e.target.nextSibling.data;
      this.setState({
        dietary_pref: [...this.state.dietary_pref, value]
      });
    }
  }

  addNewGuest(guest) {
    let el = document.getElementById("unregistered-guest");
    if (guest === "Unregistered User") {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  }

  render() {
    let style = { marginBottom: 0, boxShadow: "none", gridColumn: "1/3" };
    return (
      <Modal
        style={{ textAlign: "center" }}
        show={this.props.editingDate[1]}
        onHide={this.props.doneEditing}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.showTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Add Guests</h4>
          <div className="selected-date-details">
            <FormGroup style={style} controlId="formControlsSelect">
              <InputGroup>
                <FormControl
                  componentClass="select"
                  defaultValue="select"
                  onChange={e => this.addNewGuest(e.target.value)}
                >
                  <option value="select" disabled>
                    Select
                  </option>
                  <option value="Unregistered User">Unregistered User</option>
                  {userList.users.map(user => {
                    return (
                      <option key={user.name} value={user.name}>
                        {user.name}
                      </option>
                    );
                  })}
                </FormControl>

                <InputGroup.Addon>
                  <Glyphicon
                    glyph="plus"
                    onClick={e => {
                      let target = e.target.parentNode.previousSibling;

                      let value = target.value;
                      if (value === "Unregistered User") {
                        value = document.getElementById("form-full-name").value;
                      }
                      //uppercase first letter of each name(also needed for sorting to work)
                      value = value
                        .split(" ")
                        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                        .join(" ");
                      //add to array and set state with array sorted
                      let guestAdd = [...this.state.addedGuests, value];
                      this.setState({
                        addedGuests: guestAdd.sort()
                      });
                      target.value = "select";
                      document.getElementById(
                        "unregistered-guest"
                      ).style.display = "none";
                    }}
                  />
                </InputGroup.Addon>
              </InputGroup>
            </FormGroup>
          </div>
          <FormGroup style={style}>
            <ControlLabel>Guest List</ControlLabel>
            <div id="added-guests">
              {this.state.addedGuests.map(guest => {
                return <div>{guest}</div>;
              })}
            </div>
          </FormGroup>
          <div id="unregistered-guest" style={{ display: "none" }}>
            <FormGroup style={style} controlId="form-full-name">
              <ControlLabel>Full Name</ControlLabel>
              <FormControl
                type="text"
                onChange={e => this.setState({ name: e.target.value })}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup style={style} className="dp-container">
              <ControlLabel>Dietary Restrictions / Allergies</ControlLabel>
              <div className="checkbox-container">
                {dps.map(dp => {
                  return (
                    <Checkbox
                      id={"checkbox-" + dp}
                      key={dp}
                      onInput={this.checkboxChecked.bind(this)}
                    >
                      {dp}
                    </Checkbox>
                  );
                })}
              </div>
            </FormGroup>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ textAlign: "center" }}>
          <Button onClick={this.handleClose}>Update Guest List</Button>
          <Button onClick={this.handleClose}>Delete Date</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditingDate;
