let pizzaArray = [];
//Pizza object factory
const pizzaFactory = (id, pizza, image, price, heat, toppings) => {
    return {
        id, pizza, image, price, heat, toppings
    }
};
// MODULE for modal
const modalModule = (() => {
    //Modal
    const modal = document.querySelector('.modal');
    const createBtn = document.querySelector('.btn_modal');
    const closeBtn = document.querySelector('.btn_modal_close')

    function showModal() {
        modal.classList.add('show');
    }

    function closeModal() {
        modal.classList.remove('show')
        formModule.clearInputs();
    }

    createBtn.addEventListener('click', showModal);
    closeBtn.addEventListener('click', closeModal);
    // export functions for other modules to use
    return {
        closeModal: closeModal
    }
})();
// MODULE for form
const formModule = (() => {
    //Form inputs and buttons
    const inpName = document.querySelector('#input_name');
    const inpPrice = document.querySelector('#input_price');
    const inpHeat = document.querySelector('#input_heat');
    const inpToppings = document.querySelector('#input_toppings');
    const toppingsBtn = document.querySelector('.btn_toppings');
    const toppingsOutput = document.querySelector('.toppings_output');
    const submitBtn = document.querySelector('#submit');
    // Invalid input error text
    const nameErr = document.querySelector('#name_error');
    const priceErr = document.querySelector('#price_error');
    const heatErr = document.querySelector('#heat_error');
    const toppingsErr = document.querySelector('#toppings_error');
    const pizzaErr = document.querySelector('#pizza_error');
    // Array to store pizza toppings
    let toppings = [];
    // Adds toppings to an array and clears input after each add
    const addToppings = () => {
        let value = inpToppings.value;
        toppings.push(value);
        if (toppings[0]) {
            toppingsOutput.textContent = toppings.join(', ') + '.'
            console.log(toppings);
        }
        inpToppings.value = '';
    }
    // Check if the input fields are empty
    function validateForm() {
        let found;
        if (inpName.value === '') {
            nameErr.classList.add('show');
        }
        else {
            nameErr.classList.remove('show');
        }
        if (+inpPrice.value < 0 || +inpPrice.value > 100) {
            priceErr.classList.add('show');
        }
        else {
            priceErr.classList.remove('show');
        }
        if (+inpHeat.value < 0 || +inpHeat.value > 3) {
            heatErr.classList.add('show');
        }
        else {
            heatErr.classList.remove('show');
        }
        if (toppings.length < 2) {
            toppingsErr.classList.add('show');
        }
        else {
            toppingsErr.classList.remove('show');
        }

        // Check if the pizza is already in array
        pizzaArray.some((pizza) => {
            if (pizza.name === inpName.value) {
                pizzaErr.classList.add('show');
                return found = true;
            }
        });

        if (inpName.value === '' || toppings.length < 2 || (+inpHeat.value < 0 || +inpHeat.value > 3) || (+inpPrice.value < 0 || +inpPrice.value > 100) || found === true) {
            return false;
        }
        else {
            return true;
        }
    };
    // CLears form inputs
    function clearInputs() {
        inpName.value = '';
        inpPrice.value = '';
        inpHeat.value = '';
        inpToppings.value = '';
        toppingsOutput.textContent = '';
        nameErr.classList.remove('show');
        priceErr.classList.remove('show');
        heatErr.classList.remove('show');
        toppingsErr.classList.remove('show');
        pizzaErr.classList.remove('show');
        toppings = [];
    }
    //Random num from 1-5 for pizza pictures
    const randomNum = () => {
        return Math.floor(Math.random() * 5) + 1;
    }
    // Returns form input values as an object
    function submitForm() {
        // Variable to store old array so the default item order is saved
        let oldArray = storageModule.getFromStorage();
        // Values for obj constructor attributes
        let id = pizzaArray.length;
        let pizza = inpName.value;
        let image = randomNum();
        let price = inpPrice.value;
        let heat = inpHeat.value;
        let ingredients = toppings.join(', ') + '.';
        clearInputs();
        let pizzaObj = pizzaFactory(id, pizza, image, price, heat, ingredients);
        pizzaArray.unshift(pizzaObj);
        if (oldArray) {
            oldArray.unshift(pizzaObj);
            storageModule.saveToStorage(oldArray)
        }
        else {
            storageModule.saveToStorage(pizzaArray)
        }
    }

    toppingsBtn.addEventListener('click', addToppings);
    submitBtn.addEventListener('click', () => {
        if (validateForm()) {
            submitForm()
            displayModule.displayArray();
            // pizzaModule.displayCard(pizzaArray.slice(0, 1).pop());
            modalModule.closeModal();
            console.log(pizzaArray);
        }
    });
    // export functions for other modules to use
    return {
        submitForm: submitForm,
        clearInputs: clearInputs
    }
})();
// MODAL for pizza cards
const pizzaModule = (() => {
    // Displays heat icons on card
    function displayHeat(heat) {
        if (heat === '3') {
            return '🌶️🌶️🌶️'
        }
        else if (heat === '2') {
            return '🌶️🌶️'
        }
        else if (heat === '1') {
            return '🌶️'
        }
        else {
            return ''
        }
    }

    let popupOn = false;
    // Creates pizza card DOM
    function displayCard(pizza) {
        //Create all card elements
        const grid = document.querySelector('.grid');
        const span = document.createElement('span');
        const gridItem = document.createElement('div');
        const pizzaName = document.createElement('h3');
        const pizzaImage = document.createElement('img');
        const pizzaPrice = document.createElement('p');
        const pizzaHeat = document.createElement('p');
        const pizzaToppings = document.createElement('p');
        const removeBtn = document.createElement('button');
        gridItem.classList.add('grid_item');
        pizzaName.classList.add('pizza_name');
        pizzaImage.classList.add('pizza_image');
        pizzaPrice.classList.add('pizza_price');
        pizzaHeat.classList.add('pizza_heat');
        pizzaToppings.classList.add('pizza_toppings');
        removeBtn.classList.add('btn_delete_pizza');
        //Display values as text in DOM elements
        gridItem.setAttribute('data-number', pizza.id);
        removeBtn.setAttribute('data-number', pizza.id);
        removeBtn.textContent = '✖';
        pizzaName.textContent = pizza.pizza;
        pizzaImage.setAttribute('src', `./assets/pizza${pizza.image}.jpg`);
        pizzaPrice.textContent = pizza.price + ' ' + '$';
        pizzaHeat.textContent = displayHeat(pizza.heat);
        pizzaToppings.textContent = pizza.toppings;

        grid.appendChild(gridItem);
        gridItem.appendChild(pizzaImage);
        gridItem.appendChild(pizzaName);
        gridItem.appendChild(span);
        gridItem.appendChild(removeBtn);
        span.appendChild(pizzaPrice);
        span.appendChild(pizzaHeat);
        gridItem.appendChild(pizzaToppings);
        // Assign remove button to ask for confirmation to remove pizza
        removeBtn.addEventListener('click', () => {
            if (!popupOn) {
                popupOn = true;
                confirmationPopup(pizza.id);
            }
        });
    }
    // Creates confirmation popup DOM
    function confirmationPopup(index) {
        const body = document.querySelector('body')
        const confirmation = document.createElement('div');
        const closeBtn = document.createElement('button');
        const confirmText = document.createElement('p');
        const span = document.createElement('span');
        const confirmBtn = document.createElement('button');
        const denyBtn = document.createElement('button');
        confirmation.classList.add('confirmation');
        closeBtn.classList.add('close_btn')
        confirmText.classList.add('confirm_text');
        confirmBtn.classList.add('confirm_btn');
        denyBtn.classList.add('deny_btn');

        body.appendChild(confirmation);
        confirmation.appendChild(closeBtn);
        confirmation.appendChild(confirmText);
        confirmation.appendChild(span);
        span.appendChild(confirmBtn);
        span.appendChild(denyBtn);

        closeBtn.textContent = '✖';
        confirmText.textContent = 'Are you sure you want to delete this pizza?';
        confirmBtn.textContent = 'Yes';
        denyBtn.textContent = 'No';
        // Confirmation button actions
        closeBtn.addEventListener('click', () => {
            confirmation.remove();
            popupOn = false;
        })
        denyBtn.addEventListener('click', () => {
            confirmation.remove();
            popupOn = false;
        })
        confirmBtn.addEventListener('click', () => {
            removePizza(index);
            confirmation.remove();
            popupOn = false;
        })
    }

    // Removes the pizza from the menu
    function removePizza(index) {
        const grid = document.querySelector('.grid');
        let newArray = pizzaArray.filter(pizza => pizza.id !== index);
        pizzaArray = newArray;
        storageModule.saveToStorage(pizzaArray);
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        displayModule.displayArray();
    };
    // export functions for other modules to use
    return {
        displayCard: displayCard
    }

})();

