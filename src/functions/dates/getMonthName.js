export function getMonthName(month) {
  // create array to hold name of each month
  var ar = new Array(12);
  ar[0] = "January";
  ar[1] = "February";
  ar[2] = "March";
  ar[3] = "April";
  ar[4] = "May";
  ar[5] = "June";
  ar[6] = "July";
  ar[7] = "August";
  ar[8] = "September";
  ar[9] = "October";
  ar[10] = "November";
  ar[11] = "December";

  // return name of specified month (parameter)
  return ar[month];
}
