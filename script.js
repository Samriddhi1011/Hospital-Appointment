const servicesData = [
  {
    id: "general",
    name: "General Physician",
    icon: "🩺",
    fee: 500,
    description: "Routine checkups, fever management, blood pressure, and preventive care."
  },
  {
    id: "cardiology",
    name: "Cardiologist",
    icon: "❤️",
    fee: 900,
    description: "Comprehensive heart health evaluations, ECG reviews, and hypertension care."
  },
  {
    id: "dermatology",
    name: "Dermatologist",
    icon: "✨",
    fee: 700,
    description: "Skin, hair, and nail treatments including acne, allergies, and skincare plans."
  },
  {
    id: "pediatrics",
    name: "Pediatrician",
    icon: "🧸",
    fee: 600,
    description: "Dedicated healthcare, vaccinations, and growth tracking for infants and children."
  },
  {
    id: "dental",
    name: "Dentist",
    icon: "🦷",
    fee: 650,
    description: "Painless dental cleanings, root canals, fillings, and routine oral checkups."
  },
  {
    id: "diagnostics",
    name: "Full Body Checkup",
    icon: "🧪",
    fee: 1499,
    description: "Complete blood panel, thyroid profile, diabetes screening, and doctor review."
  }
];

const doctorsData = [
  {
    id: "doc1",
    name: "Dr. Robert Sharma",
    initials: "RS",
    department: "General Physician",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: "14 yrs experience",
    fee: 500
  },
  {
    id: "doc2",
    name: "Dr. Vikram Rana",
    initials: "VR",
    department: "Cardiologist",
    qualification: "MBBS, DM (Cardiology)",
    experience: "18 yrs experience",
    fee: 900
  },
  {
    id: "doc3",
    name: "Dr. Manya Gupta",
    initials: "MG",
    department: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    experience: "10 yrs experience",
    fee: 700
  },
  {
    id: "doc4",
    name: "Dr. Rohan Kaushik",
    initials: "RK",
    department: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics)",
    experience: "12 yrs experience",
    fee: 600
  },
  {
    id: "doc5",
    name: "Dr. Kavita Johri",
    initials: "KJ",
    department: "Dentist",
    qualification: "BDS, MDS (Endodontics)",
    experience: "9 yrs experience",
    fee: 650
  },
  {
    id: "doc6",
    name: "Dr. Siddharth Verma",
    initials: "SV",
    department: "General Physician",
    qualification: "MBBS, DNB (Family Medicine)",
    experience: "11 yrs experience",
    fee: 500
  }
];

const timeSlots = [
  "09:30 AM",
  "11:00 AM",
  "12:30 PM",
  "04:00 PM",
  "05:30 PM",
  "07:00 PM"
];

let selectedSlot = "";
let appointments = JSON.parse(localStorage.getItem("arogya_appointments")) || [];

const servicesGrid = document.getElementById("servicesGrid");
const doctorsGrid = document.getElementById("doctorsGrid");
const filterBar = document.getElementById("filterBar");
const serviceSelect = document.getElementById("serviceSelect");
const doctorSelect = document.getElementById("doctorSelect");
const appointmentDate = document.getElementById("appointmentDate");
const slotContainer = document.getElementById("slotContainer");
const appointmentForm = document.getElementById("appointmentForm");

const bookingsDrawer = document.getElementById("bookingsDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const openDrawerBtn = document.getElementById("openDrawerBtn");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const bookingsList = document.getElementById("bookingsList");
const bookingCount = document.getElementById("bookingCount");

const confirmModal = document.getElementById("confirmModal");
const modalSummary = document.getElementById("modalSummary");
const closeModalBtn = document.getElementById("closeModalBtn");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function init() {
  setupTheme();
  setMinDate();
  renderServices();
  renderDoctors("All");
  populateServiceDropdown();
  populateDoctorDropdown("All");
  renderTimeSlots();
  updateBookingsUI();
}

function setupTheme() {
  const savedTheme = localStorage.getItem("arogya_theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeIcon.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("arogya_theme", isDark ? "dark" : "light");
  });
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  appointmentDate.min = today;
  appointmentDate.value = today;
}

function renderServices() {
  servicesGrid.innerHTML = servicesData
    .map(
      (service) => `
      <div class="card">
        <div>
          <div class="service-top">
            <div class="service-icon">${service.icon}</div>
            <span class="fee-tag">₹${service.fee}</span>
          </div>
          <h3>${service.name}</h3>
          <p>${service.description}</p>
        </div>
        <button class="btn-outline full-width" onclick="selectServiceAndScroll('${service.name}')">
          Book Service
        </button>
      </div>
    `
    )
    .join("");
}

function renderDoctors(department) {
  const filtered =
    department === "All"
      ? doctorsData
      : doctorsData.filter((doc) => doc.department === department);

  doctorsGrid.innerHTML = filtered
    .map(
      (doc) => `
      <div class="card">
        <div>
          <div class="doc-header">
            <div class="avatar">${doc.initials}</div>
            <div>
              <h3>${doc.name}</h3>
              <span class="doc-dept">${doc.department}</span>
            </div>
          </div>
          <div class="doc-meta">
            <span>🎓 ${doc.qualification}</span>
            <span>🩺 ${doc.experience}</span>
            <span>💳 Consultation Fee: <strong>₹${doc.fee}</strong></span>
          </div>
        </div>
        <button class="btn-primary full-width" onclick="selectDoctorAndScroll('${doc.id}')">
          Book Appointment
        </button>
      </div>
    `
    )
    .join("");
}

