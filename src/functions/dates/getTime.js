export function getTime() {
  // initialize time-related variables with current time settings
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  now = null;
  var ampm = "";

  // validate hour values and set value of ampm
  if (hour >= 12) {
    hour -= 12;
    ampm = "PM";
  } else ampm = "AM";
  hour = hour == 0 ? 12 : hour;

  // add zero digit to a one digit minute
  if (minute < 10) minute = "0" + minute; // do not parse this number!

  // return time string
  return hour + ":" + minute + " " + ampm;
}
