// A entrada são os dados desmembrados, mês a mês.
const monthlyItems = $input.all().map(item => item.json);

// 1. REAGRUPAR OS DADOS POR PRODUTO
const productsMap = new Map();

for (const item of monthlyItems) {
    const codigo = item.codigo || item.Codigo; // Pega o código, seja 'codigo' ou 'Codigo'

    if (!productsMap.has(codigo)) {
        // Se for a primeira vez que vemos o produto, cria a entrada dele
        productsMap.set(codigo, {
            Codigo: codigo,
            Descricao: item.descricao,
            Estoque: item.Estoque,
            Total_Vendas: 0,
            // Guardamos as vendas mensais para o histórico
            vendas_mes1: 0,
            vendas_mes2: 0,
            vendas_mes3: 0,
        });
    }

    // Soma a venda do mês atual ao total do produto
    const productData = productsMap.get(codigo);
    productData.Total_Vendas += item.vendas_no_mes;
    
    // Guarda as vendas mensais separadamente
    if (item.mes === 4 || item.mes === 7 || item.mes === 10) { // Exemplo, pode precisar de ajuste
      productData.vendas_mes1 = item.vendas_no_mes;
    } else if (item.mes === 5 || item.mes === 8 || item.mes === 11) {
      productData.vendas_mes2 = item.vendas_no_mes;
    } else {
      productData.vendas_mes3 = item.vendas_no_mes;
    }
}

// Converte o mapa de volta para uma lista de produtos únicos
const cleanedItems = Array.from(productsMap.values());


// 2. FAZ A ANÁLISE ABC
cleanedItems.sort((a, b) => b.Total_Vendas - a.Total_Vendas);
const totalVendasGeral = cleanedItems.reduce((acc, item) => acc + item.Total_Vendas, 0);
let vendasAcumuladas = 0;

cleanedItems.forEach(item => {
    let categoria = 'C';
    if (totalVendasGeral > 0) {
        vendasAcumuladas += item.Total_Vendas;
        const porcentagemAcumulada = (vendasAcumuladas / totalVendasGeral) * 100;
        if (porcentagemAcumulada <= 80) categoria = 'A';
        else if (porcentagemAcumulada <= 95) categoria = 'B';
    }
    item.Categoria = categoria;
});

// 3. CALCULA A SUGESTÃO DE COMPRA
cleanedItems.forEach(item => {
    const vendasMediasMensais = item.Total_Vendas / 3;
    let mesesEstoque = 1;
    if (item.Categoria === 'A') mesesEstoque = 3;
    if (item.Categoria === 'B') mesesEstoque = 2;
    
    const sugestao = (vendasMediasMensais * mesesEstoque) - item.Estoque;
    item.Sugestao_Compra = sugestao > 0 ? Math.ceil(sugestao) : 0;
});

// 4. RETORNA OS DADOS FINAIS
return cleanedItems.map(item => ({ json: item }));