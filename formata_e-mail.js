const items = $input.all();
let html = '<table style="width:100%; border-collapse: collapse;">';
html += '<tr style="background-color:#f2f2f2;">';
html += '<th style="border: 1px solid #ddd; padding: 8px;">Código</th>';
html += '<th style="border: 1px solid #ddd; padding: 8px;">Descrição</th>';
html += '<th style="border: 1px solid #ddd; padding: 8px;">Quantidade</th>';
html += '</tr>';

for (const item of items) {
  html += '<tr>';
  html += `<td style="border: 1px solid #ddd; padding: 8px;">${item.json.Codigo}</td>`;
  html += `<td style="border: 1px solid #ddd; padding: 8px;">${item.json.Descricao}</td>`;
  html += `<td style="border: 1px solid #ddd; padding: 8px;">${item.json.Sugestao_Compra}</td>`;
  html += '</tr>';
}

html += '</table>';

// Retorna um único item com o HTML da tabela
return [{ json: { html: html } }];