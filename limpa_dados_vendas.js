const items = $input.all();
const processedSales = [];

// Pula a primeira linha (cabeçalho)
for (let i = 1; i < items.length; i++) {
    const row = items[i].json.row;
    if (row && row["0"]) {
        const codigo = parseInt(String(row["0"]).trim(), 10);
        
        const vendas_04 = parseFloat(String(row["3"]).replace(/\./g, '').replace(',', '.')) || 0;
        const vendas_05 = parseFloat(String(row["4"]).replace(/\./g, '').replace(',', '.')) || 0;
        const vendas_06 = parseFloat(String(row["5"]).replace(/\./g, '').replace(',', '.')) || 0;

        processedSales.push({
            json: {
                Codigo: codigo,
                Descricao: row["1"],
                Vendas_1: vendas_04,
                Vendas_2: vendas_05,
                Vendas_3: vendas_06,
                Total_Vendas: vendas_04 + vendas_05 + vendas_06
            }
        });
    }
}
return processedSales;