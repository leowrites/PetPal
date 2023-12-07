export const convertDateFormat = (inputDateStr) => {
  // Parse the input date string as a Date object with the "YYYY-MM-DD" format
  const parts = inputDateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected 'YYYY-MM-DD'");
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Create a Date object
  const inputDate = new Date(year, month - 1, day);

  // Extract day, month, and year components
  const dd = String(inputDate.getDate()).padStart(2, "0");
  const mm = String(inputDate.getMonth() + 1).padStart(2, "0");
  const yyyy = String(inputDate.getFullYear());

  // Format the date as "DD-MM-YYYY"
  return `${dd}-${mm}-${yyyy}`;
}
