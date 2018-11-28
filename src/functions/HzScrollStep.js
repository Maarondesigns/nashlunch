import * as d3 from "d3-selection";
import { transition, duration } from "d3-transition";
import { interpolateNumber } from "d3-interpolate";

export function HzScrollStep(resolve, target, scroll, step) {
  let newScroll = scroll;
  while (newScroll % step !== 0) {
    newScroll++;
  }

  let elem = document.querySelector(
      `.weekdays[data-scroll="${newScroll + step * 2}"]`
    ),
    cList,
    week,
    month,
    year;

  if (elem) {
    cList = elem.classList;
    week = +cList[0].split("-")[1];
    month = cList[2];
    year = +elem.getAttribute("data-date").split("-")[0];
  }

  let scrollTween = newPosition => {
    return function() {
      var i = interpolateNumber(this.scrollLeft, newPosition);
      let that = this;
      return function(t) {
        that.scrollLeft = i(t);
      };
    };
  };

  d3.select(target)
    .transition()
    .duration(150)
    .tween("scrollToMonth", scrollTween(newScroll));

  resolve({ week, month, year });
}