filterBar.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter-btn")) return;

  document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  const dept = e.target.dataset.dept;
  renderDoctors(dept);
});

function populateServiceDropdown() {
  servicesData.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.name;
    option.textContent = `${service.name} (₹${service.fee})`;
    serviceSelect.appendChild(option);
  });
}

function populateDoctorDropdown(filterDept) {
  doctorSelect.innerHTML = `<option value="">-- Choose Doctor --</option>`;

  const list =
    filterDept === "All" || filterDept === "Full Body Checkup" || !filterDept
      ? doctorsData
      : doctorsData.filter((doc) => doc.department === filterDept);

  list.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = `${doc.name} (${doc.department})`;
    doctorSelect.appendChild(option);
  });
}

serviceSelect.addEventListener("change", () => {
  populateDoctorDropdown(serviceSelect.value);
});

window.selectServiceAndScroll = function (serviceName) {
  serviceSelect.value = serviceName;
  populateDoctorDropdown(serviceName);
  document.getElementById("book").scrollIntoView({ behavior: "smooth" });
};

window.selectDoctorAndScroll = function (doctorId) {
  const doc = doctorsData.find((d) => d.id === doctorId);
  if (!doc) return;

  serviceSelect.value = doc.department;
  populateDoctorDropdown(doc.department);
  doctorSelect.value = doc.id;
  document.getElementById("book").scrollIntoView({ behavior: "smooth" });
};

function renderTimeSlots() {
  slotContainer.innerHTML = timeSlots
    .map(
      (slot) => `
      <button type="button" class="slot-btn" data-slot="${slot}">
        ${slot}
      </button>
    `
    )
    .join("");

  slotContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("slot-btn")) return;

    document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
    e.target.classList.add("selected");
    selectedSlot = e.target.dataset.slot;
    document.getElementById("slotError").textContent = "";
  });
}

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();
  const service = serviceSelect.value;
  const doctorId = doctorSelect.value;
  const date = appointmentDate.value;
  const notes = document.getElementById("notes").value.trim();

  document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));

  let isValid = true;

  if (name.length < 2) {
    document.getElementById("nameError").textContent = "Please enter patient's full name.";
    isValid = false;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {
    document.getElementById("phoneError").textContent = "Enter a valid 10-digit Indian mobile number.";
    isValid = false;
  }

  if (!service) {
    document.getElementById("serviceError").textContent = "Please select a service.";
    isValid = false;
  }

  if (!doctorId) {
    document.getElementById("doctorError").textContent = "Please select a doctor.";
    isValid = false;
  }

  if (!date) {
    document.getElementById("dateError").textContent = "Please choose a date.";
    isValid = false;
  }

  if (!selectedSlot) {
    document.getElementById("slotError").textContent = "Please select a time slot.";
    isValid = false;
  }

  if (!isValid) return;

  const chosenDoc = doctorsData.find((d) => d.id === doctorId);

  const newAppointment = {
    id: Date.now(),
    patientName: name,
    patientPhone: phone,
    service: service,
    doctorName: chosenDoc ? chosenDoc.name : "Assigned Specialist",
    fee: chosenDoc ? chosenDoc.fee : 500,
    date: date,
    slot: selectedSlot,
    notes: notes
  };

  appointments.unshift(newAppointment);
  saveAppointments();
  updateBookingsUI();

  modalSummary.innerHTML = `
    <strong>${newAppointment.patientName}</strong>, your visit with 
    <strong>${newAppointment.doctorName}</strong> (${newAppointment.service}) is scheduled for 
    <strong>${newAppointment.date}</strong> at <strong>${newAppointment.slot}</strong>.
  `;
  confirmModal.classList.remove("hidden");

  appointmentForm.reset();
  setMinDate();
  selectedSlot = "";
  document.querySelectorAll(".slot-btn").forEach((b) => b.classList.remove("selected"));
});

function saveAppointments() {
  localStorage.setItem("arogya_appointments", JSON.stringify(appointments));
}

function updateBookingsUI() {
  bookingCount.textContent = appointments.length;

  if (appointments.length === 0) {
    bookingsList.innerHTML = `<p style="color: var(--text-secondary);">No appointments booked yet.</p>`;
    return;
  }

  bookingsList.innerHTML = appointments
    .map(
      (item) => `
      <div class="booking-item">
        <h4>${item.doctorName}</h4>
        <p><strong>Department:</strong> ${item.service}</p>
        <p><strong>Patient:</strong> ${item.patientName} (${item.patientPhone})</p>
        <p><strong>When:</strong> ${item.date} at ${item.slot}</p>
        <p><strong>Fee:</strong> ₹${item.fee}</p>
        <button class="cancel-btn" onclick="cancelAppointment(${item.id})">Cancel Appointment</button>
      </div>
    `
    )
    .join("");
}

window.cancelAppointment = function (id) {
  appointments = appointments.filter((item) => item.id !== id);
  saveAppointments();
  updateBookingsUI();
};

openDrawerBtn.addEventListener("click", () => {
  bookingsDrawer.classList.add("open");
  drawerOverlay.classList.remove("hidden");
});

function closeDrawer() {
  bookingsDrawer.classList.remove("open");
  drawerOverlay.classList.add("hidden");
}

closeDrawerBtn.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

closeModalBtn.addEventListener("click", () => {
  confirmModal.classList.add("hidden");
});

init();