import { login } from './api.js';

document.addEventListener("DOMContentLoaded", () => {
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
                window.location.href = './frontend/home.html';
            }else{
                error.textContent = result.message || "Usuário ou senha incorretos.";
            }
        }catch (err){
            console.error("Erro ao conectar com o servidor!", err);
            error.textContent = "Erro de conexão com o servidor.";
        }
    });
});
