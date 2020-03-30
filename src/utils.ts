import moment from "moment";

export function parseDatetime(time: string): number {
  return moment.utc(time, "M/D/YYYY h:m:ss").unix();
}
