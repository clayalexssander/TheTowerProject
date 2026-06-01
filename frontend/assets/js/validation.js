(function () {
    const user = localStorage.getItem("user");
    if (!user) {
        // Redireciona para o login caso a sessão não exista
        window.location.href = "../index.html";
    }
})();
