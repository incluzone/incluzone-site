document.documentElement.classList.add("js")

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

/* ---------- FADE IN AO ROLAR (títulos, textos e conjunto do celular) ---------- */
const revealEls = document.querySelectorAll(".reveal")

if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            entry.target.classList.add("visible")
            obs.unobserve(entry.target)
        })
    }, { threshold: 0.15 })
    revealEls.forEach(el => io.observe(el))
} else {
    revealEls.forEach(el => el.classList.add("visible"))
}

/* ---------- CELULAR NO CANVAS: o scroll escolhe o frame ---------- */
/*
  Dois conjuntos de frames: computador (horizontal) e celular (vertical).
  TESTE: fotos aleatórias. PRODUÇÃO: troque count e url pelos seus WebP, por exemplo:
    desktop: { count: 72, url: i => `assets/frames/desktop/frame-${String(i + 1).padStart(3, "0")}.webp` }
    mobile:  { count: 72, url: i => `assets/frames/mobile/frame-${String(i + 1).padStart(3, "0")}.webp` }
*/
const SETS = {
    desktop: { count: 10, url: i => `https://picsum.photos/id/${10 + i}/960/540` },
    mobile: { count: 420, url: i => `assets/video-portrait/frame-${String(i + 1).padStart(3, "0")}.webp` }
}

const mqMobile = matchMedia("(max-width: 699px)")   // mesmo ponto de corte do CSS

const showcase = document.getElementById("showcase")
const canvas = document.getElementById("phone-canvas")
const ctx = canvas.getContext("2d")
const phrases = [document.getElementById("frase-1"), document.getElementById("frase-2")]

let FRAME_COUNT = 0
let frames = []
let wantFrame = 0
let ticking = false
let loadToken = 0

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// sobe de 0 a 1 entre a e b, fica em 1 até c e desce a 0 em d
const seg = (p, a, b, c, d) => {
    if (p <= a || p >= d) return 0
    if (p < b) return (p - a) / (b - a)
    if (p <= c) return 1
    return (d - p) / (d - c)
}

function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(canvas.clientWidth * dpr)
    const h = Math.round(canvas.clientHeight * dpr)
    if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
    }
}

// desenha o frame pedido (ou o mais próximo já carregado), inteiro e centralizado ("contain")
function draw(idx) {
    let img = null
    for (let d = 0; d < FRAME_COUNT && !img; d++) {
        img = frames[idx - d] || frames[idx + d] || null
    }
    if (!img) return

    sizeCanvas()
    const cw = canvas.width
    const ch = canvas.height
    if (!cw || !ch) return

    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale

    ctx.clearRect(0, 0, cw, ch)    // necessário para manter a transparência
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}

function update() {
    ticking = false
    const rect = showcase.getBoundingClientRect()
    const total = rect.height - window.innerHeight
    const p = clamp(-rect.top / total, 0, 1)

    wantFrame = Math.round(p * (FRAME_COUNT - 1))
    draw(wantFrame)

    // 1ª frase com o celular à direita, 2ª com o celular à esquerda
    const o1 = seg(p, 0.16, 0.28, 0.42, 0.50)
    const o2 = seg(p, 0.52, 0.64, 0.78, 0.88)
    ;[o1, o2].forEach((o, i) => {
        phrases[i].style.setProperty("--o", o.toFixed(3))
        phrases[i].style.setProperty("--t", `${((1 - o) * 24).toFixed(1)}px`)
    })
}

function requestUpdate() {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
}

// carrega o conjunto certo para o tamanho de tela (e recarrega se a tela cruzar o ponto de corte)
function loadFrames() {
    const set = mqMobile.matches ? SETS.mobile : SETS.desktop
    const token = ++loadToken            // ignora respostas de um conjunto antigo
    FRAME_COUNT = set.count
    frames = new Array(FRAME_COUNT).fill(null)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image()
        img.decoding = "async"
        img.onload = () => {
            if (token !== loadToken) return
            frames[i] = img
            draw(wantFrame)
        }
        img.src = set.url(i)
    }
    requestUpdate()
}

window.addEventListener("scroll", requestUpdate, { passive: true })
window.addEventListener("resize", requestUpdate)
mqMobile.addEventListener("change", loadFrames)
loadFrames()

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

