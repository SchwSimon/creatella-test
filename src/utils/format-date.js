
/**
 * format a date string to a representation of the elapsed time
 * @param {String} date date string
 * @return {String} elapsed time
 */
export function dateToElapsedTime(date) {
  const dateObj = new Date(date);
  let elapsedTime = (Date.now() - dateObj.getTime()) / 1000;

  if (elapsedTime < 604800) { // less than 7 days
    let elapsedString;
    if (elapsedTime < 86400) {  // less than 24 hours
      elapsedTime = Math.floor(elapsedTime / 3600);
      elapsedString = (elapsedTime < 2) ? 'hour' : 'hours';
    } else {
      elapsedTime = Math.floor(elapsedTime / 86400);
      elapsedString = (elapsedTime < 2) ? 'day' : 'days';
    }

      // X hour(s)/day(s) ago
    return elapsedTime + ' ' + elapsedString + ' ago';
  }

    // return full date (dd.mm.yyyy) if elapsed time is >= 7 days
  return ('0' + dateObj.getDate()).slice(-2) + '.' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '.' + dateObj.getFullYear();
}
