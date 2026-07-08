let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;

    const botao = document.getElementById("btnInstalar");

    if(botao){
        botao.style.display = "flex";
    }

});

async function instalarAplicativo(){
    if(!deferredPrompt){
        return;
    }

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;

}