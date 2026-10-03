document.documentElement.classList.add("js")

const root = document.documentElement
const ler = k => { try { return localStorage.getItem(k) } catch { return null } }
const guardar = (k, v) => { try { localStorage.setItem(k, v) } catch { } }

let fonte = Number(ler("iz-fonte"))            // 1 = normal; 2 e 3 = maiores
if (![1, 2, 3].includes(fonte)) fonte = 1
const salvo = ler("iz-lite")
let lite = salvo === null ? matchMedia("(prefers-reduced-motion: reduce)").matches : salvo === "1"
root.dataset.fonte = fonte
root.classList.toggle("lite", lite)
if (lite) root.classList.add("entrou")   // abriu já pausado: nunca verá a entrada animar depois

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

const icons = []
let iconGen = 0        // muda a cada (re)início, para encerrar os ciclos antigos

function placeIcon(icon) {
    icon.style.left = `${rand(2, 90)}%`
    icon.style.top = `${rand(2, 90)}%`
    icon.style.width = `${rand(minSize, maxSize)}px`
}

function showIcon(icon, gen) {
    if (gen !== iconGen) return
    const fade = rand(0.7, 1.6)
    const hold = rand(1000, 2500)
    placeIcon(icon)
    icon.style.setProperty("--fade", `${fade}s`)
    requestAnimationFrame(() => requestAnimationFrame(() => icon.classList.add("on")))
    setTimeout(() => {
        if (gen !== iconGen) return
        icon.classList.remove("on")
        setTimeout(() => showIcon(icon, gen), fade * 1000 + rand(200, 1200))
    }, fade * 1000 + hold)
}

srcImages.forEach(src => {
    for (let i = 0; i < perGroup; i++) {
        const img = document.createElement("img")
        img.src = src
        img.alt = ""
        img.classList.add("icons")
        layer.appendChild(img)
        icons.push(img)
    }
})

// retoma um ícone que estava visível e parado: ele some depois de um tempo aleatório e volta ao ciclo
function resumeIcon(icon, gen) {
    const fade = parseFloat(icon.style.getPropertyValue("--fade")) || 1
    setTimeout(() => {
        if (gen !== iconGen) return
        icon.classList.remove("on")
        setTimeout(() => showIcon(icon, gen), fade * 1000 + rand(200, 1200))
    }, rand(300, 2500))
}

function startIcons() {
    const gen = ++iconGen
    icons.forEach(icon => {
        if (lite) {
            if (!icon.style.left) placeIcon(icon)
            const atraso = icon.classList.contains("on") ? 0 : rand(50, 1200)
            setTimeout(() => {
                if (gen !== iconGen) return
                icon.classList.add("on")
            }, atraso)
        } else if (icon.classList.contains("on")) {
            resumeIcon(icon, gen)                          // visível: continua e some aos poucos
        } else {
            setTimeout(() => showIcon(icon, gen), rand(0, 3000))
        }
    })
}
startIcons()
document.addEventListener("iz-lite", startIcons)

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

