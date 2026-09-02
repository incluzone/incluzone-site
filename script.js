var randomX, randomY
var srcImages = [
    "assets/images/pcd-icon.webp",
    "assets/images/gestante-icon.webp",
    "assets/images/idoso-icon.webp",
    "assets/images/autista-icon.webp"
]

for (let i = 0; i < 20; i++) {
    var img = document.createElement("img")
    const index = Math.floor(i / 5);
    img.src = srcImages[index]
    img.classList.add("icons")
    document.body.appendChild(img)
}

const icons = document.querySelectorAll(".icons")

icons.forEach(icon => {
    setInterval(() => {
        icon.style.opacity = 0
        setTimeout(() => {
            randomX = Math.round(Math.random() * window.innerWidth)
            randomY = Math.round(Math.random() * window.innerHeight)
            icon.style.top = `${randomY - 50}px`
            icon.style.left = `${randomX - 50}px`
            icon.style.opacity = 1
        }, 250);
    }, 2000);
})