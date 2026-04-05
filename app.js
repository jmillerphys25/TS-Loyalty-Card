const form = document.getElementById("generator-form");
const phoneInput = document.getElementById("phone");
const statusEl = document.getElementById("status");
const barcodeEl = document.getElementById("barcode");
const downloadBtn = document.getElementById("download-btn");

let currentDigits = "";

function cleanPhone(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function formatPhone(value) {
  const digits = cleanPhone(value);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function generateBarcode(digits) {
  JsBarcode(barcodeEl, digits, {
    format: "CODE128",
    lineColor: "#1d2021",
    background: "#fbf1c7",
    width: 2.2,
    height: 110,
    margin: 10,
    displayValue: true,
    font: "Roboto",
    fontSize: 20
  });
}

function downloadBarcodePng() {
  const svgData = new XMLSerializer().serializeToString(barcodeEl);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const padding = 24;
    canvas.width = img.width + padding * 2;
    canvas.height = img.height + padding * 2;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fbf1c7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, padding, padding);

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `barcode-${currentDigits}.png`;
    link.click();

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const digits = cleanPhone(phoneInput.value);

  if (digits.length !== 10) {
    statusEl.textContent = "Please enter a valid 10-digit phone number.";
    downloadBtn.disabled = true;
    return;
  }

  try {
    generateBarcode(digits);
    currentDigits = digits;
    statusEl.textContent = `Barcode generated for ${digits}.`;
    downloadBtn.disabled = false;
  } catch (error) {
    statusEl.textContent = "Something went wrong while generating the barcode.";
    downloadBtn.disabled = true;
  }
});

downloadBtn.addEventListener("click", () => {
  if (!currentDigits) return;
  downloadBarcodePng();
});
