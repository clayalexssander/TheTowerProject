(function () {
    const API_URL = 'http://localhost:3000/api';
    const LOGIN_PAGE = '../index.html';
    const LOGOUT_BUTTON_ID = 'logoutButton';
    const LOGOUT_SELECTOR = '#btnLogout, [data-logout]';
    const LANGUAGE_SWITCHER_ID = 'languageSwitcher';
    const LANGUAGE_KEY = 'idiomaSite';
    const originalFetch = window.fetch.bind(window);
    const originalAlert = window.alert.bind(window);
    const originalConfirm = window.confirm.bind(window);
    const originalTextByNode = new WeakMap();
    const originalAttrsByElement = new WeakMap();
    let originalDocumentTitle = document.title;
    let translating = false;

    const TRANSLATIONS = {
        en: {
            'Home': 'Home',
            'Sair': 'Logout',
            'Sair do sistema': 'Logout',
            'Selecionar idioma': 'Choose language',
            'The Tower - Home': 'The Tower - Home',
            'The Tower - Turmas': 'The Tower - Classes',
            'The Tower - Estoque': 'The Tower - Stock',
            'Finanças - The Tower': 'Finances - The Tower',
            'FinanÃ§as - The Tower': 'Finances - The Tower',
            'Monitoramento - The Tower': 'Monitoring - The Tower',
            'the Tower - Pesquisa Alunos': 'The Tower - Student Search',
            'Suas aulas de hoje': 'Your classes today',
            'Nenhuma aula hoje 🎉': 'No classes today 🎉',
            'Erro ao carregar agenda.': 'Error loading schedule.',
            'Finanças': 'Finances',
            'FinanÃ§as': 'Finances',
            'Turmas': 'Classes',
            'Monitoramento': 'Monitoring',
            'Minitoramento': 'Monitoring',
            'Aulas Demonstrativas': 'Demo Classes',
            'Aulas Aulas Demonstrativas': 'Demo Classes',
            'Gerenciamento de Alunos': 'Student Management',
            'Gerenciameneto de Alunos': 'Student Management',
            'Biblioteca': 'Library',
            'Estoque': 'Stock',
            'Cadastro de Aulas': 'Class Registration',
            'Pesquisa Alunos': 'Student Search',
            '+ Matricular aluno': '+ Enroll student',
            'pesquisar aluno por nome': 'search student by name',
            'nome:': 'name:',
            'cidade:': 'city:',
            'data matricula:': 'enrollment date:',
            'Nível:': 'Level:',
            'ativo:': 'active:',
            'bolsista:': 'scholarship:',
            'Conta Bancária:': 'Bank Account:',
            'Conta BancÃ¡ria:': 'Bank Account:',
            'Telefone:': 'Phone:',
            'Total de aulas:': 'Total classes:',
            'Presentes:': 'Present:',
            'Faltas:': 'Absences:',
            'frequencia': 'attendance',
            'Historico:': 'History:',
            'Editar': 'Edit',
            'Editar Aluno': 'Edit Student',
            '*Nome:': '*Name:',
            '*Cidade:': '*City:',
            '*Tipo bancária:': '*Bank type:',
            '*Telefone:': '*Phone:',
            '*Email:': '*Email:',
            '*Nível:': '*Level:',
            '*Bolsista:': '*Scholarship:',
            '*Ativo:': '*Active:',
            '*Turma:': '*Class:',
            'Iniciante': 'Beginner',
            'Intermediário': 'Intermediate',
            'Avançado': 'Advanced',
            'Sim': 'Yes',
            'Não': 'No',
            'Cancelar': 'Cancel',
            'Salvar': 'Save',
            'Pesquisar turmas...': 'Search classes...',
            '+ Criar Nova Turma': '+ Create New Class',
            'Criar Turma': 'Create Class',
            'Nome da turma': 'Class name',
            'Professor': 'Teacher',
            'Dia da semana': 'Weekday',
            'Horário': 'Time',
            'Criar': 'Create',
            'Matricular Aluno': 'Enroll Student',
            'Controle de Estoque': 'Stock Control',
            'Materiais Didáticos': 'Teaching Materials',
            'Inserir Book': 'Add Book',
            'Controle de quantidade de books disponíveis': 'Control the quantity of available books',
            'Book': 'Book',
            'Descrição': 'Description',
            'Quantidade': 'Quantity',
            'Ações': 'Actions',
            'Total de Books': 'Total Books',
            'Books Disponíveis': 'Available Books',
            'Número do book': 'Book number',
            'Receita realizada (mês)': 'Actual Revenue (month)',
            'Receita realizada (mÃªs)': 'Actual Revenue (month)',
            'Receita projetada': 'Projected Revenue',
            'Alunos não bolsistas pendentes': 'Pending non-scholarship students',
            'Alunos nÃ£o bolsistas pendentes': 'Pending non-scholarship students',
            'Projeção de Receita - Mês atual': 'Revenue Projection - Current Month',
            'ProjeÃ§Ã£o de Receita - MÃªs atual': 'Revenue Projection - Current Month',
            'Tendência e Sazonalidade': 'Trend and Seasonality',
            'TendÃªncia e Sazonalidade': 'Trend and Seasonality',
            'LTV (valor por aluno)': 'LTV (value per student)',
            'Previsão próximos 3 meses': 'Next 3 Months Forecast',
            'PrevisÃ£o prÃ³ximos 3 meses': 'Next 3 Months Forecast',
            'Impacto bolsistas': 'Scholarship Impact',
            'Análise': 'Analysis',
            'Valor': 'Value',
            'Total alunos': 'Total students',
            'Total bolsistas': 'Total scholarship students',
            'Receita mensal atual': 'Current monthly revenue',
            'Impacto mensal': 'Monthly impact',
            'Alunos inadimplentes (maiores atrasos)': 'Overdue Students (largest delays)',
            'Carregando...': 'Loading...',
            'Registrar pagamento': 'Register payment',
            'Registrar Pagamento': 'Register Payment',
            'Fechar': 'Close',
            'email do aluno:': 'student email:',
            'Mensalidade:': 'Monthly fee:',
            'Confirmar pagamento': 'Confirm payment',
            'Atualizar dashboard': 'Refresh dashboard',
            'Visão geral de turmas e alunos — análises de frequência e retenção': 'Overview of classes and students — attendance and retention analysis',
            'VisÃ£o geral de turmas e alunos â€” anÃ¡lises de frequÃªncia e retenÃ§Ã£o': 'Overview of classes and students — attendance and retention analysis',
            'Total de Turmas': 'Total Classes',
            'Frequência Média': 'Average Attendance',
            'FrequÃªncia MÃ©dia': 'Average Attendance',
            'Alunos em Risco': 'Students at Risk',
            'Ranking de Turmas por Frequência': 'Class Ranking by Attendance',
            'Ranking de Turmas por FrequÃªncia': 'Class Ranking by Attendance',
            'Taxa de Retenção por Período': 'Retention Rate by Period',
            'Taxa de RetenÃ§Ã£o por PerÃ­odo': 'Retention Rate by Period',
            'Turmas que Precisam de Atenção': 'Classes Needing Attention',
            'Turmas que Precisam de AtenÃ§Ã£o': 'Classes Needing Attention',
            'Linha do Tempo de Saídas': 'Exit Timeline',
            'Linha do Tempo de SaÃ­das': 'Exit Timeline',
            'Selecionar Turma para Detalhes': 'Select Class for Details',
            'Alunos com Risco de Evasão (prioridade)': 'Students at Dropout Risk (priority)',
            'Alunos com Risco de EvasÃ£o (prioridade)': 'Students at Dropout Risk (priority)',
            'Selecionar turma...': 'Select class...',
            'Nenhuma turma': 'No class',
            'Erro ao carregar': 'Error loading',
            'Erro': 'Error',
            'Frequência Média (%)': 'Average Attendance (%)',
            'Taxa de Retenção': 'Retention Rate',
            'Frequência (%)': 'Attendance (%)',
            'Saídas': 'Exits',
            'Frequência Mensal (%)': 'Monthly Attendance (%)',
            'Nenhum aluno em risco crítico.': 'No students at critical risk.',
            'Aluno': 'Student',
            'Turma': 'Class',
            'Frequência': 'Attendance',
            'Status': 'Status',
            'Aulas Demonstrativas': 'Demo Classes',
            'Nenhuma aula demonstrativa marcada.': 'No demo class scheduled.',
            'Email:': 'Email:',
            'Data:': 'Date:',
            'Status:': 'Status:',
            'Confirmar Matrícula': 'Confirm Enrollment',
            'Autor:': 'Author:',
            'Gênero:': 'Genre:',
            'Nicho:': 'Niche:',
            'Número:': 'Number:',
            'Nenhum empréstimo em andamento.': 'No loans in progress.',
            'Nenhum livro disponível no momento.': 'No books available right now.',
            'Nenhum histórico de devoluções.': 'No return history.',
            'Nenhum livro encontrado.': 'No books found.',
            'presente': 'present',
            'Falta': 'Absent',
            'The Tower - Biblioteca': 'The Tower - Library',
            'The Tower - Criar Turma': 'The Tower - Create Class',
            'the Tower - Matricular Aluno': 'The Tower - Enroll Student',
            'The Tower - InformaÃ§Ãµes da turma': 'The Tower - Class Information',
            'The Tower - Aulas': 'The Tower - Lessons',
            'The Tower - Cadastrar Material': 'The Tower - Register Material',
            'Cadastrar Material': 'Register Material',
            'Cadastrar material': 'Register material',
            'Limpar campos': 'Clear fields',
            'Tipo de aula': 'Class type',
            'Selecione...': 'Select...',
            'Selecione': 'Select',
            'Carregando books...': 'Loading books...',
            'Book (apenas para Lesson)': 'Book (Lesson only)',
            'PDF do material': 'Material PDF',
            'TÃ­tulo da aula': 'Class title',
            'TÃ­tulo ou nÃºmero da lesson': 'Title or lesson number',
            'Arquivos serÃ£o salvos em': 'Files will be saved in',
            'conforme tipo de aula.': 'according to the class type.',
            '+ Marcar Aula Demonstrativa': '+ Schedule Demo Class',
            'Marcar Aula Demonstrativa': 'Schedule Demo Class',
            '* Nome do Aluno': '* Student Name',
            '* Email do Aluno': '* Student Email',
            '* WhatsApp do Aluno': '* Student WhatsApp',
            '* Data da Aula': '* Class Date',
            '* HorÃ¡rio': '* Time',
            'EmprÃ©stimos em Andamento': 'Active Loans',
            'Livros DisponÃ­veis': 'Available Books',
            'HistÃ³rico de DevoluÃ§Ãµes': 'Return History',
            'Inserir Livro': 'Add Book',
            'Emprestar Livro': 'Loan Book',
            'Inserir Novo Livro': 'Add New Book',
            'Nome do Livro:': 'Book Name:',
            'NÃºmero do Livro:': 'Book Number:',
            'Pesquisar Livro para EmprÃ©stimo': 'Search Book for Loan',
            'Digite nome ou nÃºmero do livro...': 'Enter book name or number...',
            'Pesquisar': 'Search',
            'Confirmar EmprÃ©stimo': 'Confirm Loan',
            'Email do Aluno:': 'Student Email:',
            'Digite o email do aluno': 'Enter the student email',
            'Quantidade de Alunos': 'Number of Students',
            'Dia de aula': 'Class day',
            'Horario': 'Time',
            'Aulas programadas': 'Scheduled classes',
            'Aulas concluidas': 'Completed classes',
            'Alunos matriculados': 'Enrolled students',
            'Progresso da Turma': 'Class Progress',
            'Aulas': 'Classes',
            'Ãšltima aula: --': 'Last class: --',
            'ConversaÃ§Ã£o': 'Conversation',
            'Registrar PresenÃ§as - ConversaÃ§Ã£o': 'Register Attendance - Conversation',
            'Concluir aula': 'Finish class',
            'Editar Turma': 'Edit Class',
            'Nome da Turma': 'Class Name',
            'Dia da Aula': 'Class Day',
            'HorÃ¡rio de InÃ­cio': 'Start Time',
            'HorÃ¡rio de Fim': 'End Time',
            'Ativa?': 'Active?',
            'Ativa': 'Active',
            'Inativa': 'Inactive',
            'Salvar AlteraÃ§Ãµes': 'Save Changes',
            'Criar Nova Turma': 'Create New Class',
            'Nome da Turma:': 'Class Name:',
            'Dia da semana:': 'Weekday:',
            'HorÃ¡rio de Inicio da aula:': 'Class start time:',
            'HorÃ¡rio de encerramento da aula:': 'Class end time:',
            'Criar turma': 'Create class',
            'Segunda-feira': 'Monday',
            'Segunda-Feira': 'Monday',
            'TerÃ§a-feira': 'Tuesday',
            'Quarta-feira': 'Wednesday',
            'Quarta-Feira': 'Wednesday',
            'Quinta-feira': 'Thursday',
            'Quinta-Feira': 'Thursday',
            'Sexta-feira': 'Friday',
            'Sexta-Feira': 'Friday',
            'SÃ¡bado': 'Saturday',
            'Sabado': 'Saturday',
            '*Nome completo': '*Full name',
            '*Tipo BancÃ¡ria': '*Bank type',
            'ItÃ¡u / Banco do Brasil / Nubank': 'Itau / Bank of Brazil / Nubank',
            'Aulas Programadas': 'Scheduled Classes',
            'Material da Aula': 'Class Material',
            'Lista de PresenÃ§a': 'Attendance List',
            'VisÃ£o geral financeira â€” grÃ¡ficos interativos e aÃ§Ãµes rÃ¡pidas': 'Financial overview — interactive charts and quick actions'
        }
    };

    Object.assign(TRANSLATIONS.en, {
        'Aluno:': 'Student:',
        'Emprestado em:': 'Loaned on:',
        'EmprÃ©stimo:': 'Loan:',
        'EmprÃƒÂ©stimo:': 'Loan:',
        'DevoluÃ§Ã£o:': 'Return:',
        'DevoluÃƒÂ§ÃƒÂ£o:': 'Return:',
        'Confirmar DevoluÃ§Ã£o': 'Confirm Return',
        'Confirmar DevoluÃƒÂ§ÃƒÂ£o': 'Confirm Return',
        'Editar Livro': 'Edit Book',
        'Livro atualizado com sucesso!': 'Book updated successfully!',
        'Livro inserido com sucesso!': 'Book added successfully!',
        'Erro ao salvar livro.': 'Error saving book.',
        'Digite um termo para pesquisa.': 'Enter a search term.',
        'Erro ao pesquisar livros.': 'Error searching books.',
        'Digite o email do aluno.': 'Enter the student email.',
        'EmprÃ©stimo registrado com sucesso!': 'Loan registered successfully!',
        'EmprÃƒÂ©stimo registrado com sucesso!': 'Loan registered successfully!',
        'Erro ao registrar emprÃ©stimo.': 'Error registering loan.',
        'Erro ao registrar emprÃƒÂ©stimo.': 'Error registering loan.',
        'Confirmar devoluÃ§Ã£o deste livro?': 'Confirm return for this book?',
        'Confirmar devoluÃƒÂ§ÃƒÂ£o deste livro?': 'Confirm return for this book?',
        'DevoluÃ§Ã£o registrada com sucesso!': 'Return registered successfully!',
        'DevoluÃƒÂ§ÃƒÂ£o registrada com sucesso!': 'Return registered successfully!',
        'Erro ao registrar devoluÃ§Ã£o.': 'Error registering return.',
        'Erro ao registrar devoluÃƒÂ§ÃƒÂ£o.': 'Error registering return.',
        'Erro ao carregar dados da biblioteca.': 'Error loading library data.',
        'Tem certeza que deseja salvar essa aula?': 'Are you sure you want to save this class?',
        'Informe o WhatsApp do aluno para enviar a confirmacao.': 'Enter the student WhatsApp to send the confirmation.',
        'Informe um WhatsApp valido para enviar a confirmacao.': 'Enter a valid WhatsApp number to send the confirmation.',
        'Aula marcada com sucesso!': 'Class scheduled successfully!',
        'Conflito detectado! Email ou horÃ¡rio jÃ¡ marcado.': 'Conflict detected. Email or time already scheduled.',
        'Conflito detectado! Email ou horÃƒÂ¡rio jÃƒÂ¡ marcado.': 'Conflict detected. Email or time already scheduled.',
        'Data invalida, escolha uma data maior que a corrente.': 'Invalid date. Choose a future date.',
        'Horario invalido, escolha uma horÃ¡rio entre 08h e 20h.': 'Invalid time. Choose a time between 8 AM and 8 PM.',
        'Horario invalido, escolha uma horÃƒÂ¡rio entre 08h e 20h.': 'Invalid time. Choose a time between 8 AM and 8 PM.',
        'Erro ao marcar aula!, certifique-se de preencher todos os campos': 'Error scheduling class. Make sure all fields are filled.',
        'Aula marcada, mas o WhatsApp informado nao parece valido.': 'Class scheduled, but the WhatsApp number does not look valid.',
        'Email de confirmacao enviado!': 'Confirmation email sent!',
        'Nao foi possivel enviar o email automaticamente:': 'Could not send the email automatically:',
        'Nao foi possivel conectar ao servidor para enviar o email automaticamente.': 'Could not connect to the server to send the email automatically.',
        'Tem certeza que deseja cancelar essa aula?': 'Are you sure you want to cancel this class?',
        'Aula cancelada': 'Class canceled',
        'NÃ£o foi possÃ­vel cancelar': 'Could not cancel',
        'NÃƒÂ£o foi possÃƒÂ­vel cancelar': 'Could not cancel',
        'Tem certeza que deseja confirmar essa matricula?': 'Are you sure you want to confirm this enrollment?',
        'MatrÃ­cula confirmada!': 'Enrollment confirmed!',
        'MatrÃƒÂ­cula confirmada!': 'Enrollment confirmed!',
        'Erro ao confirmar matrÃ­cula': 'Error confirming enrollment',
        'Erro ao confirmar matrÃƒÂ­cula': 'Error confirming enrollment',
        'Cidade': 'City',
        'Dias sem pagar': 'Days overdue',
        'Valor devido': 'Amount due',
        'Nenhuma mensalidade': 'No monthly fees',
        'Nenhum inadimplente.': 'No overdue students.',
        'Preencha email e mensalidade.': 'Fill in email and monthly fee.',
        'Erro de comunicaÃ§Ã£o com o servidor.': 'Server communication error.',
        'Erro de comunicaÃƒÂ§ÃƒÂ£o com o servidor.': 'Server communication error.',
        'Receita mensal': 'Monthly revenue',
        'Receita Total (R$)': 'Total Revenue (R$)',
        'Receita Projetada': 'Projected Revenue',
        'Pagos': 'Paid',
        'Pendentes': 'Pending',
        'Bolsistas': 'Scholarship students',
        'Turma nÃ£o encontrada!': 'Class not found!',
        'Turma nÃƒÂ£o encontrada!': 'Class not found!',
        'Carregando alunos...': 'Loading students...',
        'Erro ao carregar alunos.': 'Error loading students.',
        'Deseja concluir esta aula de conversaÃ§Ã£o?': 'Do you want to finish this conversation class?',
        'Deseja concluir esta aula de conversaÃƒÂ§ÃƒÂ£o?': 'Do you want to finish this conversation class?',
        'Nenhuma turma foi selecionada.': 'No class was selected.',
        'Erro ao concluir aula.': 'Error finishing class.',
        'ID da aula nÃ£o encontrado': 'Class ID not found',
        'ID da aula nÃƒÂ£o encontrado': 'Class ID not found',
        'Aula Concluida com sucesso!': 'Class completed successfully!',
        'Turma atualizada com sucesso!': 'Class updated successfully!',
        'Conflito de horÃ¡rio com outra turma ativa.': 'Schedule conflict with another active class.',
        'Conflito de horÃƒÂ¡rio com outra turma ativa.': 'Schedule conflict with another active class.',
        'A turma possui alunos ativos. Transfira antes de desativar.': 'This class has active students. Transfer them before deactivating it.',
        'Erro inesperado ao atualizar turma.': 'Unexpected error updating class.',
        'Ãšltima aula :': 'Last class:',
        'ÃƒÅ¡ltima aula :': 'Last class:',
        'Informe um numero de book inteiro valido.': 'Enter a valid whole book number.',
        'Book inserido com sucesso!': 'Book added successfully!',
        'Erro ao inserir book.': 'Error adding book.',
        'Estoque atualizado com sucesso!': 'Stock updated successfully!',
        'Erro ao atualizar estoque.': 'Error updating stock.',
        'Erro ao carregar estoque.': 'Error loading stock.',
        'Erro ao conectar com o servidor.': 'Error connecting to the server.',
        'Por favor, preencha todos os campos obrigatÃ³rios.': 'Please fill in all required fields.',
        'Por favor, preencha todos os campos obrigatÃƒÂ³rios.': 'Please fill in all required fields.',
        'Aluno atualizado com sucesso!': 'Student updated successfully!',
        'Erro ao atualizar aluno:': 'Error updating student:',
        'entrada:': 'entry:',
        'saÃ­da:': 'exit:',
        'saÃƒÂ­da:': 'exit:',
        'Aluno Matriculado com sucesso!': 'Student enrolled successfully!',
        'Erro: Email jÃ¡ existe ou turma invÃ¡lida.': 'Error: email already exists or class is invalid.',
        'Erro: Email jÃƒÂ¡ existe ou turma invÃƒÂ¡lida.': 'Error: email already exists or class is invalid.',
        'Erro inisperado na MatrÃ­cula.': 'Unexpected enrollment error.',
        'Erro inisperado na MatrÃƒÂ­cula.': 'Unexpected enrollment error.',
        'Preencha todos os campos!': 'Fill in all fields!',
        ' Turma criada com Sucesso!': ' Class created successfully!',
        ' Foi detectado conflito de horÃ¡rio da nova turma com turmas ja existentes!': ' A schedule conflict was detected with existing classes!',
        ' Foi detectado conflito de horÃƒÂ¡rio da nova turma com turmas ja existentes!': ' A schedule conflict was detected with existing classes!',
        'Falha ao criar a turma': 'Failed to create class',
        'Erro na conexÃ£o com o servidor': 'Server connection error',
        'Erro na conexÃƒÂ£o com o servidor': 'Server connection error',
        'ERRO ao carregar presenÃ§as': 'Error loading attendance',
        'ERRO ao carregar presenÃƒÂ§as': 'Error loading attendance',
        'Aula de ConversaÃ§Ã£o': 'Conversation Class',
        'Aula de ConversaÃƒÂ§ÃƒÂ£o': 'Conversation Class'
    });

    window.fetch = async (resource, options = {}) => {
        const url = typeof resource === 'string' ? resource : resource.url;
        const shouldSendSession = url && url.startsWith(API_URL);
        const requestOptions = shouldSendSession
            ? { ...options, credentials: 'include' }
            : options;

        const response = await originalFetch(resource, requestOptions);

        if (shouldSendSession && response.status === 401) {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }

        return response;
    };

    async function validateSession() {
        try {
            const response = await originalFetch(`${API_URL}/session`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Sessao invalida');
            }

            const session = await response.json();
            localStorage.setItem('user', JSON.stringify(session.user));
        } catch (error) {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }
    }

    async function logout() {
        try {
            await originalFetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }
    }

    function getCurrentLanguage() {
        const language = localStorage.getItem(LANGUAGE_KEY);
        return language === 'en' ? 'en' : 'pt';
    }

    function translateValue(value, language) {
        const original = value.trim();

        if (!original) {
            return value;
        }

        if (language === 'pt') {
            return value;
        }

        const dictionary = TRANSLATIONS[language] || {};
        const translated = dictionary[original];
        if (translated) {
            return value.replace(original, translated);
        }

        return Object.entries(dictionary)
            .sort(([a], [b]) => b.length - a.length)
            .reduce((text, [source, target]) => text.replaceAll(source, target), value);
    }

    function translateTextNode(node, language) {
        const original = originalTextByNode.get(node) || node.nodeValue;

        if (!originalTextByNode.has(node)) {
            originalTextByNode.set(node, original);
        }

        const translated = translateValue(original, language);
        if (node.nodeValue !== translated) {
            node.nodeValue = translated;
        }
    }

    function translateAttribute(element, attr, language) {
        if (!element.hasAttribute(attr)) {
            return;
        }

        let attrs = originalAttrsByElement.get(element);
        if (!attrs) {
            attrs = {};
            originalAttrsByElement.set(element, attrs);
        }

        if (!attrs[attr]) {
            attrs[attr] = element.getAttribute(attr);
        }

        const translated = translateValue(attrs[attr], language);
        if (element.getAttribute(attr) !== translated) {
            element.setAttribute(attr, translated);
        }
    }

    function translateElement(element, language) {
        if (element.matches?.('script, style, canvas')) {
            return;
        }

        ['placeholder', 'title', 'aria-label', 'value'].forEach(attr => {
            translateAttribute(element, attr, language);
        });
    }

    window.alert = message => originalAlert(translateValue(String(message), getCurrentLanguage()));
    window.confirm = message => originalConfirm(translateValue(String(message), getCurrentLanguage()));
    window.translateAppText = value => translateValue(String(value), getCurrentLanguage());

    function applyLanguage(language = getCurrentLanguage()) {
        translating = true;
        document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';
        document.title = translateValue(originalDocumentTitle, language);

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (!parent || parent.matches('script, style, canvas')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return node.nodeValue.trim()
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        let node = walker.nextNode();
        while (node) {
            translateTextNode(node, language);
            node = walker.nextNode();
        }

        document.querySelectorAll('input, textarea, button, [title], [aria-label]').forEach(element => {
            translateElement(element, language);
        });

        document.querySelectorAll('.app-language-button').forEach(button => {
            const active = button.dataset.lang === language;
            button.classList.toggle('ativo', active);
            button.setAttribute('aria-pressed', String(active));
        });

        translating = false;
    }

    function observeLanguageChanges() {
        const observer = new MutationObserver(() => {
            if (translating) {
                return;
            }

            window.requestAnimationFrame(() => applyLanguage());
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function injectControlStyles() {
        if (document.getElementById('authGuardControlsStyle')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'authGuardControlsStyle';
        style.textContent = `
            .app-logout-control {
                position: fixed !important;
                top: 16px !important;
                right: 16px !important;
                z-index: 9999 !important;
                padding: 6px 14px !important;
                border: 1px solid rgba(255, 255, 255, 0.35) !important;
                border-radius: 50px !important;
                background: linear-gradient(90deg, rgba(160, 32, 240, 0.9), rgba(255, 75, 43, 0.9)) !important;
                color: #ffffff !important;
                font-family: Inter, Arial, sans-serif !important;
                font-size: 0.9rem !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                backdrop-filter: blur(8px) !important;
                -webkit-backdrop-filter: blur(8px) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18) !important;
                transform: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            .app-logout-control svg {
                width: 16px;
                height: 16px;
                transition: transform 0.3s ease;
            }

            .app-logout-control:hover,
            .app-logout-control:focus-visible {
                background: linear-gradient(90deg, rgba(160, 32, 240, 1), rgba(255, 75, 43, 1)) !important;
                border-color: rgba(255, 255, 255, 0.75) !important;
                box-shadow: 0 6px 16px rgba(160, 32, 240, 0.28) !important;
                transform: scale(1.05);
            }

            .app-logout-control:hover svg,
            .app-logout-control:focus-visible svg {
                transform: translateX(3px);
            }

            .app-language-switcher {
                position: fixed;
                top: 20px;
                right: 92px;
                z-index: 9999;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 0;
                background: transparent;
            }

            .app-language-button {
                width: 26px;
                height: 26px;
                padding: 0;
                border: 0;
                border-radius: 50%;
                background: transparent;
                cursor: pointer;
                overflow: hidden;
                opacity: 0.82;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                transition: 0.2s;
            }

            .app-language-button img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .app-language-button.ativo {
                opacity: 1;
                box-shadow: 0 0 0 2px #ffffff, 0 2px 8px rgba(0,0,0,0.2);
            }

            .app-language-button:hover,
            .app-language-button:focus-visible {
                opacity: 1;
                transform: translateY(-1px);
            }

            @media (max-width: 768px) {
                .app-logout-control {
                    right: 12px !important;
                    padding: 8px 10px !important;
                }

                .app-logout-control span {
                    display: none !important;
                }

                .app-language-switcher {
                    right: 64px;
                    gap: 8px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function createLanguageSwitcher() {
        if (document.getElementById(LANGUAGE_SWITCHER_ID)) {
            return;
        }

        const switcher = document.createElement('div');
        switcher.id = LANGUAGE_SWITCHER_ID;
        switcher.className = 'app-language-switcher';
        switcher.setAttribute('role', 'group');
        switcher.setAttribute('aria-label', 'Selecionar idioma');
        switcher.innerHTML = `
            <button type="button" class="app-language-button" data-lang="pt" aria-pressed="false" title="Português">
                <img src="assets/img/BR.png" alt="Português">
            </button>
            <button type="button" class="app-language-button" data-lang="en" aria-pressed="false" title="English">
                <img src="assets/img/US.png" alt="English">
            </button>
        `;

        switcher.querySelectorAll('.app-language-button').forEach(button => {
            button.addEventListener('click', () => {
                localStorage.setItem(LANGUAGE_KEY, button.dataset.lang);
                applyLanguage(button.dataset.lang);
                window.dispatchEvent(new CustomEvent('app-language-change', {
                    detail: { language: button.dataset.lang }
                }));
            });
        });

        document.body.appendChild(switcher);
    }

    function setupLogoutButton() {
        injectControlStyles();

        const existingButton = document.querySelector(LOGOUT_SELECTOR);
        if (existingButton) {
            existingButton.addEventListener('click', logout);
            createLanguageSwitcher();
            return;
        }

        if (document.getElementById(LOGOUT_BUTTON_ID)) {
            return;
        }

        const button = document.createElement('button');
        button.id = LOGOUT_BUTTON_ID;
        button.type = 'button';
        button.className = 'app-logout-control';
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Sair</span>
        `;
        button.setAttribute('aria-label', 'Sair do sistema');
        button.addEventListener('click', logout);

        document.body.appendChild(button);
        createLanguageSwitcher();
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupLogoutButton();
        applyLanguage();
        observeLanguageChanges();
    });

    window.authReady = validateSession();
    window.applyAppLanguage = applyLanguage;
})();