const SETS = {
    desktop: {
        count: 480,
        dups: [[61, 62], [63, 64], [65, 66], [67, 68], [69, 70], [71, 72], [73, 74], [75, 76], [77, 78], [79, 80], [81, 82], [83, 84], [85, 86], [87, 88], [89, 90], [91, 92], [93, 94], [95, 96], [97, 98], [99, 100], [101, 102], [103, 104], [105, 106], [107, 108], [109, 110], [111, 112], [113, 114], [115, 116], [117, 118], [119, 120], [121, 122], [123, 124], [125, 126], [127, 128], [129, 130], [131, 132], [133, 134], [135, 136], [137, 138], [139, 140], [141, 142], [143, 144], [145, 146], [147, 148], [149, 150], [151, 152], [153, 154], [155, 156], [157, 158], [159, 160], [161, 162], [163, 164], [165, 166], [167, 168], [169, 170], [171, 172], [173, 174], [175, 176], [177, 178], [179, 180], [181, 182], [183, 184], [185, 186], [187, 188], [189, 190], [191, 192], [193, 194], [195, 196], [197, 198], [199, 200], [201, 202], [203, 204], [205, 206], [207, 208], [209, 210], [273, 274], [275, 276], [277, 278], [279, 280], [281, 282], [283, 284], [285, 286], [287, 288], [289, 290], [291, 292], [293, 294], [295, 296], [297, 298], [299, 300], [301, 302], [303, 304], [305, 306], [307, 308], [309, 310], [311, 312], [313, 314], [315, 316], [317, 318], [319, 320], [321, 322], [323, 324], [325, 326], [327, 328], [329, 330], [331, 332], [333, 334], [335, 336], [337, 338], [339, 340], [341, 342], [343, 344], [345, 346], [347, 348], [349, 350], [351, 352], [353, 354], [355, 356], [357, 358], [359, 360], [361, 362], [363, 364], [365, 366], [367, 368], [369, 370], [371, 372], [373, 374], [375, 376], [377, 378], [379, 380], [381, 384], [385, 386], [387, 388], [389, 390], [391, 421]],
        url: i => `assets/video-landscape/frame-${String(i + 1).padStart(3, "0")}.webp`
    },
    mobile: {
        count: 420,
        dups: [[63, 64], [65, 67], [69, 70], [71, 72], [74, 75], [77, 78], [80, 83], [84, 86], [88, 89], [90, 92], [93, 95], [96, 98], [99, 102], [103, 105], [106, 108], [109, 110], [111, 113], [114, 116], [117, 119], [120, 121], [123, 124], [126, 127], [129, 130], [131, 132], [134, 135], [137, 138], [139, 140], [142, 143], [145, 146], [148, 149], [150, 151], [152, 154], [156, 157], [159, 162], [164, 165], [167, 168], [169, 170], [172, 173], [175, 176], [249, 250], [251, 252], [254, 255], [257, 258], [259, 260], [262, 263], [265, 268], [270, 271], [273, 274], [276, 277], [278, 279], [281, 282], [284, 285], [287, 288], [289, 290], [291, 293], [295, 296], [297, 298], [299, 301], [302, 304], [305, 307], [308, 309], [311, 312], [313, 315], [316, 318], [319, 321], [322, 324], [325, 328], [329, 331], [332, 334], [335, 337], [338, 339], [341, 342], [344, 345], [346, 347], [349, 350], [352, 353], [354, 356], [357, 359], [360, 361]],
        url: i => `assets/video-portrait/frame-${String(i + 1).padStart(3, "0")}.webp`
    }
}

const mqMobile = matchMedia("(max-width: 699px)")   // mesmo ponto de corte do CSS

const showcase = document.getElementById("showcase")
const canvas = document.getElementById("phone-canvas")
const ctx = canvas.getContext("2d")
const phrases = [document.getElementById("frase-1"), document.getElementById("frase-2")]

