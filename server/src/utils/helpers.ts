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

export function GetPagination(
  totalData: number,
  limit: number,
  offset: number
) {
  let nextPage;
  let prevPage;

  if (totalData === 0) {
    nextPage = null;
    prevPage = null;
  } else {
    nextPage = totalData > offset + limit ? offset + limit : null;
    prevPage = offset - limit >= 0 ? offset - limit : null;
  }

  return { nextPage, prevPage };
}
