// arquivo como module
const API_BASE = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';

const tipoAulaEl = document.getElementById('tipoAula');
const boxBook = document.getElementById('boxBook');
const selectBook = document.getElementById('selectBook');
const tituloAula = document.getElementById('tituloAula');
const form = document.getElementById('formCadastra');
const msgEl = document.getElementById('msg');
const pdfInput = document.getElementById('pdfMaterial');

function showMsg(text, type='success'){
  msgEl.textContent = text;
  msgEl.className = 'msg ' + (type==='success' ? 'success' : 'error');
  msgEl.style.display = 'block';
  setTimeout(()=>{ msgEl.style.display = 'none'; }, 100000);
}

async function carregarBooks(){
  try{
    const res = await fetch(`${API_BASE}/cadastra-material/books`);
    if(!res.ok) throw new Error('Erro ao carregar books');

    const books = await res.json();

    selectBook.innerHTML = `<option value="">Selecione um book...</option>` +
      books.map(b => `
        <option value="${b.id_book}" data-nome_pasta="${b.nome_pasta}">
          Book ${b.numero_book}
        </option>`
      ).join('');

  }catch(e){
    selectBook.innerHTML = `<option value="">(erro ao carregar)</option>`;
    console.error(e);
  }
}

tipoAulaEl.addEventListener('change', (e)=>{
  const value = e.target.value;

  if(value === 'Lesson'){
    boxBook.style.display = 'block';
    tituloAula.type = 'number';
    tituloAula.placeholder = 'Número da lesson (ex: 32)';
    carregarBooks();
  } else {
    boxBook.style.display = 'none';
    tituloAula.type = 'text';
    tituloAula.placeholder = 'Título da aula (ex: The Lost Princess)';
  }
});

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const confirmar = confirm("Tem certeza que deseja cadastrar esse material?");
  if (!confirmar) return;

  const tipoAula = tipoAulaEl.value;
   if(!tipoAula){ showMsg('Escolha o tipo de aula.', 'error'); return; }

  const file = pdfInput.files[0];
  if(!file){ showMsg('Selecione um arquivo PDF.', 'error'); return; }
  if(file.type !== 'application/pdf'){
    showMsg('Apenas arquivos PDF são permitidos.', 'error');
    return;
  }

  const formData = new FormData();
 

  let nomePasta = "";

  if(tipoAula === "FaryTale"){
    nomePasta = "fairy_tales";
   formData.append('titulo', tituloAula.value);

  }
  else if(tipoAula === "Debate"){
    nomePasta = "debates";
    formData.append('titulo', tituloAula.value);

  }
  else if(tipoAula === "Lesson"){
    const idBook = selectBook.value;
    const numeroLesson = tituloAula.value;
    const bookOption = selectBook.selectedOptions[0];
    const nomePastaBook = bookOption.dataset.nome_pasta;

    if(!idBook){
      showMsg("Selecione o book da lesson.", "error");
      return;
    }

    if(!numeroLesson){
      showMsg("Informe o número da lesson.", "error");
      return;
    }

    nomePasta = `${nomePastaBook}`;
     formData.append('id_book', idBook);
    formData.append('numero_lesson', numeroLesson);
    formData.append('titulo', "");

  } else {
    showMsg("Tipo de aula inválido.", "error");
    return;
  }

   formData.append('nome_pasta', nomePasta);
   formData.append('pdf', file); 
   formData.append('tipo_aula', tipoAula); 

   try{
    showMsg('Enviando... Aguarde.');

    const res = await fetch(`${API_BASE}/cadastra-material`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if(!res.ok){
      showMsg(data.mensagem || 'Erro no envio', 'error');
      return;
    }

    if(data.resultado === 1){
      showMsg('Material cadastrado com sucesso!', 'success');
      form.reset();
      boxBook.style.display = 'none';
    } else {
      showMsg(data.mensagem || 'Não foi possível cadastrar.', 'error');
    }

  }catch(err){
    console.error(err);
    showMsg('Erro inesperado ao enviar.', 'error');
  }
});


function irPara(pagina){
    window.location.href = pagina;
}
