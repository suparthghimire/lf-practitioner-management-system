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
  currPage: number,
  limit: number,
  totalData: number
) {
  const totalPages = Math.ceil(totalData / limit);
  const prevPageNo = currPage > 1 ? currPage - 1 : null;
  const nextPageNo = currPage < totalPages ? currPage + 1 : null;
  return {
    prevPageNo,
    nextPageNo,
    totalPages,
  };
}
