let pizzaArray = [];
//Pizza object factory
const pizzaFactory = (id, pizza, image, price, heat, toppings) => {
    return {
        id, pizza, image, price, heat, toppings
    }
}

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
        modalForm.clearInputs();
    }

    createBtn.addEventListener('click', showModal);
    closeBtn.addEventListener('click', closeModal);

    return {
        closeModal: closeModal
    }
})();

const modalForm = (() => {
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
    }

    toppingsBtn.addEventListener('click', addToppings);
    submitBtn.addEventListener('click', () => {
        submitForm()
        pizzaCard.displayCard(pizzaArray.slice(-1).pop());
        modalModule.closeModal();
        console.log(pizzaArray);
    });
    // export functions for other modules to use
    return {
        submitForm: submitForm,
        clearInputs: clearInputs
    }
})();

const pizzaCard = (() => {

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
        gridItem.classList.add('grid_item');
        const pizzaName = document.createElement('h3');
        pizzaName.classList.add('pizza_name');
        const pizzaImage = document.createElement('img');
        pizzaImage.classList.add('pizza_image');
        const pizzaPrice = document.createElement('p');
        pizzaPrice.classList.add('pizza_price');
        const pizzaHeat = document.createElement('p');
        pizzaHeat.classList.add('pizza_heat');
        let pizzaToppings = document.createElement('p');
        pizzaToppings.classList.add('pizza_toppings');
        const removeBtn = document.createElement('button');
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

        // Assign remove button to remove the card it is located in
        removeBtn.addEventListener('click', () => {
            removePizza(pizza.id);
        });
    }

    // Removes the book from the page
    function removePizza(index) {
        let pizza = document.querySelector(`.grid_item[data-number='${index}']`);
        pizza.remove();
        pizzaArray.splice(pizzaArray.length - 1, 1);
    };

    return {
        displayCard: displayCard
    }

})();

// Loads up pizzas from storage on refresh
// function onLoad(pizzaArray) {
//     const pizzas = JSON.parse(sessionStorage.getItem('pizzas'))
//     if (pizzas) {
//         pizzaArray = pizzas.map((pizza) => {
//             displayCard(pizza);
//         })
//     }
//     else {
//         pizzaArray = []
//     }

// }