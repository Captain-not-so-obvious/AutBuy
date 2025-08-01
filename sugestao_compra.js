// Os itens já chegam combinados do nó Merge.
const combinedItems = $input.all();

// 1. LIMPA E PREPARA OS DADOS VINDOS DO MERGE
const cleanedItems = combinedItems.map(item => {
    // Acessa os dados da Input 1 (Vendas) e Input 2 (Estoque)
    const salesItem = item.json.data_1;
    const inventoryItem = item.json.data_2;

    if (!salesItem || !inventoryItem || !salesItem.row || !inventoryItem.row) {
        return null;
    }
    
    const salesData = salesItem.row;
    const inventoryData = inventoryItem.row;
    
    // Pula a linha do cabeçalho
    if (salesData["0"] === 'CÓD.') {
        return null;
    }
    
    // Captura as vendas mensais individuais
    const vendas_04 = parseFloat(String(salesData["3"]).replace(/\./g, '').replace(',', '.')) || 0;
    const vendas_05 = parseFloat(String(salesData["4"]).replace(/\./g, '').replace(',', '.')) || 0;
    const vendas_06 = parseFloat(String(salesData["5"]).replace(/\./g, '').replace(',', '.')) || 0;
    const totalVendas = vendas_04 + vendas_05 + vendas_06;
    
    const estoque = parseFloat(String(inventoryData["4"]).replace(/\./g, '').replace(',', '.')) || 0;

    // Retorna um objeto completo com todos os dados que vamos precisar
    return {
        Codigo: salesData["0"],
        Descricao: salesData["1"],
        Estoque: estoque,
        Total_Vendas: totalVendas,
        vendas_mes1: vendas_04, // <-- A chave para o histórico
        vendas_mes2: vendas_05, // <-- A chave para o histórico
        vendas_mes3: vendas_06  // <-- A chave para o histórico
    };
}).filter(item => item !== null);

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