let FRAME_COUNT = 0
let frames = []
let rep = []
let loadedKey = ""
let wantFrame = 0
let ticking = false
let loadToken = 0

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const FRAME_FIXO = 0.3   // ponto do vídeo (0 a 1) em que a 1ª frase aparece inteira
const semAnimacao = () => document.documentElement.classList.contains("lite")

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
    idx = rep[idx] ?? idx          // frames repetidos usam o frame mantido do trecho
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
    const p = semAnimacao() ? FRAME_FIXO : clamp(-rect.top / total, 0, 1)

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
    const key = mqMobile.matches ? "mobile" : "desktop"
    const set = SETS[key]
    const token = ++loadToken
    FRAME_COUNT = set.count

    // só descarta os frames se o conjunto mudou (desktop <-> celular)
    if (key !== loadedKey) {
        frames = new Array(FRAME_COUNT).fill(null)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        loadedKey = key
    }

    // rep: todo frame de um trecho repetido aponta para o primeiro do trecho
    rep = Array.from({ length: FRAME_COUNT }, (_, i) => i)
    for (const [a, b] of set.dups || []) {
        for (let n = a; n <= b; n++) rep[n - 1] = a - 1
    }

    // frame correspondente à posição atual da rolagem
    let want = Math.round(FRAME_FIXO * (FRAME_COUNT - 1))
    if (!semAnimacao()) {
        const rect = showcase.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        want = Math.round(clamp(-rect.top / total, 0, 1) * (FRAME_COUNT - 1))
    }
    wantFrame = want

    const order = []
    const seen = new Set()
    const add = i => {
        if (!(i >= 0 && i < FRAME_COUNT)) return              // barra undefined, NaN e fora do intervalo
        if (rep[i] !== i || seen.has(i) || frames[i]) return   // pula repetidos e já carregados
        seen.add(i)
        order.push(i)
    }

    if (semAnimacao()) {
        add(rep[want])                       // só o frame fixo, sem baixar o resto
    } else {
        // 1º: os frames ao redor de onde o usuário está, do mais perto para o mais longe
        for (let d = 0; d <= 30; d++) { add(rep[want - d]); add(rep[want + d]) }
        // depois: 1 a cada 24, 8, 2 e por fim todos
        for (const step of [24, 8, 2, 1]) {
            for (let i = 0; i < FRAME_COUNT; i += step) add(i)
        }
        add(rep[FRAME_COUNT - 1])
    }

    let next = 0
    const MAX_PARALLEL = 6

    function loadNext() {
        if (token !== loadToken || next >= order.length) return
        const i = order[next++]

        const img = new Image()
        img.decoding = "async"
        img.onload = () => {
            if (token !== loadToken) return
            frames[i] = img
            draw(wantFrame)
            loadNext()
        }
        img.onerror = () => loadNext()
        img.src = set.url(i)
    }

    for (let k = 0; k < MAX_PARALLEL; k++) loadNext()
    draw(wantFrame)          // já desenha com o que existe, sem esperar a rede
    requestUpdate()
}

window.addEventListener("scroll", requestUpdate, { passive: true })
window.addEventListener("resize", requestUpdate)
mqMobile.addEventListener("change", loadFrames)
document.addEventListener("iz-lite", loadFrames)
if (document.readyState === "complete") loadFrames()
else window.addEventListener("load", loadFrames, { once: true })

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

/* ---------- INSTAGRAM: app no celular, web no computador (ou sem o app) ---------- */
const instagramLink = document.getElementById("instagram-link")
const instaUser = "incluzone.tcc"
const instaWeb = `https://www.instagram.com/${instaUser}/`

if (isAndroid) {
    // intent:// abre o app; se não estiver instalado, o Android vai para o browser_fallback_url
    instagramLink.href =
        `intent://instagram.com/_u/${instaUser}#Intent;package=com.instagram.android;scheme=https;` +
        `S.browser_fallback_url=${encodeURIComponent(instaWeb)};end`
    instagramLink.removeAttribute("target")
    instagramLink.removeAttribute("rel")
} else if (isIOS) {
    // o iOS não tem fallback nativo: tenta abrir o app e, se a página continuar visível, vai para a web
    instagramLink.addEventListener("click", e => {
        e.preventDefault()
        let leftPage = false
        const onVisibility = () => { if (document.hidden) leftPage = true }
        document.addEventListener("visibilitychange", onVisibility)

        window.location.href = `instagram://user?username=${instaUser}`

        setTimeout(() => {
            document.removeEventListener("visibilitychange", onVisibility)
            if (!leftPage) window.location.href = instaWeb
        }, 1500)
    })
}
// computador: mantém o href padrão (web, em nova aba)

