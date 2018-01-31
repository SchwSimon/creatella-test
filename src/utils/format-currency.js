
/**
 * format a numberic currency value to a decimal string representation
 * @param {Number} cents currency in cents (must be integer)
 * @param {String} exceptionString to return on invalid currency argument
 * @return {String} formatted currency
 */
export function currencyToString(cents, exceptionString = ' / ') {
    // cast to string
  cents = cents + '';

    // only integer values will be formatted
  if (!/^\d+$/.test(cents))
    return exceptionString;

  return (cents.slice(0, -2) || '0') + '.' + ('0' + cents).slice(-2);
}
