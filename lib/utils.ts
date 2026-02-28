export function formatDateTime(dateInput: Date | string) {
  const date = new Date(dateInput);

  const weekday = date.toLocaleDateString("en-GB", {
    weekday: "short",
  });

  const day = date.getDate();
  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  const year = date.getFullYear();

  const formattedTime = date
    .toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${weekday} ${day} ${month} ${year}, ${formattedTime}`;
}
