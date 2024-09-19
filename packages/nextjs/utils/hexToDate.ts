const hexToDate = (hex: string) => {
  const timeInSeconds = parseInt(hex, 16);
  // convert to milliseconds
  const timeInMilliseconds = timeInSeconds * 1000;
  const date = new Date(timeInMilliseconds);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString(undefined, dateOptions);
  const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

  return `${formattedDate}, ${formattedTime}`;
};

export default hexToDate;
