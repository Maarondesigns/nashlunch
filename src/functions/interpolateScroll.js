import * as d3 from "d3-selection";
import { transition, duration } from "d3-transition";
import { interpolateNumber } from "d3-interpolate";

//functions
import { getMonthName } from "../functions/dates/getMonthName";

export function interpolateScroll(month, year) {
  let thisMonthTop = document.querySelector(
    `.${getMonthName(month)}-row1-${year}`
  ).offsetTop;

  let scrollTween = newPosition => {
    return function() {
      var i = interpolateNumber(this.scrollTop, newPosition);
      let that = this;
      return function(t) {
        that.scrollTop = i(t);
      };
    };
  };

  // document.querySelector(".table-body").scrollTop = thisMonthTop;
  d3.select(".table-body")
    .transition()
    .duration(500)
    .tween("scrollToMonth", scrollTween(thisMonthTop));
}
