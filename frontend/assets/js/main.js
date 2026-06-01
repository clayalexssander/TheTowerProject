import { login } from './api.js';

const HOME_PAGE = window.location.port === '3000'
    ? './frontend/home.html'
    : 'http://localhost:3000/frontend/home.html';

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.port !== '3000') {
        window.location.replace('http://localhost:3000/index.html');
        return;
    }

    const form = document.getElementById("loginForm");
    const error = document.getElementById("loginError");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = form.username.value.trim();
        const senha = form.password.value.trim();

        if(!usuario || !senha) {
            error.textContent = "Preencha usuário e senha.";
            return;
        } 

        try{
            
            //verifica no back
            const result = await login(usuario, senha);


            if(result.success){
                localStorage.setItem("user", JSON.stringify({ usuario: usuario }));
                window.location.href = HOME_PAGE;
            }else{
                error.textContent = result.message || "Usuário ou senha incorretos.";
            }
        }catch (err){
            console.error("Erro ao conectar com o servidor!", err);
            error.textContent = "Erro de conexão com o servidor.";
        }
    });
});