/* ---------- SCROLLBAR CUSTOM (mouse: sempre visível; toque: aparece ao rolar e some) ---------- */
{
    const root = document.documentElement
    const bar = document.createElement("div")
    const thumb = document.createElement("div")
    bar.id = "scrollbar"
    thumb.id = "scrollbar-thumb"
    bar.setAttribute("aria-hidden", "true")
    bar.appendChild(thumb)
    document.body.appendChild(bar)
    root.classList.add("custom-scroll")

    const MIN_THUMB = 40
    const HIDE_DELAY = 500      // ms parado até sumir (só tem efeito no toque)
    let thumbH = 0
    let dragging = false
    let startY = 0
    let startScroll = 0
    let hideTimer = 0

    function showBar() {
        bar.classList.add("active")
        clearTimeout(hideTimer)
        if (!dragging) hideTimer = setTimeout(() => bar.classList.remove("active"), HIDE_DELAY)
    }

    function updateBar() {
        const view = root.clientHeight
        const total = root.scrollHeight
        if (total <= view) { bar.style.display = "none"; return }
        bar.style.display = ""

        const track = bar.clientHeight
        const max = total - view
        thumbH = Math.max(MIN_THUMB, (track * view) / total)
        // clamp: o "efeito elástico" do iOS passa do limite e não pode jogar a barra para fora
        const top = clamp(root.scrollTop / max, 0, 1) * (track - thumbH)
        thumb.style.height = `${thumbH}px`
        thumb.style.transform = `translateY(${top}px)`
    }

    thumb.addEventListener("pointerdown", e => {
        dragging = true
        startY = e.clientY
        startScroll = root.scrollTop
        thumb.setPointerCapture(e.pointerId)
        thumb.classList.add("dragging")
        root.style.scrollBehavior = "auto"     // sem "smooth" durante o arraste
        showBar()
    })

    thumb.addEventListener("pointermove", e => {
        if (!dragging) return
        const track = bar.clientHeight
        const ratio = (root.scrollHeight - root.clientHeight) / (track - thumbH)
        root.scrollTop = startScroll + (e.clientY - startY) * ratio
    })

    const stopDrag = () => {
        if (!dragging) return
        dragging = false
        thumb.classList.remove("dragging")
        root.style.scrollBehavior = ""
        showBar()                               // reinicia a contagem para sumir
    }
    thumb.addEventListener("pointerup", stopDrag)
    thumb.addEventListener("pointercancel", stopDrag)

    window.addEventListener("scroll", () => { updateBar(); showBar() }, { passive: true })
    window.addEventListener("resize", updateBar)
    new ResizeObserver(updateBar).observe(document.body)   // conteúdo que muda de altura
    updateBar()
}

/* ---------- VOLTAR AO TOPO: rolagem suave com garantia de chegar ao topo ---------- */
{
    const btn = document.querySelector(".voltar-topo")
    let checker = 0
    let fallback = 0

    btn.addEventListener("click", () => {
        clearInterval(checker)
        clearTimeout(fallback)

        window.scrollTo({ top: 0, behavior: "smooth" })

        let last = -1
        checker = setInterval(() => {
            const y = window.scrollY
            if (y === 0) { clearInterval(checker); clearTimeout(fallback); return }
            if (y === last) {                       // parou antes de chegar ao topo
                clearInterval(checker)
                clearTimeout(fallback)
                window.scrollTo({ top: 0, behavior: "instant" })
            }
            last = y
        }, 250)

        // segurança: se por algum motivo ainda não chegou, força o topo
        fallback = setTimeout(() => {
            clearInterval(checker)
            if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "instant" })
        }, 4000)
    })
}

