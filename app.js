const form = document.getElementById("generator-form");
const phoneInput = document.getElementById("phone");
const statusEl = document.getElementById("status");

function cleanPhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function formatPhone(value) {
  const digits = cleanPhone(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const digits = cleanPhone(phoneInput.value);

  if (digits.length !== 10) {
    statusEl.textContent = "Please enter a valid 10-digit phone number.";
    return;
  }

  statusEl.textContent = `Phone number accepted: ${digits}`;
});
