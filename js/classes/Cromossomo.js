function Cromossomo() {
    this.tamanhoCromossomo = tamCromossomo;
    this.OPERADORES = operadores;
    this.PARENTESES = parenteses;
    this.POSSIVEIS_VALORES = ["", n1, n2, n3, n4, n5, n6];
    this.genes = [];

    /* retorna sempre valor positivo */
    this.getAptidao = function() {
        var aptidao = eval(this.genes.join(""));
        aptidao = solucao - aptidao;
        if (aptidao < 0) {
            aptidao = aptidao * -1;
        }
        return aptidao;
    };

    /* valida expressão */
    this.validaCromossomo = function() {
        try {
            this.POSSIVEIS_VALORES = ["", n1, n2, n3, n4, n5, n6];
            /* monta array da expressao */
            var arrayExpressao = this.genes;
            if (arrayExpressao.join("") == "") {
                return false;
            }
            var resultado = eval(arrayExpressao.join(""));
            if (resultado == Infinity) {
                return false;
            }

            /* testa se permite apenas nrs inteiros */
            if (tpNumero == "INTEIRO") {
                if (resultado != Math.floor(resultado)) {
                    return false;
                }
            }
            return this.validaNumerosRepetidos();
        }
        catch (err) {
            return false;
        }
    };


    this.validaNumerosRepetidos = function() {
        var count = 0;
        var countNr = 0;
        var achou = false;
        for (var i = 1; i < this.POSSIVEIS_VALORES.length; i++) {
            var nr = this.POSSIVEIS_VALORES[i];
            if (nr != "") {
                countNr++;
                achou = false;
                if (nr == this.genes[2]) {
                    count++;
                    achou = true;
                }
                if (nr == this.genes[7]) {
                    count++;
                    achou = true;
                }
                if (nr == this.genes[13]) {
                    count++;
                    achou = true;
                }
                if (nr == this.genes[19]) {
                    count++;
                    achou = true;
                }
                if (nr == this.genes[25]) {
                    count++;
                    achou = true;
                }
                if (nr == this.genes[30]) {
                    count++;
                    achou = true;
                }
                if (!achou && countNr > 0) {
                    countNr--;
                }
            }
        }
        if (countNr >= count) {
            return true;
        }
        else {
            return false;
        }
    };


    /* faz a remoção de todos os parenteses e
     * retorna ultimo valor numérico ou operador */
    this.getUltimoValorGene = function() {
        var genesAux = this.genes;
        genesAux = genesAux.join(" ").split(")").join("").split("(").join("").split(" ").join("").split("");
        var ultimoValor = genesAux[genesAux.length - 1];

        return ultimoValor;
    };


    /* gera parenteses aleatório dependendo da condição:
     * 'A' = abre ou vazio
     * 'F' = fecha ou vazio
     * 'AF' = abre, fecha ou vazio */
    this.getParenteseAleatorio = function(condicao) {
        /* verifica se último valor é um operador */
        var ultimoValor = this.getUltimoValorGene();
        if (this.OPERADORES.indexOf(ultimoValor) > 0) {
            /* se é um operador, então apenas poderá abrir ou ser vazio */
            condicao = 'A';
        } else if ($.isNumeric(ultimoValor)) {
            /* se houver um número na última posição, então apenas fecha ou vazio */
            condicao = 'F';
        }

        var posicao = 0;
        if (condicao == 'A') {
            /* se ja possuir 3 parenteses abertos, retorna vazio */
            if (this.contaParenteses() >= 3) {
                return this.PARENTESES[1];
            }
            posicao = Math.floor(Math.random() * (this.PARENTESES.length - 1));
        }
        else if (condicao == 'F') {
            /* se tiver parenteses abertos, então seleciona randomicamente,
             * senão retorna a posição do vazio */
            if (this.contaParenteses() > 0) {
                posicao = Math.floor(Math.random() * (this.PARENTESES.length - 1)) + 1;
            } else {
                posicao = 1;
            }
        }
        else {
            posicao = Math.floor(Math.random() * (this.PARENTESES.length));
        }
        return this.PARENTESES[posicao];
    };


    /* retorna um valor aleatório, diferente dos que ja fazem parte do cromossomo
     * e diferente de vazio caso haja um operador no final do vetor sem ter
     * um número operando*/
    this.getPossivelValorAleatorio = function() {
        /* teste se último valor é operador */
        var posicao = "";
        var ultimoValor = this.getUltimoValorGene();
        if (this.OPERADORES.indexOf(ultimoValor) > 0) {
            /* é operador, não pode ser vazio */
            posicao = Math.floor(Math.random() * (this.POSSIVEIS_VALORES.length - 1)) + 1;
        }
        else {
            posicao = Math.floor(Math.random() * (this.POSSIVEIS_VALORES.length));
        }
        var valor = this.POSSIVEIS_VALORES[posicao];

        /* remove valor escolhido do vetor */
        if (valor != "") {
            this.POSSIVEIS_VALORES.splice(posicao, 1);
        }
        return valor;
    };


    /* retorna um operador aleatório diferente de vazio caso haja um
     * número operando no final do vetor que não esteja procedido
     * de um número */
    this.getOperadorAleatorio = function() {
        var posicao = 0;
        var ultimoValor = this.getUltimoValorGene();
        if ($.isNumeric(ultimoValor)) {
            /* último valor é um número, próximo valor não pode ser operador vazio */
            posicao = Math.floor(Math.random() * (this.OPERADORES.length - 1)) + 1;
        }
        else if (ultimoValor != undefined) {
            posicao = Math.floor(Math.random() * (this.OPERADORES.length));
        }
        return this.OPERADORES[posicao];
    };


    /* apenas inicia o valor do gene de acordo com sua posicao no cromossomo.
     * Evita chamadas indevidas ao método caso o valor ja possua valor */
    this.getValorPosicao = function(posicao) {
        var valor = "";
        switch (posicao) {
            case 2:
            case 7:
            case 13:
            case 19:
            case 25:
            case 30:
                valor = this.getPossivelValorAleatorio();
                break;

                /* OPERADORES */
            case 4:
            case 10:
            case 16:
            case 22:
            case 28:
                valor = this.getOperadorAleatorio();
                break;

                /* PARENTESES */
            case 31:
            case 32:
                /* apenas fecha parenteses se possuir algum aberto */
                valor = this.getParenteseAleatorio('F');
                break;

            default:
                /* apenas abre parenteses */
                valor = this.getParenteseAleatorio('A');
        }
        return valor;
    };


    /* inicia cromossomo */
    this.initCromossomo = function() {
        /* enquanto não validar cromossomo, não passa adiante */
        while (this.validaCromossomo() == false) {
            this.genes = [];
            this.POSSIVEIS_VALORES = ["", n1, n2, n3, n4, n5, n6];
            for (var i = 0; i < this.tamanhoCromossomo; i++) {
                var valor = this.getValorPosicao(i);
                this.genes.push(valor);
            }
        }

        this.retiraParenteses();
        this.POSSIVEIS_VALORES = ["", n1, n2, n3, n4, n5, n6];
    };


    /* retorna qtdpositiva de parenteses abertos que não foram fechados
     * ou qtd negativa de parenteses que foram fechados sem terem sido abertos */
    this.contaParenteses = function() {
        var qtdParenteses = 0;
        for (var i = 0; i < this.genes.length; i++) {
            switch (this.genes[i]) {
                case "(":
                    qtdParenteses++;
                    break;
                case ")":
                    qtdParenteses--;
                    break;
                default:
                    qtdParenteses = qtdParenteses;
            }
        }
        return qtdParenteses;
    };

    /* retira parenteses para dar mais chances de crossover certos.
     * ex: (5) = 5*/
    this.retiraParenteses = function() {
        var reseta = true;
        for (var i = 0; i < this.genes.length; i++) {
            if (this.genes[i] == "(") {
                var existeNr = false;
                var existeOp = false;
                for (var j = i + 1; j < this.genes.length
                        && (!existeNr || !existeOp); j++) {
                    if (this.genes[j] != "") {
                        /* se abrir outro parenteses, para loop interno */
                        if (this.genes[j] == "(") {
                            if (existeNr || existeOp) {
                                i = j - 1;
                                reseta = false;
                            } else {
                                reseta = true;
                            }
                            break;
                        }

                        /* testa se é nr ou operador */
                        if ($.isNumeric(this.genes[j])) {
                            existeNr = true;
                        } else if (this.OPERADORES.join("").split(this.genes[j]).length > 1) {
                            existeOp = true;
                        }
                        /* se encontrar parenteses fechado, retira */
                        else if (this.genes[j] == ")") {
                            this.genes[i] = "";
                            this.genes[j] = "";
                            if (reseta) {
                                i = -1;
                            }
                            break;
                        }
                    }
                }
            }
        }
    };
}