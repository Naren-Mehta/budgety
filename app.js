
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

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, description, value) {
            var newItem,ID;

            ID=0;

            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, value);
            }

            data.allItems[type].push(newItem);

        }
    }


})();


//UI controller
var UIController = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }

    return {
        getInput: function () {
            console.log("Inside Get Input...")
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function () {
            return DOMStrings;
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

    var ctrlAddItem = function () {
        console.log("It Works");

        //1. Get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        //2. Add the item to the budget controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display the budget to the UI

    }

    return {
        init: function () {
            console.log('Application has started');
            setUpEventListener();
        }
    }

})(budgetController, UIController);

appController.init();