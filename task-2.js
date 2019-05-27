/**
 * @param {string} cardNumber
 * @returns {string}
 */
function formatCardNumber(cardNumber) {
  return `${cardNumber.slice(0, 4)} ${('*'.repeat(4) + ' ').repeat(2)}${cardNumber.slice(-4)}`;
}

/**
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0');
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * @param {string} amount
 */
function formatAmount(amount) {
  return amount.toString().replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * @param {object[]} rawData
 * @returns {string}
 */
function formatUsersPaymentsData(rawData) {
  if (!rawData) {
    return '';
  }

  const allFormattedData = [];

  for (const userPaymentData of rawData) {
    const { name, cardNumber, date, amount, currency } = userPaymentData;

    let formattedUserPaymentData = '';
    formattedUserPaymentData += `Имя покупателя: ${name}\n`;
    formattedUserPaymentData += `Номер карты: ${formatCardNumber(cardNumber)}\n`;
    formattedUserPaymentData += `Дата и время операции: ${formatDate(new Date(date))}\n`;
    formattedUserPaymentData += `Сумма операции: ${currency}${formatAmount(amount)}`;

    allFormattedData.push(formattedUserPaymentData);
  }

  return allFormattedData.join('\n\n');
}

const testData = [
  {
    name: 'Ashlynn Hartmann',
    cardNumber: '4929289137092267',
    date: '2019-01-24T17:39:07.347Z',
    amount: '579.63',
    currency: '$'
  },
  {
    name: 'Philip Stoltenberg',
    cardNumber: '4916258329158678',
    date: '2018-09-07T02:21:03.144Z',
    amount: '10472.99',
    currency: '$'
  }
];

console.log(formatUsersPaymentsData(testData));
