import * as d3 from "d3-selection";
import { transition, duration } from "d3-transition";
import { interpolateNumber } from "d3-interpolate";

export function interpolateHzScroll(selector) {
  let thisMonth = document.querySelector(selector);
  let thisMonthTop;
  if (thisMonth) thisMonthTop = thisMonth.offsetLeft;

  let scrollTween = newPosition => {
    return function() {
      var i = interpolateNumber(this.scrollLeft, newPosition);
      let that = this;
      return function(t) {
        that.scrollLeft = i(t);
      };
    };
  };

  // document.querySelector(".table-body").scrollTop = thisMonthTop;
  d3.select(".table-body")
    .transition()
    .duration(300)
    .tween("scrollToMonth", scrollTween(thisMonthTop));
}
