const items = $input.all();
const historicalRecords = [];
const currentDate = new Date();

for (const item of items) {
    const json = item.json;

    // Pega as datas dos últimos 3 meses
    const data_m1 = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1);
    const data_m2 = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
    const data_m3 = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

    // Cria um registro no banco para cada mês
    historicalRecords.push({ json: { ano: data_m1.getFullYear(), mes: data_m1.getMonth() + 1, codigo: json.Codigo, descricao: json.Descricao, vendas_no_mes: json.vendas_mes1 } });
    historicalRecords.push({ json: { ano: data_m2.getFullYear(), mes: data_m2.getMonth() + 1, codigo: json.Codigo, descricao: json.Descricao, vendas_no_mes: json.vendas_mes2 } });
    historicalRecords.push({ json: { ano: data_m3.getFullYear(), mes: data_m3.getMonth() + 1, codigo: json.Codigo, descricao: json.Descricao, vendas_no_mes: json.vendas_mes3 } });
}

return historicalRecords;