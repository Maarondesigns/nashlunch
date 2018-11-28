export function getDays(month, year) {
  function leapYear(year) {
    if (year % 4 === 0)
      // basic rule
      return true; // is leap year // else not needed when statement is "return"
    /* else */ return false; // is not leap year
  }
  // create array to hold number of days in each month
  var ar = new Array(12);
  ar[0] = 31; // January
  ar[1] = leapYear(year) ? 29 : 28; // February
  ar[2] = 31; // March
  ar[3] = 30; // April
  ar[4] = 31; // May
  ar[5] = 30; // June
  ar[6] = 31; // July
  ar[7] = 31; // August
  ar[8] = 30; // September
  ar[9] = 31; // October
  ar[10] = 30; // November
  ar[11] = 31; // December

  // return number of days in the specified month (parameter)
  return ar[month];
}
