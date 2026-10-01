const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches

/* ---------- ÍCONES: aparecem, ficam um tempo e somem para reaparecer em outro lugar ---------- */
const srcImages = [
    "assets/images/pcd-icon.webp",
    "assets/images/gestante-icon.webp",
    "assets/images/idoso-icon.webp",
    "assets/images/autista-icon.webp"
]

const layer = document.getElementById("icons-layer")
const small = window.innerWidth < 600
const perGroup = small ? 5 : 10            // menos ícones no celular, para não poluir
const minSize = small ? 32 : 40
const maxSize = small ? 56 : 76

const rand = (min, max) => min + Math.random() * (max - min)

function showIcon(icon) {
    const fade = rand(0.7, 1.6)           // velocidade da transição de opacidade
    const hold = rand(1000, 2500)        // tempo visível

    // novo lugar, tamanho e intensidade a cada aparição
    icon.style.left = `${rand(2, 90)}%`
    icon.style.top = `${rand(2, 90)}%`
    icon.style.width = `${rand(minSize, maxSize)}px`
    icon.style.setProperty("--fade", `${fade}s`)

    // dois frames para a transição de entrada ser aplicada
    requestAnimationFrame(() => requestAnimationFrame(() => icon.classList.add("on")))

    if (reduceMotion) return              // sem animação: fica parado

    setTimeout(() => {
        icon.classList.remove("on")
        // espera o fade-out terminar antes de mudar de posição
        setTimeout(() => showIcon(icon), fade * 1000 + rand(200, 1200))
    }, fade * 1000 + hold)
}

srcImages.forEach(src => {
    for (let i = 0; i < perGroup; i++) {
        const img = document.createElement("img")
        img.src = src
        img.alt = ""
        img.classList.add("icons")
        layer.appendChild(img)

        // início escalonado, para não aparecerem todos juntos
        setTimeout(() => showIcon(img), rand(0, 3000))
    }
})

/* ---------- AVISO AO CLICAR EM "INSTALAR APP" (APK só instala no Android) ---------- */
const installBtn = document.getElementById("install")
const dialog = document.getElementById("dialog-instalar")
const dialogTitulo = document.getElementById("dialog-titulo")
const dialogTexto = document.getElementById("dialog-texto")

const ua = navigator.userAgent
let isAndroid = /Android/i.test(ua)
// iPadOS se identifica como Mac, por isso a checagem de toque
let isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

const mensagens = {
    ios: {
        titulo: "Disponível apenas para Android",
        texto: "O IncluZone é distribuído como arquivo APK, que não pode ser instalado em iPhone ou iPad. Acesse este site em um celular Android para baixar o app."
    },
    desktop: {
        titulo: "Abra no seu celular Android",
        texto: "O arquivo APK só pode ser instalado em celulares Android, então não dá para baixar o app pelo computador. Acesse este site pelo seu celular Android para instalar."
    }
}

installBtn.addEventListener("click", e => {
    if (isAndroid) return                 // Android: o download acontece normalmente

    e.preventDefault()
    const m = isIOS ? mensagens.ios : mensagens.desktop
    dialogTitulo.textContent = m.titulo
    dialogTexto.textContent = m.texto
    dialog.showModal()
})

// clicar fora da caixa (no fundo escurecido) também fecha
dialog.addEventListener("click", e => {
    if (e.target === dialog) dialog.close()
})

/* ---------- E-MAIL: Gmail web no computador, app de e-mail no celular ---------- */
const emailLink = document.getElementById("email-link")
const emailSuporte = "incluzoneapp+suporte@gmail.com"

// iPadOS se identifica como Mac, por isso a checagem de toque
const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

if (!isMobile) {
    emailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailSuporte)}`
    emailLink.target = "_blank"
    emailLink.rel = "noopener"
}