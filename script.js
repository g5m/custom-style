// Dados dos produtos
const produtos = [
  { id: 1, nome: "Oversized Black", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80", preco: 120.00 },
  { id: 2, nome: "Oversized White", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", preco: 90.00 },
  { id: 3, nome: "Street Basic Hoodie", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80", preco: 180.00 },
  { id: 4, nome: "Urban Cap", img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80", preco: 60.00 },
  { id: 5, nome: "Classic Tee Earth", img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8?auto=format&fit=crop&w=500&q=80", preco: 70.00 },
  { id: 6, nome: "Minimal Jacket", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80", preco: 210.00 }
];

let carrinho = [];
let produtoAtual = null;

// Utilitário para formatar moeda
const formatarDinheiro = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// 1. Lógica de Carregamento (Loader)
window.onload = () => {
  setTimeout(() => {
    document.getElementById('loader').style.display = 'none';
  }, 1500); // Fica na tela por 1.5 segundos e some
  renderProdutos();
};

// 2. Lógica de Login
function entrarNaLoja() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainContent').style.display = 'block';
}

// 3. Renderizar Vitrine de Produtos
function renderProdutos() {
  const container = document.getElementById("products");
  container.innerHTML = ''; 
  produtos.forEach(p => {
    container.innerHTML += `
      <div class="card" onclick="abrirProduto(${p.id})">
        <img src="${p.img}" alt="${p.nome}" style="width: 100%; border-radius: 10px; margin-bottom: 15px; height: 250px; object-fit: cover;">
        <h3 style="margin-bottom: 10px; font-size: 1.1rem;">${p.nome}</h3>
        <p style="color: #b5e3d8; font-weight: bold;">${formatarDinheiro(p.preco)}</p>
      </div>
    `;
  });
}

// 4. Modal do Produto
function abrirProduto(id) {
  produtoAtual = produtos.find(p => p.id === id);
  document.getElementById("modalNome").innerText = produtoAtual.nome;
  document.getElementById("modalImg").src = produtoAtual.img;
  document.getElementById("modalPreco").innerText = formatarDinheiro(produtoAtual.preco);
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// 5. Carrinho de Compras
function addCarrinhoModal() {
  const itemExistente = carrinho.find(item => item.id === produtoAtual.id);
  if(itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ ...produtoAtual, quantidade: 1 });
  }
  atualizarCarrinho();
  fecharModal();
  alert(`✅ ${produtoAtual.nome} adicionado ao carrinho!`);
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  const totalEl = document.getElementById("total");
  const badge = document.getElementById("cart-badge");
  
  lista.innerHTML = "";
  let soma = 0;
  let qtdItens = 0;

  if(carrinho.length === 0) {
    lista.innerHTML = "<p style='text-align:center; color:#aaa;'>Seu carrinho está vazio.</p>";
  }

  carrinho.forEach(item => {
    soma += (item.preco * item.quantidade);
    qtdItens += item.quantidade;
    lista.innerHTML += `
      <li style="display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px;">
        <span>${item.nome} (x${item.quantidade})</span>
        <span style="font-weight: bold;">${formatarDinheiro(item.preco * item.quantidade)}</span>
      </li>
    `;
  });

  totalEl.innerText = "Total: " + formatarDinheiro(soma);
  badge.innerText = qtdItens;
}

// 6. Checkout e Finalizar Compra
function abrirCheckout() {
  document.getElementById("checkout").style.display = "flex";
}

function fecharCheckout() {
  document.getElementById("checkout").style.display = "none";
}

function finalizarCompra() {
  if(carrinho.length === 0) {
    alert("Adicione itens ao carrinho antes de finalizar!");
    return;
  }

  // --- BÔNUS: Integração com WhatsApp ---
  let textoMsg = "Olá! Gostaria de finalizar meu pedido do SENAI:%0A%0A";
  carrinho.forEach(item => {
    textoMsg += `- ${item.quantidade}x ${item.nome} (${formatarDinheiro(item.preco)})%0A`;
  });
  textoMsg += `%0ATotal: *${document.getElementById("total").innerText.replace("Total: ", "")}*`;

  // Mude este número para o seu telefone se quiser testar de verdade
  const numeroWhatsApp = "551199999999
