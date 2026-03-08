/* =============================================
   VapeShop Mini App — JavaScript
   ============================================= */
// ==================== DATA ====================
const PRODUCTS = [
  { id:1, name:'Berry Mix', sub:'20mg', price:16, emoji:'🫐', cat:'liquid', chars:{nic:'20mg Salt',vg:'70/30',vol:'30ml',brand:'Lost Mary'}, desc:'Сочный ягодный микс с освежающим послевкусием.', flavors:['Ягоды','Малина','Черника'] },
  { id:2, name:'Vaporesso Kit', sub:'80W MOD', price:45, emoji:'⚡', cat:'pod', chars:{nic:'—',vg:'—',vol:'—',brand:'Vaporesso'}, desc:'Мощный мод 80Вт с регулировкой температуры и OLED дисплеем.', flavors:[] },
  { id:3, name:'Mango Ice', sub:'20mg', price:16, emoji:'🥭', cat:'liquid', chars:{nic:'20mg Salt',vg:'70/30',vol:'30ml',brand:'ElfLiq'}, desc:'Тропическое манго с ледяным охлаждением.', flavors:['Манго','Лёд','Тропик'] },
  { id:4, name:'Elf Bar 600', sub:'600 тяг', price:9, emoji:'🟣', cat:'disposable', chars:{nic:'20mg',vg:'50/50',vol:'2ml',brand:'Elf Bar'}, desc:'Компактная одноразка на 600 затяжек. 20+ вкусов.', flavors:['Blueberry Ice','Strawberry','Cola'] },
  { id:5, name:'Mocha Latte', sub:'20mg', price:18, emoji:'☕', cat:'liquid', chars:{nic:'20mg Salt',vg:'70/30',vol:'30ml',brand:'FUMOT'}, desc:'Насыщенный кофейный вкус со сливочным послевкусием.', flavors:['Кофе','Сливки','Ваниль'] },
  { id:6, name:'GeekVape Aegis', sub:'Aegis X2', price:54, emoji:'🔧', cat:'pod', chars:{nic:'—',vg:'—',vol:'—',brand:'GeekVape'}, desc:'IP68 защита, двойной аккумулятор 4000мАч.', flavors:[] },
  { id:7, name:'Blackberry Ice', sub:'30ml Salt', price:19.9, emoji:'🫙', cat:'liquid', chars:{nic:'20mg Salt',vg:'50/50',vol:'30ml',brand:'Lost Mary'}, desc:'Насыщенный ягодный вкус с ледяным охлаждением.', flavors:['Ежевика','Лёд','Ягоды'] },
  { id:8, name:'Lost Mary 5000', sub:'5000 тяг', price:22, emoji:'🖤', cat:'disposable', chars:{nic:'20mg',vg:'50/50',vol:'13ml',brand:'Lost Mary'}, desc:'Одноразка премиум-класса на 5000 затяжек.', flavors:['Watermelon Ice','Peach Mango','Lemon Mint'] },
  { id:9, name:'Испаритель GTX', sub:'0.6Ω Mesh', price:8, emoji:'🔩', cat:'accessories', chars:{nic:'—',vg:'—',vol:'—',brand:'Vaporesso'}, desc:'Сетчатый испаритель для GTX Pod 22. Ресурс ~3 нед.', flavors:[] },
  { id:10, name:'Картридж Nord', sub:'LP2 Pod', price:12, emoji:'🧪', cat:'accessories', chars:{nic:'—',vg:'—',vol:'—',brand:'SMOK'}, desc:'Картридж 2.5мл с испарителем 0.6Ω для Nord 5.', flavors:[] },
  { id:11, name:'Батарейка 18650', sub:'3500mAh', price:6, emoji:'🔋', cat:'accessories', chars:{nic:'—',vg:'—',vol:'—',brand:'Samsung'}, desc:'Samsung 35E высокоёмкостная для мощных модов.', flavors:[] },
  { id:12, name:'Vozol Neon 10000', sub:'10000 тяг', price:28, emoji:'🌟', cat:'disposable', chars:{nic:'20mg',vg:'50/50',vol:'23ml',brand:'Vozol'}, desc:'Мощная одноразка с RGB подсветкой и дисплеем.', flavors:['Blue Razz Lemonade','Strawberry Banana','Grape Ice'] },
];

