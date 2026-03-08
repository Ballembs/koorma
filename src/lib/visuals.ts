export function showSuccessAnimation(type: "check" | "stars" = "stars") {
  if (typeof window === "undefined") return;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";

  if (type === "check") {
    container.innerHTML = `<div style="font-size: 150px; animation: popInFadeOut 1.5s ease-out forwards; text-shadow: 0 0 40px rgba(76, 175, 80, 0.5);">✅</div>`;
  } else {
    container.innerHTML = `<div style="font-size: 150px; animation: popInFadeOut 1.5s ease-out forwards; text-shadow: 0 0 40px rgba(255, 193, 7, 0.5);">✨⭐✨</div>`;
  }

  if (!document.getElementById("success-anim-styles")) {
    const style = document.createElement("style");
    style.id = "success-anim-styles";
    style.innerHTML = `
      @keyframes popInFadeOut {
        0% { transform: scale(0.5); opacity: 0; }
        20% { transform: scale(1.2); opacity: 1; }
        40% { transform: scale(1); opacity: 1; }
        80% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(container);

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 1500);
}
