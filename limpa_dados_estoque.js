const items = $input.all();
const processedInventory = [];

for (const item of items) {
    const row = item.json.row;
    if (row && row["0"]) {
        const codigo = parseInt(String(row["0"]).trim(), 10);
        const estoque = parseFloat(String(row["4"]).replace(/\./g, '').replace(',', '.')) || 0;

        processedInventory.push({
            json: {
                Codigo: codigo,
                Estoque: estoque
            }
        });
    }
}
return processedInventory;