function Individuo(geracao) {
    this.cromossomo = new Cromossomo();
    this.aptidao = 9999;
    this.geracao = geracao;
    this.sofreuMutacao = false;
    /* caso sofrer mutação, guarda a expressao original nesta var */
    this.expressaoOriginal = "";
    this.pai = null;
    this.mae = null;
    this.pontoDeCorteCrossover = null;

    this.setIndividuo = function(individuoAtribuir) {
        this.cromossomo = individuoAtribuir.cromossomo;
        this.aptidao = individuoAtribuir.aptidao;
        this.geracao = individuoAtribuir.geracao;
    };

    this.initIndividuo = function() {
        this.cromossomo.initCromossomo();
        this.aptidao = this.cromossomo.getAptidao();
    };
}