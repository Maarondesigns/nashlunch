export function formatDate(target) {
  let split = target.split("-");
  if (split[1].length === 1) {
    split[1] = "0" + split[1];
  }
  if (split[2].length === 1) {
    split[2] = "0" + split[2];
  }
  //6PM GMT (zulu time) = 12pm
  return split.join("-") + "T18:00:00Z";
}
