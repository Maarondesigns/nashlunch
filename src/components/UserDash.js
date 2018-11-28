import React, { Component } from "react";
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Button,
  InputGroup,
  Glyphicon
} from "react-bootstrap";

//data
import DietaryPref from "../dummy_data/DietaryPref.json";

//variables
// const dps = DietaryPref.dietary_preferences;

class UserDash extends Component {
  constructor(props, context) {
    super(props, context);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      name: "",
      email: "",
      dietary_pref: [],
      dps: DietaryPref.dietary_preferences.sort()
    };
  }

  getValidationState() {
    const email = this.state.email;
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegex)) return "success";
    else if (email === "") return null;
    else return "error";
  }

  // showCheckboxes() {
  //   return dps.map(dp => {
  //     return (
  //       <p>
  //         <label>
  //           <input type="checkbox" />
  //           <span>{dp}</span>
  //         </label>
  //       </p>
  //     );
  //   });
  // }

  checkboxChecked(e) {
    if (e.target.checked) {
      let value = e.target.nextSibling.data;
      this.setState({
        dietary_pref: [...this.state.dietary_pref, value]
      });
    }
  }

  componentDidMount() {
    fetch("http://192.168.0.8:8080/currentuser")
      .then(data => data.json())
      .then(currentUser => {
        // document.getElementById("form-full-name").value = currentUser.name;
        // document.getElementById("form-email").value = currentUser.email;
        this.setState({
          name: currentUser.name,
          email: currentUser.email,
          dietary_pref: currentUser.dietary_pref
        });
        let checkboxes = document.querySelectorAll(".checkbox");
        checkboxes.forEach(x => {
          let nodes = x.childNodes[0].childNodes;
          let input = nodes[0];
          let data = nodes[1].data;
          if (currentUser.dietary_pref.indexOf(data) !== -1) {
            input.checked = true;
          }
        });
      });
  }

  submitForm(e) {
    e.preventDefault();
    fetch("http://192.168.0.8:8080/updateuser", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status === 200) {
        alert("successs");
      }
    });
  }

  render() {
    return (
      <div className="main-container">
        <div className="container-title">Dietary Restrictions / Allergies</div>
        <div className="container-content">
          <form onSubmit={this.submitForm}>
            <FormGroup className="dp-container">
              <div className="checkbox-container">
                {this.state.dps.map(dp => {
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
              <InputGroup>
                <FormControl type="text" placeholder="Add Restriction" />
                <InputGroup.Addon>
                  <Glyphicon
                    glyph="plus"
                    onClick={e => {
                      let target = e.target.parentNode.previousSibling;
                      let value = target.value;
                      //less than 3 characters is probably not a word
                      if (value.length > 2) {
                        //uppercase first letter so sorting works properly
                        value = value.charAt(0).toUpperCase() + value.slice(1);
                        //add to array and set state with array sorted
                        let dpsAdd = [...this.state.dps, value];
                        this.setState({
                          dps: dpsAdd.sort()
                        });
                        target.value = "";
                      } else alert("Must be more than 2 characters");
                    }}
                  />
                </InputGroup.Addon>
              </InputGroup>
            </FormGroup>
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Other / Comments</ControlLabel>
              <FormControl
                componentClass="textarea"
                placeholder="Add special restrictions, allergies, or comments"
              />
            </FormGroup>
            <FormGroup className="update-profile">
              <Button type="submit" className="btn-info">
                Update Profile
              </Button>
            </FormGroup>
          </form>
        </div>
      </div>
    );
  }
}

export default UserDash;
