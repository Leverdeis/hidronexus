document.addEventListener("DOMContentLoaded", () => {
        const btnLer = document.getElementById('btn-ler-projetos');
        const conteudoParaLer = document.getElementById('texto-projetos');
        const iconeBtn = btnLer.querySelector('i');
        const textoBtn = btnLer.querySelector('span');
        
        let sinteseFala = window.speechSynthesis;
        let estaLendo = false;
        let vozesDisponiveis = [];

        // 1. Função para carregar as vozes do sistema
        function carregarVozes() {
            vozesDisponiveis = sinteseFala.getVoices();
        }
      
        carregarVozes();
        if (sinteseFala.onvoiceschanged !== undefined) {
            sinteseFala.onvoiceschanged = carregarVozes;
        }

        btnLer.addEventListener('click', () => {
            if (estaLendo) {
                sinteseFala.cancel();
                resetarBotao();
                return;
            }

            let textoLimpo = "";
            const elementosTexto = conteudoParaLer.querySelectorAll('h2, h3, p, li span');
            elementosTexto.forEach(el => {
                textoLimpo += el.innerText + ". ";
            });

            if (textoLimpo.trim() !== "") {
                const leitura = new SpeechSynthesisUtterance(textoLimpo);
                leitura.lang = 'pt-BR'; 
                leitura.rate = 1.0;     
                
                // 2. Lógica para escolher uma voz feminina em Português
                const vozFeminina = vozesDisponiveis.find(voz => 
                    voz.lang.includes('pt-BR') && 
                    (voz.name.includes('Google') || 
                     voz.name.includes('Maria') || 
                     voz.name.includes('Luciana') || 
                     voz.name.includes('Francisca') ||
                     voz.name.includes('Feminina'))
                );

                // 3. Aplica a voz encontrada ou usa a padrão pt-BR
                if (vozFeminina) {
                    leitura.voice = vozFeminina;
                } else {
                    const vozPadraoBR = vozesDisponiveis.find(voz => voz.lang.includes('pt-BR'));
                    if (vozPadraoBR) leitura.voice = vozPadraoBR;
                }
            
                leitura.onstart = () => {
                    estaLendo = true;
                    btnLer.classList.add('lendo');
                    iconeBtn.classList.replace('ph-speaker-high', 'ph-stop');
                    textoBtn.innerText = "Parar Leitura";
                };

                leitura.onend = () => {
                    resetarBotao();
                };

                leitura.onerror = () => {
                    resetarBotao();
                };

                sinteseFala.speak(leitura);
            }
        });

        function resetarBotao() {
            estaLendo = false;
            btnLer.classList.remove('lendo');
            iconeBtn.classList.replace('ph-stop', 'ph-speaker-high');
            textoBtn.innerText = "Ouvir com IA";
        }
    });