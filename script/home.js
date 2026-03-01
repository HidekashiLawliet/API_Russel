const listPart = document.getElementById('cateways-list');
const reservationPart = document.getElementById('reservations-list');


async function openChangeForm(id) {
    const res = await fetch('/cateways');
    if (!res.ok) throw new Error('Network response was not ok');
    const items = await res.json();
    console.log('Open change form for catway ID:', id);
    const box = document.createElement('div');
    box.className = "changeForm";
    const title = document.createElement('p');
    title.textContent = `Change Cateway id: ${id}:`;
    const catewayNumInput = document.createElement('input');
    catewayNumInput.placeholder = 'New Number';
    const catewayTypeInput = document.createElement('input');
    catewayTypeInput.placeholder = 'New Type';
    const catewayStateInput = document.createElement('input');
    catewayStateInput.placeholder = 'New State';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.addEventListener('click', () => {
        console.log('Save changes for catway ID:', id);

        const updatedData = {
            catwayNumber: catewayNumInput.value,
            catwayType: catewayTypeInput.value,
            catwayState: catewayStateInput.value
        };

        console.log('Updated data: ', updatedData)
        fetch(`/cateway/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSONupdatedData
        })
    });

    box.appendChild(title);
    box.appendChild(catewayNumInput);
    box.appendChild(catewayTypeInput);
    box.appendChild(catewayStateInput);
    box.appendChild(saveButton);

    document.body.appendChild(box); // Append the form to the body or a specific container
}

async function loadCateways() {
    try {
        const res = await fetch('/cateways');
        if (!res.ok) throw new Error('Network response was not ok');
        const items = await res.json();
        listPart.innerHTML = ''; // clear existing
        items.forEach(item => {
            const box = document.createElement('div');
            box.className = "catewayBox"
            const id = item._id
            const title = document.createElement('p');
            title.textContent = `Cateway id: ${id}:`;
            const catewayNum = document.createElement('p');
            catewayNum.textContent = `Number: ${item.catwayNumber}`;
            const catewayType = document.createElement('p');
            catewayType.textContent = `Type: ${item.catwayType}`;
            const catewayState = document.createElement('p');
            catewayState.textContent = `State: ${item.catwayState}`;
            const changeButton = document.createElement('button');
            changeButton.textContent = 'Change catway';
            changeButton.className = "changeButton";
            changeButton.addEventListener('click', () => {
                openChangeForm(id);
            })


            box.appendChild(title);
            box.appendChild(catewayNum);
            box.appendChild(catewayType);
            box.appendChild(catewayState);
            box.appendChild(changeButton);
            listPart.appendChild(box);
        });
    } catch (err) {
        console.error('Failed to load cateways', err);
        listPart.textContent = 'Error loading data';
    }
}
loadCateways();

async function loadReservations() {
    try {
        const res = await fetch('/reservations');
        if (!res.ok) throw new Error('Network response was not ok');
        const items = await res.json();
        reservationPart.innerHTML = ''; // clear existing
        items.forEach(item => {
            const box = document.createElement('div');
            box.className = "reservationBox"
            const id = item._id;
            const number = item.catwayNumber;
            const clientName = item.clientName;
            const boatName = item.boatName;
            const startDate = item.startDate;
            const endDate = item.endDate;

            const title = document.createElement('p');
            title.textContent = `Reservation id: ${id}:`;
            const reservationNum = document.createElement('p');
            reservationNum.textContent = `Reservation Number: ${number}`;
            const client = document.createElement('p');
            client.textContent = `Client Name: ${clientName}`;
            const boat = document.createElement('p');
            boat.textContent = `Boat Name: ${boatName}`;
            const start = document.createElement('p');
            start.textContent = `Start Date: ${startDate}`;
            const end = document.createElement('p');
            end.textContent = `End Date: ${(endDate)}`;

            box.appendChild(title);
            box.appendChild(reservationNum);
            box.appendChild(client);
            box.appendChild(boat);
            box.appendChild(start);
            box.appendChild(end);
            reservationPart.appendChild(box);
        });
    } catch (err) {
        console.error('Failed to load reservations', err);
        reservationPart.textContent = 'Error loading data';
    }
}
loadReservations();