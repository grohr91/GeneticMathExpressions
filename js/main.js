/* ---------- CONFIGURAÇÕES INICIAIS ---------- */
//numeros selecionados
var n1 = "", n2 = "", n3 = "", n4 = "", n5 = "", n6 = "";
//solução proposta
var solucao = "";
//taxa de crossover de 60%
var taxaDeCrossover = 60;
//taxa de mutação de 3%
var taxaDeMutacao = 3;
//tamanho da população
var tamPop = 10;
//tamanho do cromossomo
var tamCromossomo = 33;
//numero máximo de gerações
var numMaxGeracoes = 100;
//tipo de seleção
var tpSelecao = "ROLETA";
//tipo do resultado da expressão
var tpNumero = "INTEIRO";
//variavel do log
var log = new Log("log");
//variavel global que indica se encontrou solucao
var encontrouSolucao = false;
//pontos de corte (posicoes de operadores e operandos no array)
var possiveisPontosDeCorte = [16, 19, 13, 22, 10, 25, 7, 28, 4, 30, 2];
//possiveis operadores
var operadores = ["", "+", "-", "*", "/"];
//possiveis parenteses
var parenteses = ["(", "", ")"];
//var que guarda o primeiro melhor individuo (exibe no final da execução)
var melhorIndividuo;
/* previne que o método novaGeracao entre em loop infinito */
var maxIteracoes = tamPop * tamPop;

/* ---------- _CONFIGURAÇÕES INICIAIS_ ---------- */
$(function($) {
    carregaTela();
    initValoresAleatorios();
});

function carregaTela() {
    for (var i = 0; i <= 10; i++) {
        var option = "<option>" + i * 10 + "</option>";
        var option1 = "<option>" + i + "</option>";
        if (i >= 1 && i <= 9) {
            $("#taxaDeCrossover").append(option);
            $("#taxaDeMutacao").append(option1);
            $("#n1").append(option1);
            $("#n2").append(option1);
            $("#n3").append(option1);
            $("#n4").append(option1);
        }
    }

    initConfiguracoes();
}

function initConfiguracoes() {
    $("#taxaDeCrossover").val(taxaDeCrossover);
    $("#taxaDeMutacao").val(taxaDeMutacao);
    $("#tamPop").val(tamPop);
    $("#numMaxGeracoes").val(numMaxGeracoes);
    $("#tpSelecao").val(tpSelecao);
    $("#tpNumero").val(tpNumero);
}

function initValoresAleatorios() {
    $("#n1").val("9");
    $("#n2").val("2");
    $("#n3").val("3");
    $("#n4").val("4");
    $("#n5").val("10");
    $("#n6").val("75");
    $("#solucaoProposta").val(
            Math.floor(Math.random() * 899) + 100
            );
}

/* ---------- VALIDAÇÕES DE INTERFACE ---------- */
function validaEAtribuiValoresSelecionados() {
    var valido = true;
    var numeros = 0;

    /* conta qtd de numeros com valor selecionado */
    for (var i = 1; i <= 6; i++) {
        if ($("#n" + i).val() != "") {
            numeros++;
        }
    }

    /* se validar, atribui valores às variáveis */
    if (numeros == 0 || $("#solucaoProposta").val() == "" ||
            $("#solucaoProposta").val() < 100 || $("#solucaoProposta").val() > 1000) {
        alert("Preencha no mínimo um dos números que irão compor a expressão. A solução proposta deve ser um número entre 100 e 999.");
        valido = false;
    }

    if ($("#tamPop").val() == undefined || $("#tamPop").val() < 10) {
        alert("Tamanho da população deve ser maior que 10.");
        valido = false;
    }

    if (!$.isNumeric($("#tamPop").val()) || !$.isNumeric($("#numMaxGeracoes").val())) {
        alert("Valores da configuração devem ser numéricos e não devem estar vazios.");
        return false;
    }

    n1 = $("#n1").val();
    n2 = $("#n2").val();
    n3 = $("#n3").val();
    n4 = $("#n4").val();
    n5 = $("#n5").val();
    n6 = $("#n6").val();

    tamPop = $("#tamPop").val();
    taxaDeCrossover = $("#taxaDeCrossover").val();
    taxaDeMutacao = $("#taxaDeMutacao").val();
    numMaxGeracoes = $("#numMaxGeracoes").val();
    solucao = $("#solucaoProposta").val();
    tpSelecao = $("#tpSelecao").val();
    tpNumero = $("#tpNumero").val();
    maxIteracoes = tamPop * tamPop;
    log.destroy();
    melhorIndividuo = undefined;

    return valido;
}

