'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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

const currencies = new Map([
    ['USD', 'United States dollar'],
    ['EUR', 'Euro'],
    ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = '';
    const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
    console.log(movs);
    movs.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';
        const html = `
        <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
            i + 1
        } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calDisplayBalance = acc => {
    acc.balance = acc.movements.reduce(
        (accumulator, current) => accumulator + current,
        0
    );
    labelBalance.textContent = `${acc.balance} €`;
};

const updateUI = function (acc) {
    //Display Movements
    displayMovements(acc.movements);
    //Display Balance
    calDisplayBalance(acc);
    //Display Summary
    calcDisplaySummary(acc);
};

const createUsenames = accs => {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};
createUsenames(accounts);

const calcDisplaySummary = function (acc) {
    const totalIn = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, curr) => acc + curr);
    labelSumIn.textContent = `${totalIn}€`;

    const totalOut = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, curr) => acc + curr);
    labelSumOut.textContent = `${Math.abs(totalOut)}€`;

    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(int => (int * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int);
    labelSumInterest.textContent = `${interest}€`;
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
    //prevent form from submitting
    e.preventDefault();
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        console.log('Login');
        //Display message and UI
        labelWelcome.textContent = `Welcome Back, ${
            currentAccount.owner.split(' ')[0]
        }`;
        containerApp.style.opacity = 100;

        //Update UI
        updateUI(currentAccount);
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
    }
});

btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();
    const recieverAccount = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    const amountTransfer = Number(inputTransferAmount.value);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();

    if (
        amountTransfer > 0 &&
        recieverAccount &&
        amountTransfer <= currentAccount.balance &&
        recieverAccount !== currentAccount
    ) {
        //Doint the Transfer
        currentAccount.movements.push(-amountTransfer);
        recieverAccount.movements.push(amountTransfer);

        console.log('Transfer successful');
        //Update UI
        updateUI(currentAccount);
    }
});

btnLoan.addEventListener('click', function (e) {
    e.preventDefault();
    const amount = Number(inputLoanAmount.value);
    if (
        amount > 0 &&
        currentAccount.movements.some(mov => mov >= amount * 0.1)
    ) {
        currentAccount.movements.push(amount);

        //Update UI
        updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );

        //Delete the account
        accounts.splice(index, 1);

        //Reset to login
        labelWelcome.textContent = 'Log in to get started';
        containerApp.style.opacity = 0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// const Sid = {
//   friends: ['A', 'B', 'C'],
//   firstName: 'Siddharth',
//   driverLicense: false,
//   birthyear: 1997,
//   calAge: function () {
//     this.age = 2020 - this.birthyear;
//     return this.age;
//   },
//   getSummary: function () {
//     console.log(
//       `${this.firstName} is a ${this.calAge()} years old, and he has ${
//         this.driverLicense ? 'a' : 'no'
//       } driver license.`
//     );
//   },
// };
// Sid.getSummary();
