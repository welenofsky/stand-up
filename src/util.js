export function leftPad (str, size, padStr = ' ') {
  if (typeof str !== 'string') {
    str = str.toString();
  }
  if (typeof padStr !== 'string') {
    padStr = padStr.toString();
  }

  const diff = size - str.length;
  if (diff && padStr.length > 0) {
    return `${padStr.repeat(Math.max(0, Math.ceil(diff / padStr.length)))}${str}`
  }
  return str;
}

export function getTimeString(date) {
  return `${date.getHours()}:${leftPad(date.getMinutes(), 2, 0)}:${leftPad(date.getSeconds(), 2, 0)}`;
}