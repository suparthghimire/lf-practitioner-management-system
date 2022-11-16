// Takes time in either sec, min, hr ot day and converts it to seconds
export function ConvertTimeToSec(time: number, unit: "s" | "m" | "h" | "d") {
  switch (unit) {
    case "s":
      return time;
    case "m":
      return time * 60;
    case "h":
      return time * 60 * 60;
    case "d":
      return time * 60 * 60 * 24;
  }
}
// Returns previous page, next page and total pages
export function GetPagination(
  totalData: number,
  limit: number,
  offset: number
) {
  let nextPage;
  let prevPage;
  // if total data 0, then there is no next or previous page
  if (totalData === 0) {
    nextPage = null;
    prevPage = null;
  } else {
    // next page is offset + limit if total data is greater than offset + limit
    nextPage = totalData > offset + limit ? offset + limit : null;
    // previous page is offset - limit if offset - limit is greater than 0
    prevPage = offset - limit >= 0 ? offset - limit : null;
  }

  // return previous page, next page
  return { nextPage, prevPage };
}
