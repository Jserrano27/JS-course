//////////////////////////////////////////////////////////////
//                                                          //
//                      THE BUDGET APP                      //
//                                                          //
//////////////////////////////////////////////////////////////


// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, desc, value) {
            var ID, newItem;
            // [1, 3, 6, 8] = nextID 9
            // LastID + 1
            // LastID = array[array.length - 1].id

            // Create new ID for the item
            if (data.allItems[type].length === 0) {
                ID = 0;
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            // Create new expense or income
            if (type === 'inc') {
                newItem = new Income(ID, desc, value)
            } else if (type === 'exp') {
                newItem = new Expense(ID, desc, value)
            }

            // Add the item to the data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var array;
            // id = 5
            // [1 4 5 7]
            // [0 1 2 3]
            // index = 2

            array = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = array.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function (type) {
            var total = 0;
            data.allItems[type].forEach(function (current) {
                total += current.value;
            });
            data.totals[type] = total;

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = (data.totals.exp / data.totals.inc) * 100;
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (current) {
                return current.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage,
            }
        },

        // Uncomment for testing
        /**
        testing: function () {
          console.log(data);
        }
        **/

    }

})();




// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        expenseList: '.expenses__list',
        incomeList: '.income__list',
        totalLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensePercentage: '.item__percentage',
        percentageLabel: '.budget__expenses--percentage',
        containerList: '.container',
        dateLabel: '.budget__title--month',
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var formatNumber = function (number, type) {
        var num, int, dec;
        // input -> output
        // 1000    ->  1,000.00
        // 24.3482 ->     24.35
        // 22412.1 -> 22,412.10

        num = Math.abs(number);

        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        dec = numSplit[1];

        if (int.length > 3 && int.length < 7) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3); // 44,500 -> 44,4500
        } else if (int.length >= 7) {
            int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, 3) +
                ',' + int.substr(int.length - 3); // 5600700 -> 5,600,700
        }

        if (type === 'none') {
            return int + '.' + dec;
        } else {
            return (type === 'inc' ? '+' : '-') + ' ' + int + '.' + dec;
        }
    };

    return {
        getInputData: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        getDomStrings: function () {
            return DOMstrings;
        },

        addNewItem: function (obj, type) {
            var html, newHtml;

            // Create the HTML
            if (type === 'inc') {
                element = DOMstrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            // Replace placeholders
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (ID) {
            var el = document.getElementById(ID);

            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });

            fieldsArr[0].focus();
        },

        showBudget: function (obj) {
            var type;
            if (obj.budget === 0) {
                type = 'none'
            } else if (obj.budget > 0) {
                type = 'inc'
            } else {
                type = 'exp';
            }

            document.querySelector(DOMstrings.totalLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = Math.round(obj.percentage) + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        showDate: function () {
            var now, year, months, i;

            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            i = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[i] + ', ' + year;
        },

        changeBorderColor: function () {

            var list = document.querySelectorAll(DOMstrings.inputType + ', ' +
                DOMstrings.inputDescription + ', ' +
                DOMstrings.inputValue);

            nodeListForEach(list, function (current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },

        showPercentages: function (percentages) {
            var percList = document.querySelectorAll(DOMstrings.expensePercentage);

            nodeListForEach(percList, function (current, index) {

                if (percentages[index] >= 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        }
    };
})();




// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.containerList).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeBorderColor);
    };

    var updateBudget = function () {

        // Calculate totals incomes and expenses
        budgetCtrl.calculateBudget('inc');
        budgetCtrl.calculateBudget('exp');

        // Return the budget
        budget = budgetCtrl.getBudget();

        // Add the budget to the UI
        UICtrl.showBudget(budget);
    };

    var updatePercentages = function () {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Return the percentages
        percentages = budgetCtrl.getPercentages();

        // 3. Update de UI with the percentages
        UICtrl.showPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInputData();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addNewItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and display total budget
            updateBudget();

            // 6. Calculate and update the list percentages
            updatePercentages();
        }
    }

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, id;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // 1. Delete item from the data structure
            budgetCtrl.deleteItem(type, id);

            // 2. Delete item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and display budget
            updateBudget();

            // 4. Calculate and update the list percentages
            updatePercentages();
        }


    }

    return {
        init: function () {
            UICtrl.showDate();
            UICtrl.showBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1,
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();