const modalSorting = (() => {
    const sortList = document.querySelector('#sort');

    sortList.addEventListener('change', () => {
        pizzaArray = storageModule.getFromStorage();
        switch (sortList.value) {
            case 'name':
                pizzaArray.sort((a, b) => {
                    return a.pizza.localeCompare(b.pizza);
                })
                break;
            case 'high':
                pizzaArray.sort((a, b) => {
                    return b.price - a.price;
                })
                break;
            case 'low':
                pizzaArray.sort((a, b) => {
                    return a.price - b.price
                })
                break;
            case 'hot':
                pizzaArray.sort((a, b) => {
                    return b.heat - a.heat;
                })
                break;
            case 'cold':
                pizzaArray.sort((a, b) => {
                    return a.heat - b.heat;
                })
                break;
            default:
        }
        displayModule.removeArray();
        displayModule.displayArray();
    })
})();

// MODULE for storage
const storageModule = (() => {

    function saveToStorage(array) {
        sessionStorage.setItem('pizzas', JSON.stringify(array));
    };

    function getFromStorage() {
        return JSON.parse(sessionStorage.getItem('pizzas'));
    };
    // export functions for other modules to use
    return {
        saveToStorage: saveToStorage,
        getFromStorage: getFromStorage
    }
})();
// Loads up pizzas from storage and displays them
const displayModule = (() => {
    let firstLoad = true;
    // Displays all pizzas from storage 
    function displayArray() {
        removeDisplayed();
        let pizzas = pizzaArray;
        if (pizzas.length !== 0) {
            pizzaArray = pizzas.map((pizza) => {
                pizzaModule.displayCard(pizza);
                return pizza;
            })
        }
        else if (pizzas.length === 0) {
            pizzaArray = [];
            pizzas = storageModule.getFromStorage();
            if (pizzas) {
                pizzaArray = pizzas.map((pizza) => {
                    pizzaModule.displayCard(pizza);
                    return pizza;
                })
            }
        }
    };

    function removeDisplayed() {
        let displayedPizzas = document.querySelectorAll('.grid_item');
        displayedPizzas.forEach((pizza) => {
            pizza.remove();
        })
    };
    // Display from storage on first load
    window.onload = () => {
        // Clears array for first time load
        if (firstLoad) {
            displayArray();
            firstLoad = false;
        }
    };
    // export functions for other modules to use
    return {
        displayArray: displayArray,
        removeArray: removeDisplayed
    }
})();
