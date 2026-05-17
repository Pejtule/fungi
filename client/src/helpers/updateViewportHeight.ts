export function updateViewportHeight() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty("--vh", `${vh}px`)

  document.body.classList.toggle("short", window.innerHeight < 600)
  document.body.classList.toggle("normal", window.innerHeight >= 600 && window.innerHeight <= 900)
  document.body.classList.toggle("tall", window.innerHeight > 900)
}
