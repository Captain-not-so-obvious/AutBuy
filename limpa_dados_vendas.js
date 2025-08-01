const items = $input.all();

if (items.length < 2) {
  return []; // Garante que o arquivo não está vazio
}

// Pega a primeira linha para ler os cabeçalhos
const headerRow = items[0].json.row;
const salesColumns = [];

// Encontra dinamicamente as colunas de vendas pelo formato "MM/YYYY"
for (const key in headerRow) {
  const headerText = headerRow[key];
  if (/\d{2}\/\d{4}/.test(headerText)) {
    const [mes, ano] = headerText.split('/');
    salesColumns.push({
      index: key,
      mes: parseInt(mes, 10),
      ano: parseInt(ano, 10)
    });
  }
}

if (salesColumns.length === 0) {
  throw new Error("Nenhuma coluna de vendas no formato MM/YYYY foi encontrada no cabeçalho.");
}

const monthlySalesRecords = [];
// Começa do item 1 para pular a linha do cabeçalho
for (let i = 1; i < items.length; i++) {
  const row = items[i].json.row;
  if (row && row["0"]) {
    const codigo = parseInt(String(row["0"]).trim(), 10);
    const descricao = row["1"];

    // Para cada coluna de venda encontrada, cria um registro separado
    for (const col of salesColumns) {
      const vendaDoMes = parseFloat(String(row[col.index]).replace(/\./g, '').replace(',', '.')) || 0;
      
      monthlySalesRecords.push({
        json: {
          ano: col.ano,
          mes: col.mes,
          codigo: codigo,
          descricao: descricao,
          vendas_no_mes: vendaDoMes
        }
      });
    }
  }
}

return monthlySalesRecords;