// ==========================================
// 1. BANCO DE DADOS DE PRODUTOS
// ==========================================
const produtos = [
  { id: 1, nome: "Camiseta Premium - Preto", img: "https://acdn-us.mitiendanube.com/stores/002/528/360/products/1-618f6b4ab8e674e78e17407569774936-1024-1024.webp", preco: 117.60 },
  { id: 2, nome: "Oversized White", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", preco: 90 },
  { id: 3, nome: "Street Basic Hoodie", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80", preco: 180 },
  { id: 4, nome: "Urban Cap", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80", preco: 60 },
  { id: 5, nome: "Classic Tee Earth", img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?auto=format&fit=crop&w=500&q=80", preco: 70 },
  { id: 6, nome: "Minimal Jacket", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80", preco: 210 }
];

// ==========================================
// 2. VARIÁVEIS GLOBAIS E UTILIDADES
// ==========================================
let carrinho = [];
let produtoSelecionado = null;
let tamanhoSelecionado = null;

const formatarDinheiro = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ==========================================
// 3. INICIALIZAÇÃO E NAVEGAÇÃO
// ==========================================
window.onload = () => {
  setTimeout(() => { document.getElementById('loader').style.display = 'none'; }, 1000);
  renderizarVitrine();
};

function entrarNaLoja() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}

function renderizarVitrine() {
  const divProducts = document.getElementById("products");
  divProducts.innerHTML = '';
  produtos.forEach(p => {
    divProducts.innerHTML += `
      <div class="card" onclick="abrirProduto(${p.id})">
        <img src="${p.img}" alt="${p.nome}">
        <h3 style="margin: 10px 0; color: #000;">${p.nome}</h3>
        <p style="color: #000; font-weight: bold; font-size: 1.2rem;">${formatarDinheiro(p.preco)}</p>
      </div>
    `;
  });
}

// ==========================================
// 4. LÓGICA DO MODAL (ESCOLHA DE PRODUTO)
// ==========================================
function abrirProduto(id) {
  produtoSelecionado = produtos.find(p => p.id === id);
  document.getElementById("modalNome").innerText = produtoSelecionado.nome;
  document.getElementById("modalImg").src = produtoSelecionado.img;
  document.getElementById("modalPreco").innerText = formatarDinheiro(produtoSelecionado.preco);
  
  // Reseta as escolhas sempre que abre um produto novo
  tamanhoSelecionado = null;
  document.getElementById("modalQtd").value = 1;
  document.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('selecionado'));

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() { 
  document.getElementById("modal").style.display = "none"; 
}

function selecionarTamanho(tam, elemento) {
  tamanhoSelecionado = tam;
  document.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('selecionado'));
  elemento.classList.add('selecionado');
}

function mudarQtd(valor) {
  const input = document.getElementById("modalQtd");
  let novaQtd = parseInt(input.value) + valor;
  if(novaQtd >= 1) { input.value = novaQtd; } // Não deixa a quantidade ser zero
}

// ==========================================
// 5. LÓGICA DO CARRINHO (GAVETA LATERAL)
// ==========================================
function abrirCheckout() { 
  document.getElementById("checkout").classList.add("aberto"); 
}
function fecharCheckout() { 
  document.getElementById("checkout").classList.remove("aberto"); 
}

function addCarrinho() {
  if(!tamanhoSelecionado) {
    alert("⚠️ Por favor, escolha um tamanho antes de adicionar ao carrinho!");
    return;
  }

  const qtdEscolhida = parseInt(document.getElementById("modalQtd").value);

  // Procura se ESSE produto COM ESSE tamanho já existe no carrinho
  const itemJaExiste = carrinho.find(item => item.id === produtoSelecionado.id && item.tamanho === tamanhoSelecionado);
  
  if(itemJaExiste) {
    itemJaExiste.quantidade += qtdEscolhida;
  } else {
    carrinho.push({ ...produtoSelecionado, quantidade: qtdEscolhida, tamanho: tamanhoSelecionado });
  }
  
  atualizarCarrinho();
  fecharModal();
  abrirCheckout(); // Já abre a gaveta direto para mostrar o que adicionou
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  let total = 0; 
  let qtd = 0;
  lista.innerHTML = "";

  if(carrinho.length === 0) {
    lista.innerHTML = "<p style='color:#aaa; text-align:center; margin-top: 40px; font-family: Arial;'>O carrinho de compras está vazio.</p>";
  }

  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    qtd += item.quantidade;
    
    // Mostrando foto, Tamanho e Quantidade bonitos na gaveta
    lista.innerHTML += `
      <li class="cart-item">
        <img src="${item.img}" alt="${item.nome}" style="width: 75px; height: 95px; object-fit: cover; border-radius: 4px;">
        <div style="flex: 1; display:flex; flex-direction: column; gap: 4px;">
          <span style="font-weight: bold; font-family: 'Arial Black', sans-serif; font-size: 0.9rem;">${item.nome}</span>
          <span style="font-size: 0.8rem; color: #666; font-family: Arial;">Tamanho: <b>${item.tamanho}</b></span>
          <span style="font-size: 0.95rem; font-weight: bold; font-family: Arial; margin-top: 5px;">${formatarDinheiro(item.preco)}</span>
        </div>
        <div style="font-weight: bold; font-family: Arial; background: #f4f4f4; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; font-size: 0.9rem;">x${item.quantidade}</div>
      </li>
    `;
  });

  // Atualiza Subtotal e Total na gaveta
  document.getElementById("subtotal").innerText = formatarDinheiro(total);
  document.getElementById("total").innerText = formatarDinheiro(total);
  
  // Atualiza a bolinha de quantidade no cabeçalho do site
  document.getElementById("cart-badge").innerText = qtd;
}

// ==========================================
// 6. PAGAMENTO SIMULADO (FAKE CHECKOUT)
// ==========================================
function finalizarCompra() {
  if(carrinho.length === 0) { 
    alert("Adicione algo ao carrinho primeiro!"); 
    return; 
  }
  
  // Pega o valor total sem o "R$ " e coloca na tela de pagamento
  const valorTotal = document.getElementById("total").innerText;
  document.getElementById("total-pagamento").innerText = valorTotal;

  fecharCheckout(); // Fecha a gaveta
  document.getElementById("paymentScreen").style.display = "flex"; // Abre a tela final
  document.getElementById("caixa-pagamento").style.display = "block";
  document.getElementById("caixa-sucesso").style.display = "none";
}

function voltarParaCarrinho() {
  document.getElementById("paymentScreen").style.display = "none";
  abrirCheckout(); // Reabre a gaveta
}

function simularPagamento(metodo) {
  const tituloPagamento = document.querySelector("#caixa-pagamento h2");
  
  tituloPagamento.innerText = "Processando " + metodo + "...";
  tituloPagamento.style.color = "#888888";

  setTimeout(() => {
    document.getElementById("caixa-pagamento").style.display = "none";
    document.getElementById("caixa-sucesso").style.display = "block";
    
    tituloPagamento.innerText = "Pagamento";
    tituloPagamento.style.color = "#000000";

    // Limpa o carrinho
    carrinho = [];
    atualizarCarrinho();
  }, 2000); 
}

function voltarParaLoja() {
  document.getElementById("paymentScreen").style.display = "none";
}