function trataValorDuplicadoCombo(combo) {
    var vl = $(combo).val();

    if (vl != "") {
        $("select").each(function() {
            if (this != combo && $(this).val() == $(combo).val()) {
                $(this).val("");
            }
        });
    }
}
/* ---------- _VALIDAÇÕES DE INTERFACE_ ---------- */

function calculaAptidao(expressao) {
    var aptidao = eval(expressao);
    aptidao = solucao - aptidao;
    if (aptidao < 0) {
        aptidao = aptidao * -1;
    }
    return aptidao;
}


/* verifica se o individuo do parametro é melhor que o da var global
 * se sim, então ele é atribuido a var global para ser exibido no final
 * da execução do programa */
function verificaMelhorIndividuo(individuo) {
    if (melhorIndividuo == undefined) {
        melhorIndividuo = individuo;
    }
    else if (individuo.aptidao < melhorIndividuo.aptidao) {
        melhorIndividuo = individuo;
    }
}


/* aplica mutação diretamente no gene */
function aplicaMutacao(genesNaturais) {

    var possiveisPosicoesMutacao = [4, 10, 16, 22, 28];
    var cromossomoAtual = [];
    var melhorCromossomo = genesNaturais.slice();
    var operadorEscolhido = operadores[Math.floor(Math.random() * (operadores.length - 1)) + 1];
    var stringCromossomo = "";
    var tentativas = 0;

    for (var i = 0; i < possiveisPosicoesMutacao.length && (tentativas < 4 || stringCromossomo != ""); i++) {
        var posicao = possiveisPosicoesMutacao[i];
        cromossomoAtual = genesNaturais.slice();
        if (cromossomoAtual[posicao] != "" && cromossomoAtual[posicao] != operadorEscolhido) {
            var operadorAntigo = cromossomoAtual[posicao];
            cromossomoAtual[posicao] = operadorEscolhido;
            if (calculaAptidao(cromossomoAtual.join(""))
                    < calculaAptidao(melhorCromossomo.join(""))) {

                /* testa se permite apenas nrs inteiros */
                var validou = false;
                if (tpNumero == "INTEIRO") {
                    if (eval(cromossomoAtual.join("")) == Math.floor(eval(cromossomoAtual.join("")))) {
                        validou = true;
                    }
                }
                else {
                    validou = true;
                }

                if (validou) {
                    melhorCromossomo = cromossomoAtual;
                    var aux = cromossomoAtual.slice();
                    aux[posicao] = "<strong class='text-primary'>" + operadorAntigo + "</strong>";
                    stringCromossomo = aux.join("");
                }
            }
        }

        /* caso não encontrou uma mutação valida, testa com outro operador */
        if (i == (possiveisPosicoesMutacao.length - 1)) {
            operadorEscolhido = operadores[Math.floor(Math.random() * (operadores.length - 1)) + 1];
            if (stringCromossomo == "") {
                i = -1;
                tentativas++;
            }
        }
    }
    return [melhorCromossomo, stringCromossomo];
}


/* escolhe um ponto de corte randomico e verifica
 * se o ponto de corte irá gerar um cromossomo válido */
