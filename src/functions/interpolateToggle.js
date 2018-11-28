import * as d3 from "d3-selection";
import { transition, duration } from "d3-transition";
import { interpolateString } from "d3-interpolate";

export function interpolateToggle(selector) {
  let elem = document.querySelector(selector);
  if (elem.classList.contains("showing")) {
    setTimeout(() => {
      elem.classList.remove("showing");
    }, 450);
  } else {
    elem.classList.add("showing");
  }
  let currentHeight = elem.getBoundingClientRect().height;
  let fullHeight = 0;

  elem.childNodes.forEach(x => {
    fullHeight += x.getBoundingClientRect().height;
  });

  if (Math.round(currentHeight) === 1) {
    d3.select(selector)
      .transition()
      .duration(400)
      .styleTween("height", () => {
        return interpolateString(currentHeight + "px", fullHeight + "px");
      });
  } else {
    d3.select(selector)
      .transition()
      .duration(400)
      .styleTween("height", () => {
        return interpolateString(currentHeight + "px", "1px");
      });
  }
}
