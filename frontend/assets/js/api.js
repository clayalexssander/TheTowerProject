const API_URL = 'http://localhost:3000/api';

export async function login(usuario, senha){
    try{

        const resposta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ usuario, senha})
        });

        return await resposta.json();
    }catch (error){
        console.error('Erro na coneção com o servidor:', error);
        return {success: false, message: 'Erro ao conectar com o servidor'}
    }
}
