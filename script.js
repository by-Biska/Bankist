'use strict';


'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-02-28T17:01:17.194Z',
    '2022-03-03T23:36:17.929Z',
    '2022-03-04T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

function formatCur(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    // console.log(acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;
const locale = navigator.language;
const now = new Date();

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting with API calls
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'long',
// };
// console.log(locale);

// const now = new Date();
// const day = `${now.getDay()}`.padStart(2, 0);
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const min = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

// dd/mm//year

const startLogoutTimer = function () {
  let time = 60 * 5;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print thr remaining timr to UI
    // labelTimer.textContent = Intl.DateTimeFormat(locale, {minute: 'numeric', second: 'numeric',}).format(now)
    labelTimer.textContent = `${min} : ${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    --time;
  }

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Prin date

    labelDate.textContent = new Intl.DateTimeFormat(locale).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if(timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer()
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.round(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer()
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  
  // Reset timer
  clearInterval(timer);
  timer = startLogoutTimer()
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
console.log(23 === 23.0);
console.log(0.1 + 0.2);

console.log(+'23');

// parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

console.log(Number.parseInt('   2.5rem'));
console.log(Number.parseFloat('   2.5rem'));

console.log(Number.isNaN('2.5rem'));
console.log(Number.isNaN(23 / 0))


console.log(Number.isFinite(23))
console.log(Number.isFinite('23'))

console.log(Number.isInteger(23))
console.log(Number.isInteger(23.0))
console.log(Number.isInteger('23'))
console.log(Number.isInteger(23 / 0))
*/

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(25 ** (1 / 3));

// console.log(Math.max(2, 5, 6, 7, 7, 3456, 4));
// console.log(Math.max(2, 5, 6, '7', 7, 3456, 4));
// console.log(Math.max(2, 5, 6, '7px', 7, 3456, 4));

// console.log(Math.min(2, 5, 6, 7, 7, 3456, 4));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min)
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));
// console.log(randomInt(2, 5));

// console.log(Math.trunc(23.3));

// console.log(Math.round(23.3));
// console.log(Math.round(23.9));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.9));

// console.log(Math.floor(23.3));
// console.log(Math.floor(23.9));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.9));

// console.log((2.7).toFixed(0));
// console.log((2.4).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log((2.745).toFixed(2));
// console.log(+(2.745).toFixed(2));

/*
console.log(5 % 2);
console.log(5 / 2);

console.log(8 % 3);
console.log(8 / 3);

console.log(6 % 2);
console.log(6 / 2);

const isEven = n => n % 2 === 0;

console.log(isEven(34));
console.log(isEven(34521525425));
console.log(isEven(6246));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    if (i % 3 === 0) row.style.backgroundColor = 'purple';
  });
});


console.log(...document.querySelectorAll('.movements__row'));
*/

/*
const d = 287_460_000_000
console.log(d);

const price = 345_99
console.log(price);

const transferFee1 = 15_00
const transferFee2 = 1_500

const PI = 3.24_15
console.log(PI);

console.log(Number('230_000'));
console.log(parseInt('230_000'));
*/
/*
console.log(2** 53-1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(28394750293745092345021n);
console.log(29038457203984572980374589275809237589023759823750928355720398557239807520987290875928375398080738092758927305982734895273489572398457n);
console.log(BigInt(29038457203984572980374589275809237589023759823750928355720398557239807520987290875928375398080738092758927305982734895273489572398457));

console.log(10000n + 10000n);

// console.log(Math.sqrt(16n));

const huge = 12234523435435345452345n
const num = 23
console.log(huge * BigInt(num));

// Exception
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALY big!!!');

// Divisions
console.log(10n / 3n);
console.log(10 / 3);
// console.log(15.1523345n);
*/
/*
const now = new Date();
console.log(now);

console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 24, 2015'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31, 15, 23, 5));

console.log(new Date(0));
console.log(new Date(3 * 24 *60 * 1000));

const future = new Date(2037, 10, 19, 15, 23)
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth() + 1);
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142246180000));

console.log(Date.now());

future.setFullYear(2040)
console.log(future);
*/
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future);

/*
const calcDaysPassed = (date1, date2) =>
  Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))

const days1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14,10,8));
console.log(days1);
*/
/*
const num = 12313.34;

const optionsNum ={
  style: 'currency',
  // unit: 'mile-per-hour'
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false
}

console.log('US:', new Intl.NumberFormat('en-US', optionsNum).format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE', optionsNum).format(num));
console.log('Syria:', new Intl.NumberFormat('ar-SY', optionsNum).format(num));
console.log('Russia:', new Intl.NumberFormat('ru-RU', optionsNum).format(num));
console.log(locale.split('-')[1] + ':', new Intl.NumberFormat(locale, optionsNum).format(num));
*/
/*
const ings = ['olives', 'spinach']

const pizzaTimer = setTimeout(function (ing1, ing2) {
  console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`);
}, 3000 , ...ings);