let cart = [];
let currentScreen = 'screen-home';
let prevScreen = 'screen-home';
let currentDetailId = null;
let detailQty = 1;
let favIds = new Set();
let currentCat = 'all';
let currentCatCatalog = 'all';

// Admin data
let adminProducts = [...PRODUCTS.map(p => ({...p, stock: Math.floor(Math.random()*20)+3}))];
const adminOrders = [
  { id:'#1047', time:'5 мин', client:'Иван С.', phone:'+7 999 111 22 33', items:'Blackberry Ice × 2, Mango Ice × 1', total:55.80, status:'new' },
  { id:'#1046', time:'23 мин', client:'Мария П.', phone:'+7 926 555 77 88', items:'GeekVape Aegis × 1', total:54.00, status:'transit' },
  { id:'#1045', time:'1 час', client:'Олег К.', phone:'+7 916 333 44 55', items:'Elf Bar 600 × 5, Berry Mix × 2', total:77.00, status:'done' },
  { id:'#1044', time:'3 часа', client:'Анна Р.', phone:'+7 903 222 11 00', items:'Vaporesso Kit × 1, испаритель GTX × 2', total:61.00, status:'new' },
  { id:'#1043', time:'5 часов', client:'Дима В.', phone:'+7 985 444 66 77', items:'Mocha Latte × 3', total:54.00, status:'transit' },
  { id:'#1042', time:'Вчера', client:'Света М.', phone:'+7 912 777 88 99', items:'Lost Mary 5000 × 2, Vozol Neon × 1', total:72.00, status:'done' },
];

// ==================== RENDER PRODUCTS ====================
function renderProducts(gridId, products) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openDetail(${p.id})">
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-sub">${p.sub}</div>
        <div class="product-bottom">
          <span class="product-price">$${p.price}</span>
          <button class="add-btn" onclick="event.stopPropagation();quickAddToCart(${p.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(query) {
  const q = query.toLowerCase();
  const filtered = PRODUCTS.filter(p => 
    (currentCat === 'all' || p.cat === currentCat) &&
    (p.name.toLowerCase().includes(q) || p.sub.toLowerCase().includes(q))
  );
  renderProducts('products-grid', filtered);
}

function filterCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('#home-cats .cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  renderProducts('products-grid', filtered);
}

