import moment from "moment";

export function parseDatetime(time: string): string {
  return moment(time, "M/D/YYYY h:m:ss").format("x");
}
