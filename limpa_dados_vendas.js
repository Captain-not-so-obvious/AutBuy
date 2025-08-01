const items = $input.all();
// Pula a linha do cabeçalho
items.shift(); 
for(const item of items) {
    if (item.json.row && item.json.row["0"]) {
        // Converte o código para número para garantir a correspondência
        item.json.row["0"] = parseInt(String(item.json.row["0"]).trim(), 10);
    }
}
return items;