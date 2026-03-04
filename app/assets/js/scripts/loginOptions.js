const loginOptionsCancelContainer = document.getElementById('loginOptionCancelContainer')
const loginOptionMicrosoft        = document.getElementById('loginOptionMicrosoft')
const loginOptionMojang           = document.getElementById('loginOptionMojang')
const loginOptionOffline          = document.getElementById('loginOptionOffline')
const loginOptionsCancelButton    = document.getElementById('loginOptionCancelButton')

// Painel offline
const loginOptionsPanelMain       = document.getElementById('loginOptionsPanelMain')
const loginOptionsPanelOffline    = document.getElementById('loginOptionsPanelOffline')
const offlineUsernameInput        = document.getElementById('offlineUsernameInput')
const offlineUsernameError        = document.getElementById('offlineUsernameError')
const offlineConfirmButton        = document.getElementById('offlineConfirmButton')
const offlineBackButton           = document.getElementById('offlineBackButton')

let loginOptionsCancellable = false

let loginOptionsViewOnLoginSuccess
let loginOptionsViewOnLoginCancel
let loginOptionsViewOnCancel
let loginOptionsViewCancelHandler

function loginOptionsCancelEnabled(val){
    if(val){
        $(loginOptionsCancelContainer).show()
    } else {
        $(loginOptionsCancelContainer).hide()
    }
}

// ── MOSTRAR PAINEL OFFLINE ──
function showOfflinePanel() {
    loginOptionsPanelMain.style.display = 'none'
    loginOptionsPanelOffline.style.display = 'block'
    offlineUsernameInput.value = ''
    offlineUsernameError.style.display = 'none'
    offlineUsernameInput.focus()
}

// ── ESCONDER PAINEL OFFLINE ──
function hideOfflinePanel() {
    loginOptionsPanelOffline.style.display = 'none'
    loginOptionsPanelMain.style.display = 'block'
}

// ── LOGIN MICROSOFT ──
loginOptionMicrosoft.onclick = (e) => {
    switchView(getCurrentView(), VIEWS.waiting, 500, 500, () => {
        ipcRenderer.send(
            MSFT_OPCODE.OPEN_LOGIN,
            loginOptionsViewOnLoginSuccess,
            loginOptionsViewOnLoginCancel
        )
    })
}

// ── LOGIN MOJANG ──
loginOptionMojang.onclick = (e) => {
    switchView(getCurrentView(), VIEWS.login, 500, 500, () => {
        loginViewOnSuccess = loginOptionsViewOnLoginSuccess
        loginViewOnCancel = loginOptionsViewOnLoginCancel
        loginCancelEnabled(true)
    })
}

// ── BOTÃO JOGAR OFFLINE — abre o painel ──
loginOptionOffline.onclick = (e) => {
    showOfflinePanel()
}

// ── BOTÃO VOLTAR ──
offlineBackButton.onclick = (e) => {
    hideOfflinePanel()
}

// ── BOTÃO ENTRAR ──
offlineConfirmButton.onclick = (e) => {
    const username = offlineUsernameInput.value.trim()

    if(!username || !/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
        offlineUsernameError.style.display = 'block'
        offlineUsernameInput.focus()
        return
    }

    offlineUsernameError.style.display = 'none'

    // Cria conta offline e vai para a tela principal
    const authAcc = AuthManager.addOfflineAccount(username)
    updateSelectedAccount(authAcc)
    hideOfflinePanel()
    switchView(getCurrentView(), loginOptionsViewOnLoginSuccess)
}

// Também confirma com Enter no input
offlineUsernameInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') {
        offlineConfirmButton.click()
    }
})

// ── CANCELAR ──
loginOptionsCancelButton.onclick = (e) => {
    hideOfflinePanel()
    switchView(getCurrentView(), loginOptionsViewOnCancel, 500, 500, () => {
        loginUsername.value = ''
        loginPassword.value = ''
        if(loginOptionsViewCancelHandler != null){
            loginOptionsViewCancelHandler()
            loginOptionsViewCancelHandler = null
        }
    })
}