if(ings.includes('spinach')) clearTimeout(pizzaTimer)


setInterval(() => {
  const now = new Date()
  let time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  console.log(time);
}, 1000);
*/


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/*
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
let currentAccount;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function dispMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, _, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
}

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

function updateUI(curAcc) {
  // Display movements
  dispMovements(curAcc.movements);

  // Display balance
  calcDisplayBalance(curAcc);

  // Display summary
  calcDisplaySummary(curAcc);
}

// Event hndler

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UpdateUI
    updateUI(currentAccount);
  }
});

// Transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount);

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    console.log(`Transfer valid`);
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    console.log(currentAccount);
    console.log(recieverAcc);

    updateUI(currentAccount);

    // Clear input fields
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferTo.blur();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  let amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();

    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('Delete');
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    console.log(accounts);

    // Clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  dispMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// SPLICE
// console.log(arr.splice(2));
// console.log(arr);
// console.log(arr.splice(1,2));
// console.log(arr);

// REVERSE
// const arr2 = ['j', 'l', 'k', 'z', 'y'];
// console.log(arr2.reverse());
// console.log(arr2);

// CONCAT
// const letters = arr.concat(arr2)
// console.log(letters);
// console.log([...arr, ...arr2]);

// JOIN
// console.log(letters.join(' - '));

// const arr = [23, 11, 64]
// console.log(arr[0]);
// console.log(arr.at(0));

// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));
// console.log(arr.at(-2));

// console.log('jonas'.at(0));
// console.log('jonas'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You depotisited ${Math.abs(movement)}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('----------------------------------------');

// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You depotisited ${Math.abs(movement)}`);
//   } else {
//     console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value
//   }: ${value}`);
// });

// Coding Challenge #1
/* const JuliaData = [3, 5, 2, 12, 7];
const KateData = [4, 1, 15, 8, 3];
const JuliaData2 = [3, 5, 2, 12, 7];
const KateData2 = [4, 1, 15, 8, 3];

function checkDogs(dogsJulia, dogsKate) {
  const JuliaDataCorrect = JuliaData.slice(1, -2);
  // console.log(JuliaDataCorrect);

  const JuliaKate = JuliaDataCorrect.concat(dogsKate);
  // console.log(JuliaKate);

  JuliaKate.forEach(function (age, i) {
    if (age >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
    } else {
      console.log(
        `Dog number ${i + 1} is still a puppy, and is ${age} years old`
      );
    }
  });
}
checkDogs(JuliaData, KateData);
console.log(`-------------------------------------------`);
checkDogs(JuliaData2, KateData2);
*/

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUsd = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd);

// const movementsUsdFor = [];
// for (const movement of movements) movementsUsdFor.push(movement * eurToUsd);
// console.log(movementsUsdFor);

// const movementsDescription = movements.map((movement, index) => {
//   return `Movement ${index + 1}: You ${
//     movement > 0 ? 'depotisited' : 'withdrew'
//   } ${Math.abs(movement)}`;
// });
// console.log(movementsDescription);

// const deposits = movements.filter(movement => movement > 0);
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const movement of movements) if (movement > 0) depositsFor.push(movement);
// console.log(depositsFor);

// const withdrawals = movements.filter(movement => movement < 0);
// console.log(withdrawals);

// console.log(movements);

// const balance = movements.reduce((acc, cur, i, arr) => {
//   console.log(`Iterarion ${++i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// let balance2 = 0;
// for (let [index, mov] of movements.entries()) {
//   console.log(`Iterarion ${++index}: ${balance2}`);
//   balance2 += mov;
// }
// console.log(balance2);

// const max = movements.reduce((acc, cur) => {
//   if (acc > cur) return acc;
//   else return cur;
// }, movements[0]);
// console.log(max);

// Coding Challenge #2
// function calcAverageHumanAge(ages) {
//   return ages
//     .map(cur => {
//       if (cur <= 2) return cur * 2;
//       else return 16 + cur * 4;
//     })
//     .filter(cur => cur >= 18)
//     .reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);
// }