function filterCatCatalog(cat, el) {
  currentCatCatalog = cat;
  document.querySelectorAll('#catalog-cats .cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  renderProducts('catalog-grid', filtered);
}

// ==================== NAVIGATION ====================
function goTo(screenId) {
  prevScreen = currentScreen;
  document.querySelectorAll('#client-app .screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  currentScreen = screenId;
  if (screenId === 'screen-cart') renderCart();
  if (screenId === 'screen-catalog') renderProducts('catalog-grid', PRODUCTS);
}

function goBack() {
  goTo(prevScreen === currentScreen ? 'screen-home' : prevScreen);
}

function openSub(id) {
  const sub = document.getElementById(id);
  sub.style.display = 'flex';
  setTimeout(() => sub.classList.add('open'), 10);
}

function closeSub(id) {
  const sub = document.getElementById(id);
  sub.classList.remove('open');
  setTimeout(() => sub.style.display = 'none', 300);
}

// ==================== PRODUCT DETAIL ====================
function openDetail(id) {
  currentDetailId = id;
  detailQty = 1;
  const p = PRODUCTS.find(x => x.id === id);
  prevScreen = currentScreen;
  document.getElementById('detail-emoji').textContent = p.emoji;
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-price').textContent = `$${p.price}`;
  document.getElementById('detail-qty').textContent = 1;
  document.getElementById('fav-btn').textContent = favIds.has(id) ? '♥ Избранное' : '♡ В избр.';
  document.getElementById('detail-specs').innerHTML = `
    <div class="spec-row"><span class="spec-label">BRAND:</span> ${p.chars.brand}</div>
    <div class="spec-row"><span class="spec-label">Крепость:</span> ${p.chars.nic}</div>
    <div class="spec-row"><span class="spec-label">Объём:</span> ${p.chars.vol}</div>
    <div class="spec-row"><span class="spec-label">VG/PG:</span> ${p.chars.vg}</div>
  `;
  document.getElementById('detail-flavor').innerHTML = p.flavors.length 
    ? `<div style="margin-bottom:8px">${p.flavors.map(f=>`<span class="flavor-tag">${f}</span>`).join('')}</div><p class="detail-desc">${p.desc}</p>`
    : `<p class="detail-desc">${p.desc}</p>`;
  document.getElementById('detail-chars').innerHTML = Object.entries(p.chars).map(([k,v]) => `
    <div class="char-item"><div class="char-key">${k.toUpperCase()}</div><div class="char-val">${v||'—'}</div></div>
  `).join('');
  goTo('screen-detail');
}

function changeDetailQty(d) {
  detailQty = Math.max(1, detailQty + d);
  document.getElementById('detail-qty').textContent = detailQty;
}

function addDetailToCart() {
  const p = PRODUCTS.find(x => x.id === currentDetailId);
  for (let i = 0; i < detailQty; i++) quickAddToCart(p.id, true);
  showToast(`${p.name} добавлен в корзину ✓`);
  updateBadges();
}

function toggleFav() {
  if (favIds.has(currentDetailId)) {
    favIds.delete(currentDetailId);
    document.getElementById('fav-btn').textContent = '♡ В избр.';
    showToast('Удалено из избранного');
  } else {
    favIds.add(currentDetailId);
    document.getElementById('fav-btn').textContent = '♥ Избранное';
    showToast('Добавлено в избранное ♥');
  }
}

// ==================== CART ====================
function quickAddToCart(id, silent) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else {
    const p = PRODUCTS.find(x => x.id === id);
    cart.push({ id, qty: 1, name: p.name, sub: p.sub, price: p.price, emoji: p.emoji });
  }
  updateBadges();
  if (!silent) showToast('Добавлено в корзину ✓');
}

function updateBadges() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  ['cart-badge','cart-badge2','cart-badge3','cart-badge4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = total;
  });
}

