const listPart = document.getElementById('cateways-list');
const reservationPart = document.getElementById('reservations-list');


async function openChangeForm(id) {
    console.log('Open change form for catway ID:', id);
    const title = document.createElement('p');
    const box = document.createElement('div');
    const catewayStateInput = document.createElement('input');
    const saveButton = document.createElement('button');

    box.className = "changeForm";
    title.textContent = `Change Cateway state: ${id}:`;
    catewayStateInput.placeholder = 'New State';
    saveButton.textContent = 'Save Changes';
    saveButton.addEventListener('click', () => {
        console.log('Save changes for catway ID:', id);
        const updatedData = {
            catwayState: catewayStateInput.value
        };

        console.log('Updated data: ', updatedData)
        fetch(`/cateway/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)

        })
            .then(response => response.json())
            .then(data => {
                // Handle the response data if needed
                console.log('Update successful:', data);
                // Reload the page
                location.reload();
            })
            .catch(error => {
                console.error('Error updating cateway:', error);
            });

    });

    box.appendChild(title);
    box.appendChild(catewayStateInput);
    box.appendChild(saveButton);

    document.body.appendChild(box); // Append the form to the body or a specific container
}


async function createCateway() {


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
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete catway';
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this catway?")) {
                    try {
                        const response = await fetch(`/cateway/delete/${id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete catway');
                        }
                        location.reload();
                    } catch (error) {
                        console.error('Error deleting catway:', error);
                    }
                }
            });


            box.appendChild(title);
            box.appendChild(catewayNum);
            box.appendChild(catewayType);
            box.appendChild(catewayState);
            box.appendChild(changeButton);
            box.appendChild(deleteButton);
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