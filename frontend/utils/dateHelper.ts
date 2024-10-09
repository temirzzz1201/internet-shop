function formatDate(dateString: string): string {
  const inputDate = new Date(dateString);
  const currentDate = new Date();
  const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

  const diffTime = currentDate.getTime() - inputDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const timeFormatted = inputDate.toLocaleTimeString('ru-RU', timeOptions);

  if (diffDays === 0) {
    return `Сегодня, ${timeFormatted}`;
  } else if (diffDays === 1) {
    return `Вчера, ${timeFormatted}`;
  } else if (diffDays < 7) {
    return `${diffDays} ${getDayLabel(diffDays)} назад, ${timeFormatted}`;
  } else {
    return inputDate.toLocaleDateString('ru-RU', dateOptions) + `, ${timeFormatted}`;
  }
}

function getDayLabel(days: number): string {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  
  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return "дней";
  }

  if (lastDigit === 1) {
    return "день";
  } else if (lastDigit > 1 && lastDigit < 5) {
    return "дня";
  } else {
    return "дней";
  }
}


export default formatDate