function crossover(pai, mae) {
    var individuosFilhos = [];
    var novoIndividuo1;
    var novoIndividuo2;
//    var pontoDeCorte = Math.floor(tamCromossomo / 2);
    var deuCria1 = false;
    var deuCria2 = false;
    var corte1 = null;
    var corte2 = null;
    for (var i = 0; i < possiveisPontosDeCorte.length && (!deuCria1 && !deuCria2); i++) {
        var posicaoCorte = possiveisPontosDeCorte[i];
        var pt1Pai = pai.cromossomo.genes.slice(0, posicaoCorte);
        var pt2Pai = pai.cromossomo.genes.slice(posicaoCorte, tamCromossomo);
        var pt1Mae = mae.cromossomo.genes.slice(0, posicaoCorte);
        var pt2Mae = mae.cromossomo.genes.slice(posicaoCorte, tamCromossomo);
        if (pt1Pai.join("").length > 1 && pt1Mae.join("").length > 1) {
            novoIndividuo1 = new Individuo();
            novoIndividuo1.cromossomo.genes = (pt1Pai + "," + pt2Mae).split(",");
            novoIndividuo2 = new Individuo();
            novoIndividuo2.cromossomo.genes = (pt1Mae + "," + pt2Pai).split(",");

            /* valida os dois individuos */
            if (novoIndividuo1.cromossomo.validaCromossomo() == true &&
                    novoIndividuo1.cromossomo.contaParenteses() == 0) {
                deuCria1 = true;
                corte1 = posicaoCorte;
            }
            if (novoIndividuo2.cromossomo.validaCromossomo() == true &&
                    novoIndividuo2.cromossomo.contaParenteses() == 0) {
                deuCria2 = true;
                corte2 = posicaoCorte;
            }
        }
    }

    if (deuCria1 == true) {
        novoIndividuo1.pai = pai;
        novoIndividuo1.mae = mae;
        novoIndividuo1.pontoDeCorteCrossover = corte1;
        individuosFilhos.push(novoIndividuo1);
    }
    if (deuCria2 == true) {
        novoIndividuo2.pai = mae;
        novoIndividuo2.mae = pai;
        novoIndividuo2.pontoDeCorteCrossover = corte2;
        individuosFilhos.push(novoIndividuo2);
    }
    return individuosFilhos;
}

