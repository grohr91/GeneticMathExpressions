function Log(div) {
    this.div = div;
    this.geracao = 0;
    this.countIndividuoGeracao = 0;
    this.htmlGeracao = "<div class='panel panel-default'>" +
            "<div class='panel-heading'>" +
            "<h4 class='panel-title'>" +
            "<a data-toggle='collapse' data-parent='#log' href='#geracao#NR_GERACAO#'>" +
            "<label id='G#NR_GERACAO#' style='width: 100%;cursor: pointer; font-weight: inherit; margin-bottom: 0px;'>" +
            "Geração #NR_GERACAO#" +
            "</label></a>" +
            "</h4>" +
            "</div>" +
            "<div id='geracao#NR_GERACAO#' class='panel-collapse collapse'>" +
            "<div class='panel-body'>" +
            "<table class='table table-condensed'><thead> <tr style='cursor: pointer;'>" +
            "<th>#</th>" +
            "<th>Pai</th>" +
            "<th>Mãe</th>" +
            /* "<th>Ponto de Corte</th>" + */
            "<th>Cromossomo</th>" +
            "<th>Resultado</th>" +
            "<th>Aptidão</th>" +
            "<th>Antes da Mutação</th>" +
            "</tr></thead>" +
            "<tbody>" +
            "</tbody>" +
            /* conteudo individuos da geracao aqui */
            "</table>" +
            "</div>" +
            "</div>" +
            "</div>";
    this.htmlIndividuo = "<tr class='#CLASS#'>" +
            "<td>#NR_INDIVIDUO#</td>" +
            "<td>#PAI#</td>" +
            "<td>#MAE#</td>" +
//            "<td>#PONTO_DE_CORTE#</td>" +
            "<td>#CROMOSSOMO#</td>" +
            "<td>#RESULTADO#</td>" +
            "<td>#APTIDAO#</td>" +
            "<td>#MUTANTE#</td>" +
            "</tr>";
    this.htmlMelhorIndividuo = "<div class='bs-callout bs-callout-info'>" +
            "<h4>Primeira melhor expressão encontrada</h4>" +
            "<p><strong>#EXPRESSAO#</strong> com aptidão igual a <strong>#APTIDAO#</strong> foi gerado na <strong>#GERACAO#ª</strong> geração.</p>" +
            "</div>";

    this.appedNovaGeracao = function(nrGeracao) {
        this.geracao = nrGeracao;
        this.countIndividuoGeracao = 0;
        var html = this.htmlGeracao
                .replace("#NR_GERACAO#", nrGeracao)
                .replace("#NR_GERACAO#", nrGeracao)
                .replace("#NR_GERACAO#", nrGeracao)
                .replace("#NR_GERACAO#", nrGeracao);
        $("#" + this.div).append(html);
    };

    this.appendIndividuo = function(individuo) {
        this.countIndividuoGeracao++;
        var html = this.htmlIndividuo.replace("#NR_INDIVIDUO#", this.countIndividuoGeracao);
        if (individuo.pontoDeCorteCrossover != null) {
            html = html.replace("#PAI#", "(G" + individuo.pai.geracao + "): " + individuo.pai.cromossomo.genes.join(""));
            html = html.replace("#MAE#", "(G" + individuo.mae.geracao + "): " + individuo.mae.cromossomo.genes.join(""));
//            html = html.replace("#PONTO_DE_CORTE#", individuo.pontoDeCorteCrossover);
        } else {
            html = html.replace("#PAI#", "");
            html = html.replace("#MAE#", "");
            //html = html.replace("#PONTO_DE_CORTE#", "");
        }
        html = html.replace("#CROMOSSOMO#", individuo.cromossomo.genes.join(""));
        html = html.replace("#RESULTADO#", eval(individuo.cromossomo.genes.join("")));
        html = html.replace("#APTIDAO#", individuo.cromossomo.getAptidao());
        if (individuo.sofreuMutacao) {
            html = html.replace("#MUTANTE#", individuo.expressaoOriginal);
        } else {
            html = html.replace("#MUTANTE#", "");
        }
        $("#" + this.div + " #geracao" + this.geracao + " tbody").append(html);
    };


    this.exibeMelhorIndividuo = function() {
        var html = this.htmlMelhorIndividuo.replace("#EXPRESSAO#", melhorIndividuo.cromossomo.genes.join(""));
        html = html.replace("#APTIDAO#", melhorIndividuo.aptidao);
        html = html.replace("#GERACAO#", melhorIndividuo.geracao);
        $("#melhorIndividuo").append(html);
    };

    /* limpa log */
    this.destroy = function() {
        $("#log").empty();
        $("#melhorIndividuo").empty();
    };
}