function renderCart() {
  const content = document.getElementById('cart-content');
  const footer = document.getElementById('cart-footer');
  if (!cart.length) {
    content.innerHTML = `<div class="empty-cart"><span>🛒</span><p>Корзина пуста</p></div>`;
    footer.innerHTML = '';
    return;
  }
  content.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sub">${item.sub}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
        <button class="del-btn" onclick="removeCartItem(${item.id})">🗑</button>
        <div class="qty-controls">
          <button class="qty-btn minus" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn plus" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  footer.innerHTML = `
    <div class="cart-total">
      <span class="cart-total-label">Итого:</span>
      <span class="cart-total-val">$${total.toFixed(2)}</span>
    </div>
    <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
  `;
}

function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateBadges();
  renderCart();
}

function removeCartItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateBadges();
  renderCart();
  showToast('Товар удалён из корзины');
}

function checkout() {
  cart = [];
  updateBadges();
  renderCart();
  showToast('Заказ оформлен! 🎉');
}

// ==================== UTILS ====================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

function toggleFaq(el) {
  const a = el.querySelector('.faq-a');
  a.classList.toggle('open');
}

// ==================== APP SELECTOR ====================
function showApp(app) {
  document.querySelectorAll('.app-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (app === 'client') {
    document.getElementById('client-app').style.display = 'block';
    document.getElementById('admin-app').style.display = 'none';
  } else {
    document.getElementById('client-app').style.display = 'none';
    document.getElementById('admin-app').style.display = 'block';
  }
}

// ==================== ADMIN ====================
function adminLogin() {
  const u = document.getElementById('admin-user').value;
  const p = document.getElementById('admin-pass').value;
  if (u === 'admin' && p === 'admin') {
    document.getElementById('admin-login-screen').classList.remove('active');
    document.getElementById('admin-dashboard').classList.add('active');
    renderAdminProducts();
    renderDashProducts();
    renderAdminOrders('all');
  } else {
    showToast('Неверный логин или пароль');
  }
}

function adminLogout() {
  document.querySelectorAll('#admin-app .admin-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('admin-login-screen').classList.add('active');
}

function adminGoTo(id) {
  document.querySelectorAll('#admin-app .admin-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'admin-products') renderAdminProducts();
  if (id === 'admin-orders') renderAdminOrders('all');
  if (id === 'admin-dashboard') renderDashProducts();
}

function renderAdminProducts() {
  const list = document.getElementById('admin-products-list');
  document.getElementById('product-count').textContent = adminProducts.length;
  list.innerHTML = adminProducts.map(p => {
    const stockClass = p.stock === 0 ? 'stock-out' : p.stock < 5 ? 'stock-low' : 'stock-ok';
    const stockLabel = p.stock === 0 ? 'Нет в наличии' : p.stock < 5 ? `Осталось ${p.stock}` : `В наличии: ${p.stock}`;
    return `
      <div class="admin-product-card">
        <div class="admin-product-img">${p.emoji}</div>
        <div class="admin-product-info">
          <div class="admin-product-name">${p.name}</div>
          <div class="admin-product-cat">${catLabel(p.cat)}</div>
        </div>
        <div class="admin-product-right">
          <div class="admin-product-price">$${p.price}</div>
          <div class="admin-stock ${stockClass}">${stockLabel}</div>
        </div>
        <button class="admin-del-btn" onclick="deleteAdminProduct(${p.id})">🗑</button>
      </div>
    `;
  }).join('');
}

function renderDashProducts() {
  const list = document.getElementById('dash-products');
  if (!list) return;
  list.innerHTML = adminProducts.slice(0,4).map(p => {
    const stockClass = p.stock < 5 ? 'stock-low' : 'stock-ok';
    return `
      <div class="admin-product-card">
        <div class="admin-product-img">${p.emoji}</div>
        <div class="admin-product-info">
          <div class="admin-product-name">${p.name}</div>
          <div class="admin-product-cat">${catLabel(p.cat)}</div>
        </div>
        <div class="admin-product-right">
          <div class="admin-product-price">$${p.price}</div>
          <div class="admin-stock ${stockClass}">×${p.stock}</div>
        </div>
      </div>
    `;
  }).join('');
}

function catLabel(cat) {
  return {liquid:'💧 Жидкости',pod:'⚡ POD системы',disposable:'🔋 Одноразки',accessories:'🔧 Расходники'}[cat] || cat;
}

function deleteAdminProduct(id) {
  adminProducts = adminProducts.filter(p => p.id !== id);
  renderAdminProducts();
  showToast('Товар удалён');
}

function addAdminProduct() {
  const name = document.getElementById('new-name').value.trim();
  const price = parseFloat(document.getElementById('new-price').value);
  const stock = parseInt(document.getElementById('new-stock').value);
  const cat = document.getElementById('new-cat').value;
  if (!name || !price || !stock) { showToast('Заполните все поля'); return; }
  const emojis = {liquid:'💧',pod:'⚡',disposable:'🔋',accessories:'🔩'};
  adminProducts.unshift({
    id: Date.now(), name, price, stock, cat,
    emoji: emojis[cat]||'📦',
    sub:'Новый товар',
    chars:{nic:'—',vg:'—',vol:'—',brand:'—'},
    desc:'',flavors:[]
  });
  document.getElementById('new-name').value = '';
  document.getElementById('new-price').value = '';
  document.getElementById('new-stock').value = '';
  renderAdminProducts();
  showToast(`${name} добавлен ✓`);
}

function renderAdminOrders(filter) {
  const list = document.getElementById('admin-orders-list');
  const filtered = filter === 'all' ? adminOrders : adminOrders.filter(o => o.status === filter);
  const statusMap = { new:'Новый', transit:'В пути', done:'Завершён', processing:'В работе' };
  const classMap = { new:'status-processing', transit:'status-transit', done:'status-delivered' };
  list.innerHTML = filtered.map(o => `
    <div class="admin-order-card" style="margin-bottom:10px">
      <div class="admin-order-top">
        <div><div class="admin-order-id">${o.id}</div><div class="admin-order-time">${o.time} назад · ${o.phone}</div></div>
        <span class="order-status ${classMap[o.status]}">${statusMap[o.status]||o.status}</span>
      </div>
      <div class="admin-order-info">${o.client}<br>${o.items}</div>
      <div class="admin-order-footer">
        <span class="admin-order-total">$${o.total.toFixed(2)}</span>
        <select class="status-select" onchange="showToast('Статус обновлён ✓')">
          <option ${o.status==='new'?'selected':''}>Новый</option>
          <option ${o.status==='processing'?'selected':''}>В работе</option>
          <option ${o.status==='transit'?'selected':''}>В доставке</option>
          <option ${o.status==='done'?'selected':''}>Завершён</option>
          <option>Отменён</option>
        </select>
      </div    >`).join('');
}

function filterOrders(filter, el) {
  document.querySelectorAll('#admin-orders .admin-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderAdminOrders(filter);
}

function openAdminSub(id) {
  const sub = document.getElementById(id);
  sub.style.display = 'flex';
  setTimeout(() => sub.classList.add('open'), 10);
}

function closeAdminSub(id) {
  const sub = document.getElementById(id);
  sub.classList.remove('open');
  setTimeout(() => sub.style.display = 'none', 300);
}

function saveAdminProfile() {
  const name = document.getElementById('aname').value;
  showToast('Профиль сохранён ✓');
}

function saveShopSettings() {
  showToast('Настройки магазина сохранены ✓');
}

function changePassword() {
  const cur = document.getElementById('cur-pass').value;
  const nw = document.getElementById('new-pass').value;
  const cf = document.getElementById('conf-pass').value;
  if (!cur || !nw || !cf) { showToast('Заполните все поля'); return; }
  if (nw !== cf) { showToast('Пароли не совпадают'); return; }
  if (cur !== 'admin') { showToast('Неверный текущий пароль'); return; }
  document.getElementById('cur-pass').value = '';
  document.getElementById('new-pass').value = '';
  document.getElementById('conf-pass').value = '';
  showToast('Пароль успешно изменён ✓');
}

renderProducts('products-grid', PRODUCTS);

// ==================== TELEGRAM INIT ====================
// Инициализация Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand(); // Разворачиваем на весь экран
}

// Определяем режим по URL параметру (?mode=admin)
(function() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const screen = params.get('screen');

  if (mode === 'admin') {
    // Показываем админку, скрываем клиент
    document.getElementById('client-app').style.display = 'none';
    document.getElementById('admin-app').style.display = 'block';
  } else {
    // Показываем клиент (по умолчанию)
    document.getElementById('client-app').style.display = 'block';
    document.getElementById('admin-app').style.display = 'none';
    // Если указан конкретный экран
    if (screen === 'catalog') goTo('screen-catalog');
    else if (screen === 'cart') goTo('screen-cart');
  }
})();
