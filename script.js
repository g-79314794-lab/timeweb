const form = document.querySelector("#countdown-form");
const targetInput = document.querySelector("#target-date");
const statusMessage = document.querySelector("#status-message");
const targetImageInput = document.querySelector("#target-image");
const imagePreview = document.querySelector("#image-preview");
const previewImage = document.querySelector("#preview-image");
const previewCaption = document.querySelector("#preview-caption");
const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

const pad = (value) => String(value).padStart(2, "0");
const toLocalInputValue = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
};

let targetTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
let previewImageUrl = "";
targetInput.value = toLocalInputValue(targetTime);

function renderCountdown() {
  const distance = targetTime.getTime() - Date.now();

  if (distance <= 0) {
    units.days.textContent = "00";
    units.hours.textContent = "00";
    units.minutes.textContent = "00";
    units.seconds.textContent = "00";
    statusMessage.textContent = "倒数结束，愿望抵达！";
    return;
  }

  const secondsTotal = Math.floor(distance / 1000);
  const days = Math.floor(secondsTotal / 86_400);
  const hours = Math.floor((secondsTotal % 86_400) / 3_600);
  const minutes = Math.floor((secondsTotal % 3_600) / 60);
  const seconds = secondsTotal % 60;

  units.days.textContent = pad(days);
  units.hours.textContent = pad(hours);
  units.minutes.textContent = pad(minutes);
  units.seconds.textContent = pad(seconds);
}

targetImageInput.addEventListener("change", () => {
  const [file] = targetImageInput.files;

  if (previewImageUrl) {
    URL.revokeObjectURL(previewImageUrl);
    previewImageUrl = "";
  }

  if (!file) {
    imagePreview.hidden = true;
    previewImage.removeAttribute("src");
    previewCaption.textContent = "目标图片已添加";
    return;
  }

  previewImageUrl = URL.createObjectURL(file);
  previewImage.src = previewImageUrl;
  previewImage.alt = `${file.name} 目标图片预览`;
  previewCaption.textContent = file.name;
  imagePreview.hidden = false;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const selectedDate = new Date(targetInput.value);

  if (Number.isNaN(selectedDate.getTime())) {
    statusMessage.textContent = "请选择有效的日期与时间。";
    return;
  }

  targetTime = selectedDate;
  statusMessage.textContent = selectedDate > new Date()
    ? "新的目标已锁定，倒数开始。"
    : "这个时间已经过去，请选择未来的时刻。";
  renderCountdown();
});

renderCountdown();
setInterval(renderCountdown, 1000);
