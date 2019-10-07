
//Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (currentElement) {
            sum = sum + currentElement.value;
        });

        data.total[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        persentage: -1
    }

    return {
        addItem: function (type, des, value) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            console.log('ID==' + ID);

            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function () {

            //calculate the expenses and income
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            //calculate the persentage of income that we spent

            if (data.total.inc > 0) {
                data.persentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.persentage = -1;
            }

        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                persentage: data.persentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }


})();


//UI controller
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expensesLabel:'.budget__expenses--value',
        persentageLabel :'.budget__expenses--percentage'
    }

    return {
        getInput: function () {
            console.log("Inside Get Input...")
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDOMStrings: function () {
            return DOMStrings;
        },

        addListItems: function (obj, type) {

            //Create  HTML string with placeholder text
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div>'
                    + ' <div class="right clearfix"> <div class="item__value">%value%</div><div class="item__delete">' +
                    ' <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div> ';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = ' <div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>' +
                    '<div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div>' +
                    ' <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }


            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value);


            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            // Replace the placeholder text with actual value



            //Insert into HTML into the DOM

        },
        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if(obj.persentage>0){
                document.querySelector(DOMStrings.persentageLabel).textContent = obj.persentage +'%';
            }else{
                document.querySelector(DOMStrings.persentageLabel).textContent = '---';
            }

        }
    }


})();


//Global App controller
var appController = (function (budgetCtrl, UICtrl) {


    var setUpEventListener = function () {
        var DOM = UIController.getDOMStrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) { // event.which for older browser
                console.log("Enter was pressed");
                ctrlAddItem();
            }
        })
    }

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return the budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        //3. Display the budget to the UI

        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function () {
        console.log("It Works");

        var input, newItem;

        //1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            budgetCtrl.testing();

            //3. Add the item to the UI
            UICtrl.addListItems(newItem, input.type);

            //4. Clear the field
            UICtrl.clearFields();

            updateBudget();
        }




    }

    return {
        init: function () {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                persentage: 0
            });
            setUpEventListener();
        }
    }

})(budgetController, UIController);

appController.init();