// const data1 = [5, 2, 4, 1, 15, 8, 3];
// const data2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(calcAverageHumanAge(data1));
// console.log(calcAverageHumanAge(data2));

// console.log(movements);
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov < 0)
//   .map((mov, _, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, cur) => acc + cur, 0);
// console.log(totalDepositsUSD);

// console.log(movements);

// const firstWithdrawal = movements.find(mov => mov < 0)
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === "Jessica Davis")
// console.log(account);

// for(const account of accounts) {
//   if(account.owner === "Jessica Davis") console.log(account);
// }

// Equapity
// console.log(movements);
// console.log(movements.includes(-130));

// Some: Condition
// const anyDeposits = movements.some(mov => mov > 2999)
// console.log(anyDeposits);

// Every
// console.log(account4.movements.every(mov => mov > 0));

// Separeta callback
// const deposit = mov => mov > 0

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // flat
// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => (acc += mov));
// console.log(overalBalance);

// // flatMap
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => (acc += mov));
// console.log(overalBalance2);

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);

// reurn < 0, A, B
// reurn > 0, B, A
// movements.sort((a,b) => {
//   if(a > b)
//     return 1;
//   if(b > a)
//   return -1;
// })
// movements.sort((a, b) => a - b);
// console.log(movements);
// movements.sort((a, b) => b - a);
// console.log(movements);

// const x = new Array(7);
// console.log(x);

// console.log((x.map(()=>5)))

// x.fill(1)
// x.fill(1, 3, 5);
// console.log(x);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const randomNum = Array.from(
//   { length: 100 },
//   () => Math.trunc(Math.random() * 20) + 1
// );
// console.log(randomNum);

// labelBalance.addEventListener('click', function () {
//   const movementsUi = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€'))
//   );

//   const movementsUi2 = [...document.querySelectorAll('.movements__value')]
//   updateUI(currentAccount);
// });

// 1
// const bankDepositsSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositsSum);

// 2
// const numDeposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposits1000);
/*
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(numDeposits1000);

// 3
const sums = accounts
  // .flatMap(acc => acc.movements)
  .reduce((acc, cur) => {
    acc.push(cur.movements);
    return acc;
  }, [])
  .flat()
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(sums);

// 4
const convertTitleCase = function (title) {
const capitalize =str => str[0].toUpperCase() + str.slice(1)

  const exceptios = ['a', 'an', 'the', 'and', 'but', 'or', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => exceptios.includes(word) ? word : capitalize(word))
    .join(' ');
  return capitalize(titleCase)
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title, but not too long'));
console.log(convertTitleCase('and here is another title with an EXEMPLE'));
*/

/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

function recommendedPortion(weight) {
  return weight ** 0.75 * 28;
}

dogs.forEach(function (dogCur) {
  dogCur.recommendedFood = roundUp(recommendedPortion(dogCur.weight), 2);

  // 2
  // let sarahDog = dogCur.owners.includes('Sarah');
  // if (sarahDog === true) {
  //   if (dogCur.curFood > dogCur.recommendedFood * 1.1)
  //     console.log('Yor dog eating too much!');
  //   else if (dogCur.curFood < dogCur.recommendedFood * 0.9)
  //     console.log('Yor dog eating too little!');
  //   else console.log('Yor dog eating just fine!');
  // }
});

// console.log(dogs);

// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
if (sarahDog === true) {
  if (dogCur.curFood > dogCur.recommendedFood * 1.1)
    console.log('Yor dog eating too much!');
  else if (dogCur.curFood < dogCur.recommendedFood * 0.9)
    console.log('Yor dog eating too little!');
  else console.log('Yor dog eating just fine!');
}

// 3
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood * 1.1)
  .flatMap(mov => mov.owners);
const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood * 0.9)
  .flatMap(mov => mov.owners);

// 4
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// 6
const recPortionCondition = dog =>
  dog.curFood < dog.recommendedFood * 1.1 &&
  dog.curFood > dog.recommendedFood * 0.9;

console.log(
  dogs.some(
    dog =>
      dog.curFood < dog.recommendedFood * 1.1 &&
      dog.curFood > dog.recommendedFood * 0.9
  )
);

// 7
const eatOk = dogs.filter(dog => recPortionCondition(dog));
console.log(eatOk);

// 8
const dogssort = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogssort);
*/
