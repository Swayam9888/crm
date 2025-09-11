// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
	navToggle.addEventListener('click', () => {
		const open = primaryNav.classList.toggle('open');
		navToggle.setAttribute('aria-expanded', String(open));
	});
}

// Menu filter chips
const chips = document.querySelectorAll('.chip');
const menuGrid = document.getElementById('menuGrid');
if (chips.length && menuGrid) {
	chips.forEach(chip => {
		chip.addEventListener('click', () => {
			chips.forEach(c => c.classList.remove('active'));
			chip.classList.add('active');
			const filter = chip.getAttribute('data-filter');
			const items = menuGrid.querySelectorAll('.dish-card');
			items.forEach(it => {
				const cat = it.getAttribute('data-category');
				it.style.display = filter === 'all' || filter === cat ? '' : 'none';
			});
		});
	});
}

// Reservation form validation (demo only)
const reservationForm = document.getElementById('reservationForm');
const reserveMsg = document.getElementById('reserveMsg');
if (reservationForm) {
	reservationForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const data = new FormData(reservationForm);
		const required = ['name','email','date','time','guests'];
		for (const key of required) {
			if (!data.get(key)) {
				reserveMsg.textContent = 'Please fill all required fields.';
				reserveMsg.style.color = '#fca5a5';
				return;
			}
		}
		reserveMsg.textContent = 'Reservation received! We\'ll confirm by email shortly.';
		reserveMsg.style.color = '#86efac';
		reservationForm.reset();
	});
}


