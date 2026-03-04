const listPart = document.getElementById('cateways-list');
const reservationPart = document.getElementById('reservations-list');

function handleChange(selectedElemennt) {
    const val = selectedElemennt.value;
    const catewaysSection = document.getElementById('catewaysSection');
    const reservationsSection = document.getElementById('reservationsSection');
    if (val === 'cateways') {
        catewaysSection.style.display = 'block';
        reservationsSection.style.display = 'none';
    } else {
        catewaysSection.style.display = 'none';
        reservationsSection.style.display = 'block';
    }
}
window.handleChange = handleChange; // exposer pour l'appel inline depuis le HTML

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
                console.log('Save changes for catway ID:', id);
                const updatedData = {
                    catwayState: prompt('Enter new catway state:')
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
                        console.log('Update successful:', data);
                        location.reload();
                    })
                    .catch(error => {
                        console.error('Error updating cateway:', error);
                    });
            });

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

createNewCatway = () => {
    const form = document.getElementById('catwayForm');
    if (form) form.style.display = 'block';
};


// ** reprendre la code a ici
createNewReservation = () => {
    const form = document.getElementById('reservationForm');
    if (form) form.style.display = 'block';
}

// Form submit handlers (attach once)
const catwayFormEl = document.getElementById('catwayForm');
if (catwayFormEl) {
    catwayFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            catwayNumber: e.target.catwayNumber.value,
            catwayType: e.target.catwayType.value,
            catwayState: e.target.catwayState.value
        };
        try {
            const res = await fetch('/cateway/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            console.log('Cateway created successfully:', json);
            catwayFormEl.reset();
            catwayFormEl.style.display = 'none';
            loadCateways();
        } catch (err) {
            console.error('Error creating catway:', err);
        }
    });
    const catwayCancel = document.getElementById('catwayCancel');
    if (catwayCancel) catwayCancel.addEventListener('click', () => { catwayFormEl.style.display = 'none'; });
}

const reservationFormEl = document.getElementById('reservationForm');
if (reservationFormEl) {
    reservationFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            catwayNumber: e.target.catwayNumber.value,
            clientName: e.target.clientName.value,
            boatName: e.target.boatName.value,
            startDate: e.target.startDate.value,
            endDate: e.target.endDate.value
        };
        try {
            const res = await fetch('/reservations/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const json = await res.json();
            console.log('Reservation created successfully:', json);
            reservationFormEl.reset();
            reservationFormEl.style.display = 'none';
            loadReservations();
        } catch (err) {
            console.error('Error creating reservation:', err);
        }
    });
    const reservationCancel = document.getElementById('reservationCancel');
    if (reservationCancel) reservationCancel.addEventListener('click', () => { reservationFormEl.style.display = 'none'; });
}
// ** reprendre la code a ici


async function loadReservations() {
    try {
        const cateways = await fetch('/cateways').then(r => r.json());
        let allReservations = [];

        for (const catway of cateways) {
            const reservations = await fetch(`/catways/${catway._id}/reservations`)
                .then(r => r.json())
                .catch(err => {
                    console.error(`Erreur pour catway ${catway._id}:`, err);
                    return [];
                });
            allReservations = allReservations.concat(reservations);
        }

        reservationPart.innerHTML = '';
        if (allReservations.length === 0) {
            reservationPart.textContent = 'No reservations found';
            return;
        }

        allReservations.forEach(item => {
            const box = document.createElement('div');
            box.className = "reservationBox";
            const id = item._id;
            const number = item.catwayNumber;
            const clientName = item.clientName;
            const boatName = item.boatName;
            const startDate = item.startDate;
            const endDate = item.endDate;

            const title = document.createElement('p');
            title.textContent = `Reservation id: ${id}`;
            const reservationNum = document.createElement('p');
            reservationNum.textContent = `Catway Number: ${number}`;
            const client = document.createElement('p');
            client.textContent = `Client Name: ${clientName}`;
            const boat = document.createElement('p');
            boat.textContent = `Boat Name: ${boatName}`;
            const start = document.createElement('p');
            start.textContent = `Start Date: ${startDate}`;
            const end = document.createElement('p');
            end.textContent = `End Date: ${endDate}`;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "delete reservation";
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this reservation?")) {
                    try {
                        const response = await fetch(`/catway/${item.catwayNumber}/reservations/${item._id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete reservation');
                        }
                        location.reload();
                    } catch (error) {
                        console.error('Error deleting reservation:', error);
                    }
                }
            });
            const changeButton = document.createElement('button');
            changeButton.textContent = "change reservation";
            changeButton.className = "changeButton";
            changeButton.addEventListener('click', async () => {
                const newClientName = prompt("Enter new client name:");
                const newBoatName = prompt("Enter new boat name:");
                const newStartDate = prompt("Enter new start date (YYYY-MM-DD):");
                const newEndDate = prompt("Enter new end date (YYYY-MM-DD):");
                if (newClientName !== null) {
                    try {
                        const response = await fetch(`/catway/${item.catwayNumber}/reservations/${item._id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                clientName: newClientName,
                                boatName: newBoatName,
                                startDate: newStartDate,
                                endDate: newEndDate
                            })
                        });
                        if (!response.ok) {
                            throw new Error('Failed to update reservation');
                        }
                        location.reload();
                    } catch (error) {
                        console.error('Error updating reservation:', error);
                    }
                }
            });

            box.appendChild(title);
            box.appendChild(reservationNum);
            box.appendChild(client);
            box.appendChild(boat);
            box.appendChild(start);
            box.appendChild(end);
            box.appendChild(deleteButton);
            box.appendChild(changeButton);
            reservationPart.appendChild(box);
        });
    } catch (err) {
        console.error('Failed to load reservations', err);
        reservationPart.textContent = 'Error loading data';
    }
}
loadReservations();

document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('viewSelect');
    if (select) handleChange(select);
});

