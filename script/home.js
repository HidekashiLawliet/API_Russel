const catwayPart = document.getElementById('cateways-list');
const reservationPart = document.getElementById('reservations-list');
const usersPart = document.getElementById('users-list');

function handleChange(selectedElemennt) {
    const val = selectedElemennt.value;
    const catewaysSection = document.getElementById('catewaysSection');
    const reservationsSection = document.getElementById('reservationsSection');
    const userSection = document.getElementById('UsersSection')
    if (val === 'cateways') {
        catewaysSection.style.display = 'block';
        reservationsSection.style.display = 'none';
        userSection.style.display = 'none'
    } else if (val === 'reservations') {
        catewaysSection.style.display = 'none';
        reservationsSection.style.display = 'block';
        userSection.style.display = 'none'
    } else {
        userSection.style.display = 'block'
        catewaysSection.style.display = 'none';
        reservationsSection.style.display = 'none';
    }
}
window.handleChange = handleChange; // exposer pour l'appel inline depuis le HTML

async function loadCateways() {
    try {
        const res = await fetch('/cateways');
        if (!res.ok) throw new Error('Network response was not ok');
        const items = await res.json();
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
            catwayPart.appendChild(box);
        });

    } catch (err) {
        console.error('Failed to load cateways', err);
        catwayPart.textContent = 'Error loading data';
    }
}
loadCateways();

createNewCatway = () => {
    const form = document.getElementById('catwayForm');
    if (form) form.style.display = 'block';
    loadCateways();
};

createNewReservation = () => {
    const form = document.getElementById('reservationForm');
    if (form) form.style.display = 'block';
}

async function loadUsers() {
    try {
        const res = await fetch('/users');
        const users = await res.json();
        users.forEach(user => {
            const box = document.createElement('div');
            box.className = "userBox";
            const userId = user._id;
            const name = document.createElement('p');
            name.textContent = `nom: ${user.name}`;
            const email = document.createElement('p');
            email.textContent = `email: ${user.mail}`;
            const changeButton = document.createElement('button');
            changeButton.textContent = 'Change User';
            changeButton.className = "changeButton";
            changeButton.addEventListener('click', () => {
                console.log('Save changes for user ID:', userId);
                const form = document.createElement('form');
                const emailInput = document.createElement('input');
                emailInput.type = 'email';
                emailInput.name = 'email';
                emailInput.placeholder = 'Enter new email';
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.name = 'name';
                nameInput.placeholder = 'Enter new name';
                form.appendChild(emailInput);
                form.appendChild(nameInput);
                const submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = 'Submit';
                form.appendChild(submitButton);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const updatedData = {
                        id: userId,
                        mail: emailInput.value,
                        name: nameInput.value
                    };
                    fetch(`/users/${userId}/change`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Success:', data);
                            location.reload();
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                });
                document.body.appendChild(form);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete User';
            deleteButton.className = "deleteButton";
            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        const response = await fetch(`/users/${userId}/delete`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete user');
                        }
                        location.reload();
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });

            box.appendChild(name);
            box.appendChild(email);
            box.appendChild(changeButton);
            box.appendChild(deleteButton);
            usersPart.appendChild(box);
        });

    } catch (err) {
        console.error('Failed to load users', err);
        catwayPart.textContent = 'Error loading data';
    }
}
loadUsers();


const catwayFormEl = document.getElementById('catwayForm');
if (catwayFormEl) {
    catwayFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedType = e.target.querySelector('input[name="catwayType"]:checked');
        const data = {
            catwayNumber: e.target.catwayNumber.value,
            catwayType: selectedType ? selectedType.value : '',
            catwayState: e.target.catwayState.value
        };
        try {
            const existingNumber = await fetch('/cateways');
            if (!existingNumber.ok) throw new Error('Failed to fetch cateways');
            const existing = await existingNumber.json();
            const exists = existing.some(input => String(input.catwayNumber) === String(data.catwayNumber));
            if (exists) {
                let errEl = catwayFormEl.querySelector('.catway-error');
                if (!errEl) {
                    errEl = document.createElement('div');
                    errEl.className = 'catway-error';
                    errEl.style.color = 'red';
                    errEl.style.marginTop = '6px';
                    catwayFormEl.appendChild(errEl);
                }
                errEl.textContent = 'this cateway number is already in use';
                return;
            }
            const res = await fetch('/cateway/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const prevErr = catwayFormEl.querySelector('.catway-error');
            if (prevErr) prevErr.textContent = '';
            catwayFormEl.reset();
            catwayFormEl.style.display = 'none';
            location.reload();
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
            // verify catway exists
            const catRes = await fetch('/cateways');
            if (!catRes.ok) throw new Error('Failed to fetch cateways');
            const cats = await catRes.json();
            const valid = cats.some(c => String(c.catwayNumber) === String(data.catwayNumber));
            if (!valid) {
                let errEl = reservationFormEl.querySelector('.reservation-error');
                if (!errEl) {
                    errEl = document.createElement('div');
                    errEl.className = 'reservation-error';
                    errEl.style.color = 'red';
                    errEl.style.marginTop = '6px';
                    reservationFormEl.appendChild(errEl);
                }
                errEl.textContent = 'catway number does not exist';
                return;
            }
            const prevErr = reservationFormEl.querySelector('.reservation-error');
            if (prevErr) prevErr.textContent = '';
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

