import { getMonthName } from "./getMonthName";

export function formatDatePrettyShort(string) {
  if (string === undefined) return;

  let dateObj = new Date(string);
  let year = dateObj.getFullYear();
  let month = getMonthName(dateObj.getMonth()).substring(0, 3);
  let date = dateObj.getDate();

  return `${month} ${date}, ${year}`;
}