/* ---------- mantém o que o usuário está lendo no mesmo lugar da tela ---------- */
function preservarPosicao(mudanca) {
    const candidatos = document.querySelectorAll(".intro, .showcase, .sobre .content > *, footer")
    let ancora = null
    for (const el of candidatos) {
        if (el.getBoundingClientRect().bottom > 1) { ancora = el; break }   // 1º elemento visível no topo
    }

    // saindo da seção da animação (a base dela está na tela): ancora no texto logo abaixo,
    // senão a seção cresce e o usuário cai no meio dos frames
    if (ancora === showcase && showcase.getBoundingClientRect().bottom <= window.innerHeight) {
        ancora = document.getElementById("sobre")
    }

    const antes = ancora ? ancora.getBoundingClientRect().top : 0
    mudanca()
    if (!ancora) return

    // a seção da animação pode encolher: não deixa o alvo cair fora dela
    const desejado = ancora === showcase
        ? Math.max(antes, -(ancora.offsetHeight - window.innerHeight))
        : antes

    const dif = ancora.getBoundingClientRect().top - desejado
    if (Math.abs(dif) > 1) window.scrollBy({ top: dif, behavior: "instant" })
}

/* marca como "já revelado" tudo que o usuário já viu (na tela ou acima dela) */
function marcarVistos() {
    revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visible")
    })
}

const NOMES = { 1: "normal", 2: "grande", 3: "muito grande" }
const SVG_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
const SVG_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'

const box = document.createElement("div")
box.className = "acess"
box.setAttribute("role", "group")
box.setAttribute("aria-label", "Ajustes de acessibilidade")
box.innerHTML = `
        <button type="button" aria-label="Diminuir o tamanho do texto">A-</button>
        <button type="button" class="forte" aria-label="Aumentar o tamanho do texto">A+</button>
        <button type="button"></button>
        <button type="button" class="forte menu" aria-expanded="false" aria-label="Abrir ajustes de acessibilidade">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path class="l1" d="M4 6h16"/><path class="l2" d="M4 12h16"/><path class="l3" d="M4 18h16"/></svg>
        </button>
        <span class="sr-only" role="status" aria-live="polite"></span>`
document.body.appendChild(box)
const [menos, mais, anim, menu, aviso] = box.children

function aplicar(msg) {
    root.dataset.fonte = fonte
    root.classList.toggle("lite", lite)
    menos.setAttribute("aria-disabled", fonte <= 1)
    mais.setAttribute("aria-disabled", fonte >= 3)

    const txt = lite ? "Reativar animações" : "Pausar animações"
    anim.innerHTML = lite ? SVG_PLAY : SVG_PAUSE
    anim.setAttribute("aria-label", txt)
    anim.title = txt
    if (msg) aviso.textContent = msg
}

function mudarFonte(d) {
    const novo = fonte + d
    if (novo < 1 || novo > 3) return
    preservarPosicao(() => {
        fonte = novo
        guardar("iz-fonte", fonte)
        aplicar(`Tamanho do texto: ${NOMES[fonte]}`)
    })
    window.dispatchEvent(new Event("resize"))     // o canvas se ajusta ao novo layout
}

menos.addEventListener("click", () => mudarFonte(-1))
mais.addEventListener("click", () => mudarFonte(1))

anim.addEventListener("click", () => {
    root.classList.add("entrou")
    if (lite) marcarVistos()     // vai dar play: o que já foi visto não anima de novo
    preservarPosicao(() => {
        lite = !lite
        guardar("iz-lite", lite ? "1" : "0")
        aplicar(lite ? "Animações pausadas" : "Animações ativadas")
    })
    document.dispatchEvent(new Event("iz-lite"))
})

function abrirMenu(abrir) {
    box.classList.toggle("aberto", abrir)
    menu.setAttribute("aria-expanded", abrir)
    menu.setAttribute("aria-label", abrir ? "Fechar ajustes de acessibilidade" : "Abrir ajustes de acessibilidade")
}
menu.addEventListener("click", () => abrirMenu(!box.classList.contains("aberto")))
document.addEventListener("click", e => { if (!box.contains(e.target)) abrirMenu(false) })   // toque fora fecha
document.addEventListener("keydown", e => { if (e.key === "Escape") abrirMenu(false) })

aplicar()