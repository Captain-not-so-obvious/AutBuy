// Pega o resultado do nó de estoque
const estoqueItens = $input.all()

// Pega o resultado do nó de venda pelo nome
const vendasItens = $('Extract Vendas from File').all();

// Cria um "mapa" para facilitar a busca dos dados de vendas pelo código do produto
const mapaDeVendas = new Map();
vendasItens.forEach(item => {
  const codigo = item.json.column_1;
  if (codigo) {
    mapaDeVendas.set(codigo.toString(), item.json);
  }
});

// Justa os dados de venda e estoque em uma única lista
const mergedData = [];
estoqueItens.forEach(item => {
  const estoqueDados = item.json;
  const codigo = estoqueDados.column_1;

  if (codigo && mapaDeVendas.has(codigo.toString())) {
    const vendasDados = mapaDeVendas.get(codigo.toString());
    mergedData.push({
      vendas: vendasDados,
      estoque: estoqueDados
    });
  }
});

// 1 - Limpeza e Preparação dos Dados
const itensLimpos = mergedData.map(item => {
  const vendasDados = item.vendas;
  const estoqueDados = item.estoque;

  const vendasMes1 = parseFloat(String(vendasDados.column_4).replace(/\./g, '').replace(',', '.')) || 0;
  const vendasMes2 = parseFloat(String(vendasDados.column_5).replace(/\./g, '').replace(',', '.')) || 0;
  const vendasMes3 = parseFloat(String(vendasDados.column_6).replace(/\./g, '').replace(',', '.')) || 0;
  const totalVendas = vendasMes1 + vendasMes2 + vendasMes3;

  const estoque = parseFloat(String(estoqueDados.column_5).replace(/\./g, '').replace(',', '.')) || 0;

  return {
    Codigo: vendasDados.column_1,
    Descricao: vendasDados.column_2,
    Total_Vendas: totalVendas,
    Estoque: estoque
  };
});

// 2 - Análise ABC
itensLimpos.sort((a, b) => b.Total_Vendas - a.Total_Vendas);
const totalVendasGeral = itensLimpos.reduce((acc, item) => acc + item.Total_Vendas, 0);
let vendasAcumuladas = 0;

itensLimpos.forEach(item => {
  if(totalVendasGeral > 0) {
    vendasAcumuladas += item.Total_Vendas;
    const porcentagemAcumulada = (vendasAcumuladas / totalVendasGeral) * 100;

    if (porcentagemAcumulada <= 80) {
      item.Categoria = 'A';
    } else if (porcentagemAcumulada <= 95) {
      item.Categoria = 'B';
    } else {
      item.Categoria = 'C';
    }
  } else {
    item.Categoria = 'C'; // padrão caso não existam vendas do produto
  }
});

// 3 - Cálculo da Sugestão de Compra
itensLimpos.forEach(item => {
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

// Retorna os dados formatados para o próximo nó
return itensLimpos.map(item => ({ json: item }));