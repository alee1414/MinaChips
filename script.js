const WHATSAPP_NUMBER = '526699932277';

// ─── ESPERAR A QUE EL DOM ESTÉ LISTO ─────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // ─── HAMBURGUESA ────────────────────────────────────────
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // ─── SMOOTH SCROLL ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  // ─── CARRITO DRAWER ─────────────────────────────────────
  const cartBtn  = document.getElementById('navCartBtn');
  const drawer   = document.getElementById('carritoDrawer');
  const overlay  = document.getElementById('carritoOverlay');
  const closeBtn = document.getElementById('carritoClose');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  // ─── CARRITO STATE ──────────────────────────────────────
  let carrito = {};

  function renderCarrito() {
    const items    = Object.values(carrito);
    const badge    = document.getElementById('cartBadge');
    const vacio    = document.getElementById('carritoVacio');
    const itemsEl  = document.getElementById('carritoItems');
    const footerEl = document.getElementById('carritoFooter');
    const totalEl  = document.getElementById('carritoTotalItems');

    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    badge.textContent = totalQty;

    if (items.length === 0) {
      vacio.style.display    = 'block';
      itemsEl.style.display  = 'none';
      footerEl.style.display = 'none';
      return;
    }

    vacio.style.display    = 'none';
    itemsEl.style.display  = 'flex';
    footerEl.style.display = 'flex';
    totalEl.textContent    = totalQty;

    itemsEl.innerHTML = items.map(item => `
      <div class="carrito-item">
        <img src="${item.img}" alt="${item.nombre}" onerror="this.style.display='none'" />
        <div class="carrito-item-info">
          <div class="carrito-item-nombre">${item.nombre.toUpperCase()}</div>
          <div class="carrito-item-qty">
            <button class="qty-btn" data-action="menos" data-key="${item.nombre}">&#8722;</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="mas" data-key="${item.nombre}">+</button>
          </div>
        </div>
        <button class="btn-eliminar" data-key="${item.nombre}">Eliminar</button>
      </div>
    `).join('');

    itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        if (btn.dataset.action === 'mas') {
          carrito[key].qty++;
        } else {
          carrito[key].qty--;
          if (carrito[key].qty <= 0) delete carrito[key];
        }
        renderCarrito();
      });
    });

    itemsEl.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        delete carrito[btn.dataset.key];
        renderCarrito();
      });
    });
  }

  // ─── AGREGAR AL CARRITO ─────────────────────────────────
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', function () {
      const nombre = this.dataset.nombre;
      const img    = this.dataset.img;

      if (carrito[nombre]) {
        carrito[nombre].qty++;
      } else {
        carrito[nombre] = { nombre, img, qty: 1 };
      }
      renderCarrito();

      // Feedback en botón
      const original = this.textContent;
      this.textContent = '✓ AGREGADO';
      this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      setTimeout(() => { this.textContent = original; this.style.background = ''; }, 1400);

    });
  });

  // ─── PEDIDO CARRITO → WHATSAPP ──────────────────────────
  document.getElementById('btnPedidoCarrito').addEventListener('click', () => {
    const items = Object.values(carrito);
    if (items.length === 0) return;
    const lista = items.map(i => `• ${i.nombre} x${i.qty}`).join('\n');
    const texto = `¡Hola! Quiero hacer un pedido:\n\n${lista}\n\nTotal: ${items.reduce((s,i)=>s+i.qty,0)} producto(s)`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
  });

  // ─── ARMA TU MIX → WHATSAPP ─────────────────────────────
  const textarea  = document.getElementById('mixMensaje');
  const charCount = document.getElementById('charCount');

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    charCount.textContent = `${len}/200`;
    charCount.style.color = len >= 200 ? '#ff4444' : '';
  });

  document.getElementById('btnPedido').addEventListener('click', () => {
    const msg = textarea.value.trim();
    if (!msg) {
      textarea.focus();
      textarea.style.borderColor = '#ff4444';
      setTimeout(() => { textarea.style.borderColor = ''; }, 1500);
      return;
    }
    const texto = `¡Hola! Quiero hacer un pedido personalizado:\n\n${msg}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, '_blank');
  });

  // Init
  renderCarrito();

}); // fin DOMContentLoaded

// ─── EMBER PARTICLES (fuera del DOMContentLoaded está bien) ──
function createEmber() {
  const ember = document.createElement('div');
  ember.classList.add('ember');
  const size = Math.random() * 5 + 2;
  ember.style.cssText = `
    width:${size}px;height:${size}px;
    left:${Math.random()*100}vw;
    animation-duration:${Math.random()*4+3}s;
    animation-delay:${Math.random()*3}s;
    --drift:${(Math.random()-0.5)*120}px;
    box-shadow:0 0 ${size*2}px rgba(255,107,0,0.8);
  `;
  document.body.appendChild(ember);
  setTimeout(() => ember.remove(), 8000);
}
setInterval(createEmber, 400);