function novaGeracao(populacaoAnterior, geracao) {
    var countIteracoes = 0;

    /* cria nova população com o mesmo tamanho da anterior */
    var novaPopulacao = new Populacao(tamPop, geracao);
    var hrDeCruzar = false;
    while (novaPopulacao.individuos.length < tamPop && !encontrouSolucao
            && countIteracoes < maxIteracoes) {
        countIteracoes++;

        /* seleciona os 2 pais por roleta */
        var filho1, filho2, pai, mae;

        if (!hrDeCruzar) {
            hrDeCruzar = Math.floor(Math.random() * 100) <= taxaDeCrossover;
        }

        /* ROLETA */
        if (tpSelecao == "ROLETA") {
            do {
                var giroDaRoleta = Math.random();
                pai = populacaoAnterior.buscaIndividuoNaRoleta(giroDaRoleta);
                giroDaRoleta = Math.random();
                mae = populacaoAnterior.buscaIndividuoNaRoleta(giroDaRoleta);
            } while (pai == mae);
        }
        else {
            /* TORNEIO */
            do {
                pai = populacaoAnterior.selecionaPorTorneio();
                mae = populacaoAnterior.selecionaPorTorneio();
            } while (pai == mae);
        }

        /* verifica a taxa de crossover, se sim realiza o crossover,
         * se não, mantém os pais selecionados para a próxima geração
         */
        if (hrDeCruzar) {
            /* cruza pais */
            var filhos = [];
            filhos = crossover(pai, mae);
            filho1 = filhos[0];
            if (filhos.length > 1) {
                filho2 = filhos[1];
            }
        } else {
            /* senão, próprios pais passam para próxima geração, caso ainda não existam */
            filho1 = new Individuo(0);
            filho1.setIndividuo(pai);
            filho2 = new Individuo(0);
            filho2.setIndividuo(mae);
        }


        /* insere novos individuos na nova população */
        if (filho1 != undefined && !novaPopulacao.contemIndividuo(filho1)) {
            countIteracoes = 0;
            if (!hrDeCruzar) {
                filho1.pai = null;
                filho1.mae = null;
                filho1.pontoDeCorteCrossover = null;
            }
            filho1.geracao = geracao;
            novaPopulacao.individuos.push(filho1);
            filho1.aptidao = filho1.cromossomo.getAptidao();
            if (filho1.aptidao == 0) {
                encontrouSolucao = true;
            }
            hrDeCruzar = false;
        }

        if (filho2 != undefined && novaPopulacao.individuos.length < tamPop
                && !novaPopulacao.contemIndividuo(filho2)) {
            countIteracoes = 0;
            if (filho1.pai == null) {
                filho2.pai = null;
                filho2.mae = null;
                filho2.pontoDeCorteCrossover = null;
            }
            filho2.geracao = geracao;
            filho2.aptidao = filho2.cromossomo.getAptidao();
            novaPopulacao.individuos.push(filho2);
            if (filho2.aptidao == 0) {
                encontrouSolucao = true;
            }
        }

        if (countIteracoes == (maxIteracoes - 1)) {
            filho1 = new Individuo(0);
            if (Math.floor(Math.random() * 1) == 0) {
                filho1.setIndividuo(pai);
            } else {
                filho1.setIndividuo(mae);
            }
            filho1.aptidao = filho1.cromossomo.getAptidao();
            novaPopulacao.individuos.push(filho1);
            countIteracoes = 0;
        }
    }

    /* aplica mutação */
    var pcAtual = 0;
    for (var i = 0; i < novaPopulacao.individuos.length; i++) {
        pcAtual = Math.floor(Math.random() * 100);
        if (pcAtual <= taxaDeMutacao) {
            var retorno = aplicaMutacao(novaPopulacao.individuos[i].cromossomo.genes);
            var novosGenes = retorno[0].slice();
            /* se mutou, seta flag */
            if (novosGenes != novaPopulacao.individuos[i].cromossomo.genes) {
                novaPopulacao.individuos[i].expressaoOriginal = retorno[1];
                novaPopulacao.individuos[i].cromossomo.genes = novosGenes.slice();
                novaPopulacao.individuos[i].sofreuMutacao = true;
                novaPopulacao.individuos[i].aptidao = novaPopulacao.individuos[i].cromossomo.getAptidao();
            }
        }

        verificaMelhorIndividuo(novaPopulacao.individuos[i]);
    }

    return novaPopulacao;
}


function gerarSolucao() {
    /* não validou dados de entrada, sem solução */
    if (!validaEAtribuiValoresSelecionados()) {
        return false;
    }

    if (n6 == solucao) {
        alert("O sexto número escolhido é igual a solução!");
        return true;
    }
    encontrouSolucao = false;

    /* cria a primeira população aleatória */
    var geracaoAtual = 1;
    var populacao = new Populacao(tamPop, geracaoAtual);
    populacao.initPopulacao();

    /* escreve no log */
    log.appedNovaGeracao(geracaoAtual);
    for (var i = 0; i < populacao.individuos.length; i++) {
        log.appendIndividuo(populacao.individuos[i]);
    }


    /* inicia a busca pela solução */
    while (!encontrouSolucao && geracaoAtual < numMaxGeracoes && maxIteracoes > 0) {
        geracaoAtual++;

        /* cria nova populacao */
        populacao = novaGeracao(populacao, geracaoAtual);

        /* escreve no log */
        log.appedNovaGeracao(geracaoAtual);
        for (var i = 0; i < populacao.individuos.length; i++) {
            log.appendIndividuo(populacao.individuos[i]);
        }
    }

    $("table").tablesorter();

    log.exibeMelhorIndividuo();

    if (maxIteracoes == 0) {
        alert("Não é possível realizar mais cruzamentos pelo fato de não gerar mais filhos válido.");
    }
    return encontrouSolucao;
}


function startIntro() {
    if (!$("#collapseOne").hasClass('in')) {
        $("#collapseOne").addClass('in');
    }
    introJs().start();
}