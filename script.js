const billingSheetNamesElement = document.querySelector('.billing-sheet-names');
const billingSheetAmountsElement = document.querySelector('.billing-sheet-amounts'); 
const operaNamesElement = document.querySelector('.opera-names');
const operaAmountsElement = document.querySelector('.opera-amounts');

const billingSheetNamesInputArea = billingSheetNamesElement.querySelector('.input-field');
const billingSheetAmountsInputArea = billingSheetAmountsElement.querySelector('.input-field');
const operaNamesInputArea = operaNamesElement.querySelector('.input-field');
const operaAmountsInputArea = operaAmountsElement.querySelector('.input-field');

const outputElement = document.querySelector('.output');
const outputTextElement = outputElement.querySelector('p');

const button = document.querySelector('.lets-go');
const closeMatchesFilterButton = document.querySelector('.close-matches-filter');
const precisionLevelSettingInputElement = document.querySelector('.precision-level-setting');

const NUMBER_PRECISION = 2;

const MOCK_DATE = {
    billingSheetNames: 'John Smith \nJohn Statmos \nElena Libba \nElenalibba',
    billingSheetAmounts: '300 \n400.00 \n1000 \n1000',
    operaNames : 'Libba Elena \nJohn Stamos \nJohn Smith \nelenalibba',
    operaAmounts: '1000 \n400 \n300.00 \n1000'
}

const createMockData = () => {
    billingSheetNamesInputArea.value = MOCK_DATE.billingSheetNames;
    billingSheetAmountsInputArea.value = MOCK_DATE.billingSheetAmounts;
    operaNamesInputArea.value = MOCK_DATE.operaNames;
    operaAmountsInputArea.value = MOCK_DATE.operaAmounts
};

const showErrorMessage = (message) => {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    outputElement.appendChild(messageElement);
    // outputTextElement.textContent = outputTextElement.textContent + message;
};

const removeWhiteSpaces = (someString) => {
    let result = '';
    for (let i = 0; i < someString.length; i++) {
        if (someString[i] !== ' ') {
            result += someString[i];
        }
    }
    return result;
};

const separateInputIntoArray = (inputEntries) => {
    let entry = '';
    let result = [];
    for (let i = 0; i < inputEntries.length; i++) {
        if (inputEntries[i] !== '\n') {
            entry += inputEntries[i];
        }
        else {
            result.push(entry);
            entry = '';
        }
    }
    result.push(entry);
    return result;
};

const checkForErrors = (names, amounts, errorArea) => {
    if ((names.length === 1 && names[0] === '') || (amounts.length === 1 && amounts[0] === '')) {
        showErrorMessage('At least one of the entries is empty!');
        return true;
    }
    if (names.length !== amounts.length) {
        showErrorMessage(
            `Entries do not match! ${names.length} entries found at ${errorArea} Names, while ${amounts.length} found at ${errorArea} Amounts`
            );
            return true;
    }
    else {
        return false;
    }
};

const clearOutputArea = () => {
    outputElement.textContent = '';
};

const createEntries = (names, amounts) => {
    const entries = [];
    for (let i = 0; i < names.length; i++) {
        const entry = {
            name: removeWhiteSpaces(names[i].toLowerCase()),
            amount: Number(amounts[i]).toFixed(NUMBER_PRECISION),
        };
        entries.push(entry);
    }
    return entries;
};

const createBillingSheetEntries = () => {
    const namesFromBillingSheet = billingSheetNamesInputArea.value;
    const amountsFromBillingSheet = billingSheetAmountsInputArea.value;
    const names = separateInputIntoArray(namesFromBillingSheet);
    const amounts = separateInputIntoArray(amountsFromBillingSheet);
    let isError = false;
    isError = checkForErrors(names, amounts, 'Billing Sheet');
    if (isError === false) {
        const entries = createEntries(names, amounts);
        return entries;
    };
};

const createOperaEntries = () => {
    const namesFromOpera = operaNamesInputArea.value;
    const amountsFromOpera = operaAmountsInputArea.value;
    const names = separateInputIntoArray(namesFromOpera);
    const amounts = separateInputIntoArray(amountsFromOpera);
    let isError = false;
    isError = checkForErrors(names, amounts, 'Opera');
    if (isError === false) {
        const entries = createEntries(names, amounts);
        return entries;
    };
};

const checkIfAnagrams = (nameOne, nameTwo) => {
    const nameOneIntoArray = Array.from(nameOne);
    const nameTwoIntoArray = Array.from(nameTwo);
    for (let i = 0; i < nameOneIntoArray.length; i++) {
        for (let t = 0; t < nameTwoIntoArray.length; t++) {
            if (nameOneIntoArray[i] === nameTwoIntoArray[t]) {
                nameOneIntoArray.splice(i,1);
                nameTwoIntoArray.splice(t,1);
                i--;
                t--;
            }
        }
    }
    if (nameOneIntoArray.length === 0 && nameTwoIntoArray.length === 0) {
        return true;
    }
};

const eliminateAnagrams = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        for (let t = 0; t < listTwo.length; t++) {
            if (checkIfAnagrams(listOne[i].name, listTwo[t].name)) {
                if (listOne[i].amount === listTwo[t].amount) {
                    listOne.splice(i, 1);
                    listTwo.splice(t,1);
                }
            }
            
        }
    }
};

