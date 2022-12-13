let pizzaArray = [];
//Pizza object factory
const pizzaFactory = (id, pizza, image, price, heat, toppings) => {
    return {
        id, pizza, image, price, heat, toppings
    }
};

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

const formModule = (() => {
    //Form inputs and buttons
    const inpName = document.querySelector('#input_name');
    const inpPrice = document.querySelector('#input_price');
    const inpHeat = document.querySelector('#input_heat');
    const inpToppings = document.querySelector('#input_toppings');
    const toppingsBtn = document.querySelector('.btn_toppings');
    const toppingsOutput = document.querySelector('.toppings_output');
    const submitBtn = document.querySelector('#submit');

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
    // CLears form inputs
    function clearInputs() {
        inpName.value = '';
        inpPrice.value = '';
        inpHeat.value = '';
        inpToppings.value = '';
        toppingsOutput.textContent = '';
        toppings = [];
    }
    //Random num from 1-5
    const randomNum = () => {
        return Math.floor(Math.random() * 5) + 1;
    }
    // Returns form input values as an object
    function submitForm() {
        let id = pizzaArray.length;
        let pizza = inpName.value;
        let image = randomNum();
        let price = inpPrice.value;
        let heat = inpHeat.value;
        let ingredients = toppings.join(', ') + '.';
        clearInputs();
        let pizzaObj = pizzaFactory(id, pizza, image, price, heat, ingredients);
        pizzaArray.push(pizzaObj);
        storageModule.saveToStorage();
    }

    toppingsBtn.addEventListener('click', addToppings);
    submitBtn.addEventListener('click', () => {
        submitForm()
        pizzaModule.displayCard(pizzaArray.slice(-1).pop());
        modalModule.closeModal();
        console.log(pizzaArray);
    });
    // export functions for other modules to use
    return {
        submitForm: submitForm,
        clearInputs: clearInputs
    }
})();

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

    // Creates pizza card DOM
    function displayCard(pizza) {
        //Create all card elements
        const grid = document.querySelector('.grid');
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
        gridItem.appendChild(pizzaName);
        gridItem.appendChild(removeBtn);
        gridItem.appendChild(pizzaImage);
        gridItem.appendChild(pizzaPrice);
        gridItem.appendChild(pizzaHeat);
        gridItem.appendChild(pizzaToppings);

        // Assign remove button to ask for confirmation to remove pizza
        removeBtn.addEventListener('click', () => {
            confirmationPopup(pizza.id);
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
        })
        denyBtn.addEventListener('click', () => {
            confirmation.remove();
        })
        confirmBtn.addEventListener('click', () => {
            removePizza(index);
            confirmation.remove();
        })
    }

    // Removes the book from the page
    function removePizza(index) {
        const grid = document.querySelector('.grid');
        let newArray = pizzaArray.filter(pizza => pizza.id !== index);
        pizzaArray = newArray;
        storageModule.saveToStorage();
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
        displayPizzas(pizzaArray);
    };
    // export functions for other modules to use
    return {
        displayCard: displayCard
    }

})();

const storageModule = (() => {
    function saveToStorage() {
        sessionStorage.setItem('pizzas', JSON.stringify(pizzaArray));
    };

    function getFromStorage() {
        return JSON.parse(sessionStorage.getItem('pizzas'));
    };

    return {
        saveToStorage: saveToStorage,
        getFromStorage: getFromStorage
    }
})();

// Loads up pizzas from storage on refresh
function displayPizzas(pizzaArray) {
    let pizzas = storageModule.getFromStorage();
    if (pizzas) {
        pizzaArray = pizzas.map((pizza) => {
            pizzaModule.displayCard(pizza);
        })
    }
    else {
        pizzaArray = []
    }
};

displayPizzas(pizzaArray);