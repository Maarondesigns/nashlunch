import { getMonthName } from "./getMonthName";
import { getDayName } from "./getDayName";

export function formatDatePretty(string) {
  let dateObj = new Date(string);
  let year = dateObj.getFullYear();
  let month = getMonthName(dateObj.getMonth());
  let date = dateObj.getDate();
  let day = getDayName(dateObj.getDay());

  return `${day}, ${month} ${date}, ${year}`;
}