const eliminateExactMatches = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        for (let t = 0; t < listTwo.length; t++) {
            if (listOne[i].name === listTwo[t].name) {
                if (listOne[i].amount === listTwo[t].amount) {
                    listOne.splice(i, 1);
                    listTwo.splice(t,1);
                }
            }
            
        }
    }
};

const showExactMatchesWithDifferentAmounts = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        for (let t = 0; t < listTwo.length; t++) {
            if (listOne[i].name === listTwo[t].name) {
                if (listOne[i].amount !== listTwo[t].amount) {
                    showErrorMessage(`${listOne[i].name} has rate of ${listOne[i].amount} on Billing Sheet, while ${listTwo[t].name} has amount of ${listTwo[t].amount} on Opera`)
                    console.log(`${listOne[i].name} has rate of ${listOne[i].amount} on Billing Sheet, while ${listTwo[t].name} has amount of ${listTwo[t].amount} on Opera`)
                }
            }
            
        }
    }
};

const showAnagramsWithDifferentAmounts = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        for (let t = 0; t < listTwo.length; t++) {
            if (checkIfAnagrams(listOne[i].name, listTwo[t].name)) {
                if (listOne[i].amount !== listTwo[t].amount) {
                    showErrorMessage(`${listOne[i].name} has rate of ${listOne[i].amount} on Billing Sheet, while ${listTwo[t].name} has amount of ${listTwo[t].amount} on Opera`)
                    console.log(`${listOne[i].name} has rate of ${listOne[i].amount} on Billing Sheet, while ${listTwo[t].name} has amount of ${listTwo[t].amount} on Opera`)
                }
            }
            
        }
    }
};

const checkForCloseMatch = (nameOne, nameTwo, precisionLevel) => {
    const nameOneIntoArray = Array.from(nameOne);
    const nameTwoIntoArray = Array.from(nameTwo);
    for (let i = 0; i < nameOneIntoArray.length; i++) {
        for (let t = 0; t < nameTwoIntoArray.length; t++) {
            if (nameOneIntoArray[i] === nameTwoIntoArray[t]) {
                nameOneIntoArray.splice(i,1);
                nameTwoIntoArray.splice(t,1);
                i--;
                t--;
            }
        }
    }
    console.log(nameOneIntoArray, nameTwoIntoArray);
    console.log((nameOneIntoArray.length + nameTwoIntoArray.length));
    if ((nameOneIntoArray.length + nameTwoIntoArray.length) <= Number(precisionLevel)){
        return true;
    }
};

const eliminateCloseMatches = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        for (let t = 0; t < listTwo.length; t++) {
            if (checkForCloseMatch(listOne[i].name, listTwo[t].name, precisionLevelSettingInputElement.value)) {
                if (listOne[i].amount === listTwo[t].amount) {
                    listOne.splice(i, 1);
                    listTwo.splice(t,1);
                }
            }
            
        }
    }
};

const showExtraEntries = (listOne, listTwo) => {
    for (let i = 0; i < listOne.length; i++) {
        showErrorMessage(`Extra entry from Billing Sheet: ${listOne[i].name} with amount of ${listOne[i].amount}`);
    };
    for (let i = 0; i < listTwo.length; i++) {
        showErrorMessage(`Extra entry from Opera: ${listTwo[i].name} with amount of ${listTwo[i].amount}`);
    }
};

const compareEntries = (billingSheetEntries, operaEntries) => {
    eliminateExactMatches(billingSheetEntries, operaEntries);
    eliminateAnagrams(billingSheetEntries, operaEntries);
    showExactMatchesWithDifferentAmounts(billingSheetEntries, operaEntries);
    showAnagramsWithDifferentAmounts(billingSheetEntries, operaEntries);
    if (closeMatchesFilterButton.checked) {
        eliminateCloseMatches(billingSheetEntries, operaEntries, precisionLevelSettingInputElement.value);
    }
    showExtraEntries(billingSheetEntries, operaEntries);
    console.log(billingSheetEntries);
    console.log(operaEntries);
    for (let i = 0; i < billingSheetEntries.length; i++) {
        console.log(billingSheetEntries[i].name);
    };
    for (let i = 0; i < operaEntries.length; i++) {
        console.log(operaEntries[i].name)
    }
};

button.addEventListener('click', () => {
    clearOutputArea();
    const billingSheetEntries = createBillingSheetEntries();
    const operaEntries = createOperaEntries();

    compareEntries(billingSheetEntries, operaEntries);
});

createMockData();
// checkForCloseMatch('elene', 'anna', precisionLevelSettingInputElement.value);
// checkIfAnagrams(['e', 'l', 'e', 'n'], ['e', 'l', 'e', 'n']);

// const compareTwoArrays = (arrayOne, arrayTwo) => {
//     for (let i= 0; i < arrayOne.length; i++) {
//         for (let t = 0; t < arrayTwo.length; t++) {
//             if (arrayOne[i] === arrayTwo[t]) {
//                 arrayOne.splice(i,1);
//                 arrayTwo.splice(t,1);
//                 i--;
//                 t--;
//             }
//         }
//     }
//     if (arrayOne.length === 0 && arrayTwo.length === 0) {
//         console.log('full anagrams!');
//     }
//     else {
//         console.log(arrayOne, arrayTwo)
//     }
// };

// const one = ['e', 'l', 'e', 'n'];
// const two = ['e', 'l', 'e', 'n'];

// compareTwoArrays(one, two);