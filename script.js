const produtos = [
  { id: 1, nome: "Oversized Black", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80", preco: 120 },
  { id: 2, nome: "Oversized White", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", preco: 90 },
  { id: 3, nome: "Street Basic Hoodie", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80", preco: 180 },
  { id: 4, nome: "Urban Cap", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80", preco: 60 },
  { id: 5, nome: "Classic Tee Earth", img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?auto=format&fit=crop&w=500&q=80", preco: 70 },
  { id: 6, nome: "Minimal Jacket", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80", preco: 210 }
];

let carrinho = [];
let produtoSelecionado = null;
let tamanhoSelecionado = null;

const formatarDinheiro = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Animação de entrada
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
        <h3 style="margin: 10px 0;">${p.nome}</h3>
        <p style="color: #b5e3d8; font-weight: bold; font-size: 1.2rem;">${formatarDinheiro(p.preco)}</p>
      </div>
    `;
  });
}

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

// NOVAS FUNÇÕES: Controlam o tamanho e os botões de + e -
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
function fecharModal() { document.getElementById("modal").style.display = "none"; }
function abrirCheckout() { document.getElementById("checkout").style.display = "flex"; }
function fecharCheckout() { document.getElementById("checkout").style.display = "none"; }

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
  alert("✅ Adicionado ao carrinho com sucesso!");
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  let total = 0; let qtd = 0;
  lista.innerHTML = "";

  if(carrinho.length === 0) {
    lista.innerHTML = "<p style='color:#aaa; text-align:center;'>Seu carrinho está vazio</p>";
  }

  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    qtd += item.quantidade;
    lista.innerHTML += `
      <li class="cart-item">
        <span>${item.nome} <b>(${item.tamanho})</b> <b style="color:#b5e3d8;">(x${item.quantidade})</b></span>
        <span>${formatarDinheiro(item.preco * item.quantidade)}</span>
      </li>
    `;
  });

  document.getElementById("total").innerText = "Total: " + formatarDinheiro(total);
  document.getElementById("cart-badge").innerText = qtd;
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  let total = 0; let qtd = 0;
  lista.innerHTML = "";

  if(carrinho.length === 0) {
    lista.innerHTML = "<p style='color:#aaa; text-align:center;'>Seu carrinho está vazio</p>";
  }

  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    qtd += item.quantidade;
    lista.innerHTML += `
      <li class="cart-item">
        <span>${item.nome} <b style="color:#b5e3d8;">(x${item.quantidade})</b></span>
        <span>${formatarDinheiro(item.preco * item.quantidade)}</span>
      </li>
    `;
  });

  document.getElementById("total").innerText = "Total: " + formatarDinheiro(total);
  document.getElementById("cart-badge").innerText = qtd;
}

// ==========================================
// FLUXO DE CHECKOUT E PAGAMENTO SIMULADO
// ==========================================

function finalizarCompra() {
  if(carrinho.length === 0) { 
    alert("Adicione algo ao carrinho primeiro!"); 
    return; 
  }
  
  const valorTotal = document.getElementById("total").innerText.replace("Total: ", "");
  document.getElementById("total-pagamento").innerText = valorTotal;

  fecharCheckout();
  document.getElementById("paymentScreen").style.display = "flex";
  document.getElementById("caixa-pagamento").style.display = "block";
  document.getElementById("caixa-sucesso").style.display = "none";
}

function voltarParaCarrinho() {
  document.getElementById("paymentScreen").style.display = "none";
  abrirCheckout();
}

function simularPagamento(metodo) {
  const tituloPagamento = document.querySelector("#caixa-pagamento h2");
  
  tituloPagamento.innerText = "Processando " + metodo + "...";
  tituloPagamento.style.color = "#aaaaaa";

  setTimeout(() => {
    document.getElementById("caixa-pagamento").style.display = "none";
    document.getElementById("caixa-sucesso").style.display = "block";
    
    tituloPagamento.innerText = "Pagamento";
    tituloPagamento.style.color = "#ffffff";

    carrinho = [];
    atualizarCarrinho();
  }, 2000); 
}

function voltarParaLoja() {
  document.getElementById("paymentScreen").style.display = "none";
}
