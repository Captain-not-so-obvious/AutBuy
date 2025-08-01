// Os itens já chegam limpos e unidos.
// A primeira linha do código transforma a entrada para um formato mais fácil de manipular.
const cleanedItems = $input.all().map(item => item.json);

// 2. FAZ A ANÁLISE ABC (não precisa mudar)
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

// 3. CALCULA A SUGESTÃO DE COMPRA (não precisa mudar)
cleanedItems.forEach(item => {
    const vendasMediasMensais = item.Total_Vendas / 3;
    let mesesEstoque = 1;
    if (item.Categoria === 'A') mesesEstoque = 3;
    if (item.Categoria === 'B') mesesEstoque = 2;
    
    const sugestao = (vendasMediasMensais * mesesEstoque) - item.Estoque;
    item.Sugestao_Compra = sugestao > 0 ? Math.ceil(sugestao) : 0;
});

// Adicionamos as vendas mensais que precisaremos para o histórico
// Esta parte assume que os dados de vendas individuais estão presentes
// Se não estiverem, podemos ajustar. Por enquanto, vamos focar no cálculo.
cleanedItems.forEach(item => {
    if (item.Vendas_1 !== undefined) {
      item.vendas_mes1 = item.Vendas_1;
      item.vendas_mes2 = item.Vendas_2;
      item.vendas_mes3 = item.Vendas_3;
    }
});


// 4. RETORNA OS DADOS FINAIS
return cleanedItems.map(item => ({ json: item }));