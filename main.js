// Pega os dados de entrada
const inventoryItems = $input.all();
const salesItems = $('Extract Vendas From File').all();

// 1. CRIA UM "MAPA" COM OS DADOS DE VENDA PARA FACILITAR A BUSCA
const salesMap = new Map();

// Começa do item 1 para pular o cabeçalho do arquivo de vendas
for (let i = 1; i < salesItems.length; i++) {
    const item = salesItems[i];
    const row = item.json.row;
    
    // A COLUNA "0" DO ARQUIVO DE VENDAS É O CÓDIGO DO PRODUTO
    const codigo = row["0"];
    
    if (codigo) {
        // AS COLUNAS "3", "4" E "5" SÃO AS VENDAS DOS ÚLTIMOS 3 MESES
        const vendas_04 = parseFloat(String(row["3"]).replace(/\./g, '').replace(',', '.')) || 0;
        const vendas_05 = parseFloat(String(row["4"]).replace(/\./g, '').replace(',', '.')) || 0;
        const vendas_06 = parseFloat(String(row["5"]).replace(/\./g, '').replace(',', '.')) || 0;
        const totalVendas = vendas_04 + vendas_05 + vendas_06;
        
        const cleanKey = String(codigo).trim();
        salesMap.set(cleanKey, {
            Total_Vendas: totalVendas,
            // A COLUNA "1" DO ARQUIVO DE VENDAS É A DESCRIÇÃO
            Descricao: row["1"]
        });
    }
}

// 2. COMBINA OS DADOS DE ESTOQUE E VENDAS
const combinedItems = inventoryItems.map(item => {
    const row = item.json.row;
    
    // A COLUNA "0" DO ARQUIVO DE ESTOQUE É O CÓDIGO DO PRODUTO
    const codigo = row["0"];
    // A COLUNA "4" DO ARQUIVO DE ESTOQUE É O SALDO ATUAL
    const estoque = parseFloat(String(row["4"]).replace(/\./g, '').replace(',', '.')) || 0;
    
    const cleanKey = codigo ? String(codigo).trim() : '';
    const salesData = salesMap.get(cleanKey);

    return {
        Codigo: codigo,
        Descricao: salesData ? salesData.Descricao : row["1"],
        Estoque: estoque,
        Total_Vendas: salesData ? salesData.Total_Vendas : 0
    };
});

// 3. FAZ A ANÁLISE ABC
combinedItems.sort((a, b) => b.Total_Vendas - a.Total_Vendas);
const totalVendasGeral = combinedItems.reduce((acc, item) => acc + item.Total_Vendas, 0);
let vendasAcumuladas = 0;

combinedItems.forEach(item => {
    let categoria = 'C';
    if (totalVendasGeral > 0) {
        vendasAcumuladas += item.Total_Vendas;
        const porcentagemAcumulada = (vendasAcumuladas / totalVendasGeral) * 100;

        if (porcentagemAcumulada <= 80) {
            categoria = 'A';
        } else if (porcentagemAcumulada <= 95) {
            categoria = 'B';
        }
    }
    item.Categoria = categoria;
});

// 4. CALCULA A SUGESTÃO DE COMPRA
combinedItems.forEach(item => {
    const vendasMediasMensais = item.Total_Vendas / 3;
    let mesesEstoque = 1;

    if (item.Categoria === 'A') {
        mesesEstoque = 3;
    } else if (item.Categoria === 'B') {
        mesesEstoque = 2;
    }

    const sugestao = (vendasMediasMensais * mesesEstoque) - item.Estoque;
    item.Sugestao_Compra = sugestao > 0 ? Math.ceil(sugestao) : 0;
});

// 5. RETORNA OS DADOS FINAIS
return combinedItems.map(item => ({
    json: {
        Codigo: item.Codigo,
        Descricao: item.Descricao,
        Total_Vendas: item.Total_Vendas,
        Estoque: item.Estoque,
        Categoria: item.Categoria,
        Sugestao_Compra: item.Sugestao_Compra
    }
}));