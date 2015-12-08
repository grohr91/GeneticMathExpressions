function Populacao(tamanho, geracao) {
    this.tamanhoPopulacao = tamanho;
    this.geracao = geracao;
    this.individuos = [];
    this.roleta = [];

    /* inicia população aleatóriamente */
    this.initPopulacao = function() {
        for (var i = 0; i < this.tamanhoPopulacao; i++) {
            var novoIndividuo = new Individuo(this.geracao);
            novoIndividuo.initIndividuo();
            this.individuos.push(novoIndividuo);
            
            verificaMelhorIndividuo(novoIndividuo);
            if (novoIndividuo.aptidao == 0) {
                encontrouSolucao = true;
                break;
            }
        }
    };

    this.getTotalAptidao = function() {
        var soma = 0;
        for (var i = 0; i < this.individuos.length; i++) {
            soma = soma + this.individuos[i].aptidao;
        }
        return soma;
    };

    /* monta uma vez a estrutura da roleta */
    this.montaRoleta = function() {
        var aptidaoTotalPopulacao = this.getTotalAptidao();
        var porcentagemInicial = 0;
        var tamanhoRoleta = 0;
        for (var i = 0; i < this.individuos.length; i++) {
            var aptidaoIndividuo = this.individuos[i].aptidao;
            var espacoIndividuoRoleta = 1 / (aptidaoIndividuo / aptidaoTotalPopulacao);
            tamanhoRoleta += espacoIndividuoRoleta;
        }

        for (var i = 0; i < this.individuos.length; i++) {
            var aptidaoIndividuo = this.individuos[i].aptidao;
            var espacoIndividuoRoleta = 1 / (aptidaoIndividuo / aptidaoTotalPopulacao);
            var porcentagemFinal = porcentagemInicial + (espacoIndividuoRoleta / tamanhoRoleta);
            this.roleta.push([
                this.individuos[i],
                porcentagemInicial,
                porcentagemFinal
            ]);
            porcentagemInicial = porcentagemFinal;
        }
    };

    this.buscaIndividuoNaRoleta = function(porcentagemSorteada) {
        if (this.roleta.length == 0) {
            this.montaRoleta();
        }
        porcentagemSorteada = porcentagemSorteada;
        var individuoSorteado = null;
        for (var i = 0; i < this.roleta.length; i++) {
            if (porcentagemSorteada >= this.roleta[i][1] && porcentagemSorteada < this.roleta[i][2]) {
                individuoSorteado = this.roleta[i][0];
                break;
            }
        }
        return individuoSorteado;
    };

    /* são selecionados x individuos aleatóriamente e deles,
     * retorna o que possuir menor aptidao */
    this.selecionaPorTorneio = function() {
        var individuoMenorAptidao = null;
        var tamanhoDoConjunto = 0;
        while (tamanhoDoConjunto == 0) {
            tamanhoDoConjunto = Math.floor(Math.random() * this.individuos.length);
        }

        for (var i = 0; i < tamanhoDoConjunto; i++) {
            var posicaoSelecionar = Math.floor(Math.random() * this.individuos.length);
            var individuoSelecionado = this.individuos[posicaoSelecionar];
            if (individuoMenorAptidao == null || individuoMenorAptidao.aptidao > individuoSelecionado.aptidao) {
                individuoMenorAptidao = individuoSelecionado;
            }
        }
        return individuoMenorAptidao;
    };

    /* verifica se a papulação ja possui um individuo igual 
     * ao passado por parametro */
    this.contemIndividuo = function(individuoABuscar) {
        var achou = false;
        if (individuoABuscar != undefined) {
            for (var i = 0; i < this.individuos.length; i++) {
                if (this.individuos[i].cromossomo.genes.join("") == individuoABuscar.cromossomo.genes.join("")) {
                    achou = true;
                    break;
                }
            }
        }
        return achou;
    };
}