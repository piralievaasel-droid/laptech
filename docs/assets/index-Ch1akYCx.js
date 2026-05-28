(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))c(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function c(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();const U="laptech-session",x={currentUser:null,cart:[],compareIds:[]},l={currentUser:x.currentUser,cart:x.cart,compareIds:x.compareIds,loadSession(){const t=localStorage.getItem(U);if(t)try{const e=JSON.parse(t);this.currentUser=e.currentUser,this.cart=e.cart||[],this.compareIds=e.compareIds||[]}catch{localStorage.removeItem(U)}},saveSession(){localStorage.setItem(U,JSON.stringify({currentUser:this.currentUser,cart:this.cart,compareIds:this.compareIds}))},login(t){this.currentUser={...t,password:""},this.saveSession()},logout(){this.currentUser=null,this.cart=[],this.compareIds=[],this.saveSession()},addToCart(t){const e=this.cart.find(o=>o.product_id===t.id);return e?(e.quantity=Math.min(e.quantity+1,t.stock),this.saveSession(),"exists"):(this.cart.push({id:crypto.randomUUID(),product_id:t.id,product:t,quantity:1}),this.saveSession(),"added")},updateCartQuantity(t,e){const o=this.cart.find(c=>c.id===t);o&&(o.quantity=Math.max(1,Math.min(e,o.product.stock)),this.saveSession())},removeFromCart(t){this.cart=this.cart.filter(e=>e.id!==t),this.saveSession()},clearCart(){this.cart=[],this.saveSession()},toggleCompare(t){this.compareIds.includes(t)?this.compareIds=this.compareIds.filter(e=>e!==t):this.compareIds.length<3&&(this.compareIds=[...this.compareIds,t]),this.saveSession()}},h="/api",O="laptech-session",A=[{id:"1",brand:"ASUS",title:"ASUS ROG Strix G16",description:'Игровой ноутбук на Intel Core i9, RTX 4070 и 16" QHD для сложных задач.',price:679990,stock:5,featured:!0,image_url:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60",cpu:"Intel Core i9-13900HX",ram:"32 ГБ DDR5",storage:"1 ТБ NVMe SSD",gpu:"NVIDIA RTX 4070",display_size:'16" QHD (2560x1600), 165Hz'},{id:"2",brand:"Apple",title:"MacBook Pro 14",description:'Профессиональная станция на Apple M3 Pro с 14" Liquid Retina и сверхбыстрой памятью.',price:549990,stock:3,featured:!0,image_url:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60",cpu:"Apple M3 Pro",ram:"16 ГБ",storage:"512 ГБ SSD",gpu:"10-core GPU",display_size:'14" Liquid Retina XDR'},{id:"3",brand:"Lenovo",title:"ThinkPad X1 Carbon",description:"Бизнес-ноутбук нового поколения с Intel Core i7, 16 часов автономности.",price:289990,stock:7,featured:!1,image_url:"https://images.unsplash.com/photo-1588872657840-790ff3d952df?auto=format&fit=crop&w=500&q=60",cpu:"Intel Core i7-1365U",ram:"16 ГБ LPDDR5",storage:"512 ГБ SSD",gpu:"Intel Iris Xe",display_size:'14" IPS WUXGA (1920x1200)'},{id:"4",brand:"Dell",title:"XPS 13 Plus",description:"Ультратонкий премиум-ноутбук с OLED экраном и инновационным дизайном.",price:349990,stock:4,featured:!0,image_url:"https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500&q=60",cpu:"Intel Core Ultra 5",ram:"16 ГБ LPDDR5X",storage:"512 ГБ SSD",gpu:"Intel Arc",display_size:'13.3" OLED (1920x1200)'},{id:"5",brand:"HP",title:"Pavilion 16",description:"Мощный ноутбук для контента и гейминга с RTX 4050 по доступной цене.",price:199990,stock:6,featured:!1,image_url:"https://images.unsplash.com/photo-1588872657840-790ff3d952df?auto=format&fit=crop&w=500&q=60",cpu:"AMD Ryzen 7 7840H",ram:"16 ГБ DDR5",storage:"512 ГБ SSD",gpu:"NVIDIA RTX 4050",display_size:'16" FHD+ (1920x1200), 144Hz'}];async function f(t){if(!t.ok){const e=await t.text();throw new Error(e||t.statusText)}return t.json()}function $(){const t=localStorage.getItem(O);if(!t)return{};try{const e=JSON.parse(t);return e.currentUser?.id?{Authorization:`Bearer ${e.currentUser.id}`}:{}}catch{return{}}}async function _(){try{await fetch(`${h}/status`)}catch(t){console.warn("API не доступен",t)}}async function P(){try{return await f(await fetch(`${h}/products`))}catch(t){return console.warn("API getAllProducts failed, using mock data:",t),A}}async function R(t){try{return await f(await fetch(`${h}/products/${t}`))}catch(e){return console.warn("API getProductById failed, using mock data:",e),A.find(o=>o.id===t)}}async function F(t){try{return await f(await fetch(`${h}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}))}catch(e){return console.warn("API createUser failed, creating local user:",e),{id:crypto.randomUUID(),name:t.name||"User",email:t.email,password:"",role:"user"}}}async function z(t,e){try{const o=await fetch(`${h}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:e})});return(await f(o)).user}catch(o){return console.warn("API loginUser failed, creating demo user:",o),{id:crypto.randomUUID(),name:"Demo User",email:t,password:"",role:"user"}}}async function B(t){try{return await f(await fetch(`${h}/orders`,{method:"POST",headers:{"Content-Type":"application/json",...$()},body:JSON.stringify(t)}))}catch(e){return console.warn("API saveOrder failed, creating local order:",e),{id:crypto.randomUUID(),userId:"local",items:t.items,total:t.total,paymentMethod:t.paymentMethod,status:t.status||"Локально сохранён",createdAt:t.createdAt||Date.now()}}}async function j(){try{return await f(await fetch(`${h}/orders`,{headers:$()}))}catch(t){return console.warn("API getAllOrders failed:",t),[]}}async function X(t){try{return await f(await fetch(`${h}/products`,{method:"POST",headers:{"Content-Type":"application/json",...$()},body:JSON.stringify(t)}))}catch(e){throw console.warn("API saveProduct failed:",e),e}}async function G(t){try{await f(await fetch(`${h}/products/${t}`,{method:"DELETE",headers:$()}))}catch(e){throw console.warn("API deleteProduct failed:",e),e}}function b(t){return new Intl.NumberFormat("ru-RU",{style:"currency",currency:"KZT",maximumFractionDigits:0}).format(t)}function M(t,e=!0){const o=document.createElement("article");return o.className="product-card",o.innerHTML=`
    <img src="${t.image_url}" alt="${t.title}" loading="lazy" />
    <div class="card-body">
      <div class="card-header">
        <span class="brand-pill">${t.brand}</span>
        <strong>${t.title}</strong>
      </div>
      <p class="card-description">${t.description}</p>
      <ul class="spec-list">
        <li>${t.cpu}</li>
        <li>${t.ram}</li>
        <li>${t.storage}</li>
        <li>${t.gpu}</li>
      </ul>
      <div class="card-meta">
        <span class="price">${b(t.price)}</span>
        <button class="button button-primary" data-action="buy" data-id="${t.id}">В корзину</button>
      </div>
      ${e?`<label class="compare-checkbox"><input type="checkbox" data-action="compare" data-id="${t.id}" ${l.compareIds.includes(t.id)?"checked":""} /> Сравнить</label>`:""}
    </div>
  `,o}const L=document.createElement("div");L.id="toast";L.className="toast-container";document.body.appendChild(L);function S(t,e="info"){const o=document.createElement("div");o.className=`toast-message toast-${e}`,o.textContent=t,L.appendChild(o),requestAnimationFrame(()=>{o.classList.add("toast-visible")}),setTimeout(()=>{o.classList.remove("toast-visible"),o.addEventListener("transitionend",()=>o.remove(),{once:!0})},3200)}const J={render:async()=>{const t=document.createElement("section");t.className="page-section page-home";const o=(await P()).filter(a=>a.featured);t.innerHTML=`
      <section class="hero-grid">
        <div class="hero-content">
          <span class="eyebrow">LapTech</span>
          <h1>Каталог ноутбуков премиум-класса</h1>
          <p>Лучшие рабочие и игровыe ноутбуки для бизнеса, учебы и творчества. Быстрая авторизация, удобная корзина, оплата и поддержка в одном приложении.</p>
          <div class="hero-actions">
            <a href="#catalog" class="button button-primary">Перейти в каталог</a>
            <a href="#compare" class="button button-secondary">Сравнить модели</a>
          </div>
        </div>
        <div class="hero-preview">
          <div class="preview-card">
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80" alt="Laptop preview" />
          </div>
        </div>
      </section>
      <section class="home-features">
        <article>
          <h2>Полный каталог</h2>
          <p>Фильтрация, сравнение и удобный вывод товаров по брендам, цене и характеристикам.</p>
        </article>
        <article>
          <h2>Авторизация и админ</h2>
          <p>Вход для клиентов и отдельная панель для администратора, чтобы контролировать товары и заказы.</p>
        </article>
        <article>
          <h2>Платёжный поток</h2>
          <p>Выбирайте способ оплаты и завершайте заказ прямо внутри сайта.</p>
        </article>
      </section>
      <section class="home-products">
        <div class="section-head">
          <h2>Топовые ноутбуки</h2>
          <p>Лучшие предложения каталога в тенге.</p>
        </div>
        <div class="product-grid"></div>
      </section>
    `;const c=t.querySelector(".product-grid");return o.forEach(a=>{const i=M(a,!1),r=i.querySelector('[data-action="buy"]');r&&r.addEventListener("click",()=>{if(!l.currentUser){S("Войдите, чтобы сохранить корзину и оформить заказ.","warning"),w("#auth");return}const s=l.addToCart(a);S(s==="exists"?"Товар уже в корзине, количество увеличено.":"Товар добавлен в корзину.","success")}),c.append(i)}),t}};function K(t=""){return`
    <div class="catalog-filters">
      <div class="filter-group">
        <label>Поиск</label>
        <input type="search" id="filter-search" placeholder="Введите модель или бренд" value="${t}" />
      </div>
      <div class="filter-group">
        <label>Бренд</label>
        <select id="filter-brand">
          <option value="all">Все</option>
          <option value="ASUS">ASUS</option>
          <option value="Apple">Apple</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Dell">Dell</option>
          <option value="Acer">Acer</option>
          <option value="MSI">MSI</option>
        </select>
      </div>
      <div class="filter-group range-group">
        <label>Цена от</label>
        <input type="number" id="filter-min" min="0" value="0" />
      </div>
      <div class="filter-group range-group">
        <label>до</label>
        <input type="number" id="filter-max" min="0" value="1000000" />
      </div>
    </div>
  `}const V={render:async({query:t})=>{const e=document.createElement("section");e.className="page-section page-catalog",e.innerHTML=`
      <div class="section-head">
        <h2>Каталог ноутбуков</h2>
        <p>Фильтруйте, сравнивайте и добавляйте лучшие модели в корзину.</p>
      </div>
      ${K(t.get("q")||"")}
      <div class="catalog-summary"></div>
      <div class="product-grid"></div>
    `;const o=await P(),c=e.querySelector(".product-grid"),a=e.querySelector(".catalog-summary"),i=e.querySelector("#filter-search"),r=e.querySelector("#filter-brand"),s=e.querySelector("#filter-min"),n=e.querySelector("#filter-max");function d(){const u=i.value.trim().toLowerCase(),m=Number(s.value)||0,p=Number(n.value)||1e6,g=r.value,y=o.filter(v=>{const I=[v.title,v.brand,v.description].join(" ").toLowerCase().includes(u),N=g==="all"||v.brand===g,H=v.price>=m&&v.price<=p;return I&&N&&H});c.innerHTML="",y.length||(c.innerHTML='<div class="empty-state">Ничего не найдено по вашему запросу.</div>'),y.forEach(v=>{const I=M(v);c.append(I)}),a.innerHTML=`<span>Найдено моделей: <strong>${y.length}</strong></span> <span>Выбрано для сравнения: <strong>${l.compareIds.length}</strong></span>`}return e.addEventListener("click",u=>{const m=u.target;if(m.dataset.action==="buy"){const p=m.dataset.id,g=o.find(y=>y.id===p);if(!l.currentUser){S("Войдите, чтобы сохранить корзину и оформить заказ.","warning"),w("#auth");return}if(g){const y=l.addToCart(g);S(y==="exists"?"Товар уже в корзине, количество увеличено.":"Товар добавлен в корзину.","success")}}}),e.addEventListener("change",u=>{const m=u.target;if(m.dataset.action==="compare"){const p=m.dataset.id;p&&(l.toggleCompare(p),d())}}),[i,r,s,n].forEach(u=>{u.addEventListener("input",d)}),d(),e}},Y={render:async()=>{const t=document.createElement("section");t.className="page-section page-auth",t.innerHTML=`
      <div class="section-head">
        <h2>Вход и регистрация</h2>
        <p>Создайте аккаунт или войдите, чтобы сохранить корзину и оформить заказ.</p>
      </div>
      <div class="auth-panel">
        <div class="auth-tabs">
          <button type="button" class="auth-tab auth-tab--active" data-target="login">Вход</button>
          <button type="button" class="auth-tab" data-target="register">Регистрация</button>
        </div>
        <div class="auth-window">
          <form id="login-form" class="auth-card auth-card--active">
            <h3>Войти</h3>
            <label>Почта<input type="email" name="email" required autocomplete="email" /></label>
            <label>Пароль<input type="password" name="password" required minlength="6" autocomplete="current-password" /></label>
            <button type="submit" class="button button-primary">Войти</button>
            <div class="alert" id="login-alert"></div>
          </form>
          <form id="register-form" class="auth-card">
            <h3>Регистрация</h3>
            <label>Имя<input type="text" name="name" required autocomplete="name" /></label>
            <label>Почта<input type="email" name="email" required autocomplete="email" /></label>
            <label>Пароль<input type="password" name="password" required minlength="6" autocomplete="new-password" /></label>
            <button type="submit" class="button button-secondary">Зарегистрироваться</button>
            <div class="alert" id="register-alert"></div>
          </form>
        </div>
      </div>
    `;const e=Array.from(t.querySelectorAll(".auth-tab")),o=Array.from(t.querySelectorAll(".auth-card")),c=t.querySelector("#login-form"),a=t.querySelector("#register-form"),i=t.querySelector("#login-alert"),r=t.querySelector("#register-alert");function s(n){e.forEach(d=>{d.classList.toggle("auth-tab--active",d.dataset.target===n)}),o.forEach(d=>{d.classList.toggle("auth-card--active",d.id===`${n}-form`)})}return e.forEach(n=>{n.addEventListener("click",()=>s(n.dataset.target||"login"))}),c.addEventListener("submit",async n=>{n.preventDefault(),i.textContent="";const d=new FormData(c),u=String(d.get("email")||"").trim(),m=String(d.get("password")||"").trim();try{const p=await z(u,m);l.login(p),w("#catalog")}catch(p){i.textContent=String(p instanceof Error?p.message:"Ошибка входа")}}),a.addEventListener("submit",async n=>{n.preventDefault(),r.textContent="";const d=new FormData(a),u=String(d.get("name")||"").trim(),m=String(d.get("email")||"").trim(),p=String(d.get("password")||"").trim();try{await F({id:crypto.randomUUID(),name:u,email:m,password:p,role:"user"}),r.textContent="Учетная запись создана. Выполните вход.",s("login")}catch(g){r.textContent=String(g instanceof Error?g.message:"Ошибка регистрации")}}),t}},Q={render:async()=>{const t=document.createElement("section");t.className="page-section page-cart",t.innerHTML=`
      <div class="section-head">
        <h2>Корзина</h2>
        <p>Проверьте содержимое, выберите способ оплаты и оформите заказ.</p>
      </div>
      <div class="cart-grid"></div>
    `;const e=t.querySelector(".cart-grid");if(!l.currentUser)return e.innerHTML=`
        <div class="empty-state">
          Чтобы оформить заказ, пожалуйста, <a href="#auth">войдите</a> или зарегистрируйтесь.
        </div>
      `,t;function o(){if(!l.cart.length){e.innerHTML='<div class="empty-state">Ваша корзина пуста.</div>';return}const c=l.cart.map(s=>`
            <div class="cart-item">
              <img src="${s.product.image_url}" alt="${s.product.title}" />
              <div class="cart-item-info">
                <h3>${s.product.title}</h3>
                <p>${s.product.brand} · ${s.product.cpu}, ${s.product.ram}, ${s.product.storage}</p>
                <div class="cart-controls">
                  <input type="number" min="1" max="${s.product.stock}" data-action="quantity" data-id="${s.id}" value="${s.quantity}" />
                  <button class="button button-tertiary" data-action="remove" data-id="${s.id}">Удалить</button>
                </div>
              </div>
              <strong>${b(s.product.price*s.quantity)}</strong>
            </div>
          `).join(""),a=l.cart.reduce((s,n)=>s+n.quantity*n.product.price,0);e.innerHTML=`
        <div class="cart-list">${c}</div>
        <div class="checkout-card">
          <div class="checkout-block">
            <p>Покупатель</p>
            <strong>${l.currentUser?.name||"Пользователь"}</strong>
          </div>
          <div class="checkout-block">
            <p>Итог</p>
            <strong>${b(a)}</strong>
          </div>
          <button class="button button-primary" id="checkout-button">Оформить заказ</button>
          <div class="payment-form" id="payment-form" style="display: none;">
            <div class="checkout-block">
              <label>Способ оплаты</label>
              <select id="payment-method">
                <option value="Картой">Картой</option>
                <option value="Kaspi">Kaspi</option>
                <option value="Наличные при получении">Наличные при получении</option>
              </select>
            </div>
            <div class="checkout-block card-fields">
              <label>Номер карты<input type="text" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" /></label>
              <label>Срок действия<input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" /></label>
              <label>CVV<input type="text" id="card-cvc" placeholder="123" maxlength="4" /></label>
            </div>
            <button class="button button-primary" id="confirm-checkout">Подтвердить оплату</button>
            <button class="button button-secondary" id="cancel-checkout">Отмена</button>
          </div>
          <div class="alert" id="checkout-alert"></div>
        </div>
      `;const i=e.querySelector("#payment-method"),r=e.querySelector(".card-fields");i&&r&&(r.style.display=i.value==="Картой"?"grid":"none")}return e.addEventListener("click",c=>{const a=c.target;a.dataset.action==="remove"&&(l.removeFromCart(a.dataset.id||""),o())}),e.addEventListener("change",c=>{const a=c.target;if(a.dataset.action==="quantity"){const i=a.dataset.id||"";l.updateCartQuantity(i,Number(a.value)),o()}if(a.id==="payment-method"){const i=t.querySelector(".card-fields");i.style.display=a.value==="Картой"?"grid":"none"}}),e.addEventListener("click",async c=>{const a=c.target;if(a.id==="checkout-button"){const i=t.querySelector("#payment-form");i.style.display="grid"}if(a.id==="cancel-checkout"){const i=t.querySelector("#payment-form");i.style.display="none"}if(a.id==="confirm-checkout"){const i=t.querySelector("#checkout-alert");i.textContent="";const r=t.querySelector("#payment-method")?.value||"Картой",s=l.cart.reduce((n,d)=>n+d.quantity*d.product.price,0);if(!l.cart.length){i.textContent="Корзина пуста.";return}if(r==="Картой"){const n=String(t.querySelector("#card-number")?.value||"").replace(/\s+/g,""),d=String(t.querySelector("#card-expiry")?.value||""),u=String(t.querySelector("#card-cvc")?.value||"");if(!/^\d{16}$/.test(n)){i.textContent="Введите корректный номер карты из 16 цифр.";return}if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(d)){i.textContent="Введите срок действия в формате MM/YY.";return}if(!/^\d{3,4}$/.test(u)){i.textContent="Введите CVV из 3 или 4 цифр.";return}}try{await B({id:crypto.randomUUID(),userId:l.currentUser.id,items:l.cart,total:s,paymentMethod:r,status:"Получен",createdAt:Date.now()}),l.clearCart(),S("Заказ успешно оформлен.","success"),w("#home")}catch(n){i.textContent=String(n instanceof Error?n.message:"Ошибка оформления")}}}),o(),t}},W={render:async()=>{const t=document.createElement("section");t.className="page-section page-compare",t.innerHTML=`
      <div class="section-head">
        <h2>Сравнение</h2>
        <p>Выберите до трёх моделей и сравните характеристики в одном окне.</p>
      </div>
      <div class="compare-grid"></div>
    `;const e=t.querySelector(".compare-grid");if(!l.compareIds.length)return e.innerHTML='<div class="empty-state">Вы ещё не добавили модели для сравнения.</div>',t;const c=(await Promise.all(l.compareIds.map(r=>R(r)))).filter(Boolean);if(!c.length)return e.innerHTML='<div class="empty-state">Выбранные товары не доступны.</div>',t;const a=`
      <div class="compare-card compare-header">
        <div>Параметр</div>
        ${c.map(r=>`<div>${r.title}</div>`).join("")}
      </div>
    `,i=[{label:"Бренд",value:r=>r.brand},{label:"Процессор",value:r=>r.cpu},{label:"Оперативная память",value:r=>r.ram},{label:"Накопитель",value:r=>r.storage},{label:"Видеокарта",value:r=>r.gpu},{label:"Экран",value:r=>r.display_size},{label:"Цена",value:r=>b(r.price)},{label:"Наличие",value:r=>`${r.stock} шт.`}];return e.innerHTML=a+i.map(r=>`
      <div class="compare-card">
        <div>${r.label}</div>
        ${c.map(s=>`<div>${r.value(s)}</div>`).join("")}
      </div>
    `).join(""),t}},Z={render:async()=>{const t=document.createElement("section");if(t.className="page-section page-admin",!l.currentUser||l.currentUser.role!=="admin")return t.innerHTML=`
        <div class="section-head">
          <h2>Админ-панель</h2>
          <p>Доступ закрыт. Для управления товарами нужен аккаунт администратора.</p>
        </div>
        <div class="empty-state">
          Войдите как администратор или используйте админить через <a href="#auth">авторизацию</a>.
        </div>
      `,t;let e=await P();const o=await j();t.innerHTML=`
      <div class="section-head">
        <h2>Админ-панель</h2>
        <p>Добавляйте, редактируйте, удаляйте товары и отслеживайте заказы.</p>
      </div>
      <div class="admin-grid">
        <div class="admin-card">
          <h3>Новый товар</h3>
          <form id="product-form" class="admin-form">
            <label>Название<input name="title" required /></label>
            <label>Бренд<input name="brand" required /></label>
            <label>Описание<textarea name="description" rows="3" required></textarea></label>
            <label>Изображение URL<input name="image_url" required /></label>
            <label>CPU<input name="cpu" required /></label>
            <label>RAM<input name="ram" required /></label>
            <label>Хранилище<input name="storage" required /></label>
            <label>GPU<input name="gpu" required /></label>
            <label>Экран<input name="display_size" required /></label>
            <label>Цена<input type="number" name="price" required min="0" /></label>
            <label>Наличие<input type="number" name="stock" required min="0" /></label>
            <label class="checkbox-label"><input type="checkbox" name="featured" /> В топ</label>
            <button type="submit" class="button button-primary">Сохранить товар</button>
          </form>
          <div class="alert" id="admin-alert"></div>
        </div>
        <div class="admin-card admin-orders">
          <h3>Последние заказы</h3>
          <div class="order-list">
            ${o.sort((s,n)=>n.createdAt-s.createdAt).slice(0,8).map(s=>`
                <article class="order-item">
                  <div><strong>Заказ:</strong> ${s.id.slice(0,8)}</div>
                  <div><strong>Покупатель:</strong> ${s.userId}</div>
                  <div><strong>Сумма:</strong> ${b(s.total)}</div>
                  <div><strong>Оплата:</strong> ${s.paymentMethod}</div>
                </article>
              `).join("")}
          </div>
        </div>
      </div>
      <div class="admin-products">
        <h3>Товары</h3>
        <div class="product-table"></div>
      </div>
    `;const c=t.querySelector("#admin-alert"),a=t.querySelector("#product-form"),i=t.querySelector(".product-table");function r(s){if(!s.length){i.innerHTML='<div class="empty-state">Список товаров пуст.</div>';return}i.innerHTML=s.map(n=>`
            <div class="product-row" data-id="${n.id}">
              <div>${n.title}</div>
              <div>${n.brand}</div>
              <div>${b(n.price)}</div>
              <div>${n.stock}</div>
              <button class="button button-tertiary" data-action="delete" data-id="${n.id}">Удалить</button>
            </div>
          `).join("")}return r(e),a.addEventListener("submit",async s=>{s.preventDefault(),c.textContent="";const n=new FormData(a);try{const d={id:crypto.randomUUID(),title:String(n.get("title")||"").trim(),brand:String(n.get("brand")||"").trim(),description:String(n.get("description")||"").trim(),image_url:String(n.get("image_url")||"").trim(),cpu:String(n.get("cpu")||"").trim(),ram:String(n.get("ram")||"").trim(),storage:String(n.get("storage")||"").trim(),gpu:String(n.get("gpu")||"").trim(),display_size:String(n.get("display_size")||"").trim(),price:Number(n.get("price")||0),stock:Number(n.get("stock")||0),featured:!!n.get("featured")};await X(d),e=[d,...e],r(e),c.textContent="Товар сохранён и добавлен в список.",a.reset()}catch(d){c.textContent=String(d instanceof Error?d.message:"Ошибка сохранения")}}),t.addEventListener("click",async s=>{const n=s.target,d=n.dataset.id;if(n.dataset.action==="delete"&&d)try{await G(d),e=e.filter(u=>u.id!==d),r(e),c.textContent="Товар удалён."}catch(u){c.textContent=String(u instanceof Error?u.message:"Ошибка удаления")}}),t}},k={home:J,catalog:V,auth:Y,cart:Q,compare:W,admin:Z};function tt(){const t=document.createElement("div");t.className="modal-overlay";const e=document.createElement("div");e.className="modal-profile",e.innerHTML=`
    <div class="modal-header">
      <h2>Мой профиль</h2>
      <button type="button" class="modal-close" aria-label="Закрыть">&times;</button>
    </div>
    <div class="modal-body">
      <form id="profile-form-modal" class="profile-form-modal">
        <label>Имя<input name="name" value="${l.currentUser?.name||""}" required /></label>
        <label>Почта<input type="email" name="email" value="${l.currentUser?.email||""}" required /></label>
        <button type="submit" class="button button-primary">Сохранить</button>
        <div class="alert" id="profile-alert-modal"></div>
      </form>
      <div class="profile-support-modal">
        <h3>Поддержка</h3>
        <p><strong>Email:</strong> <a href="mailto:support@laptech.kz">support@laptech.kz</a></p>
      </div>
    </div>
  `,t.appendChild(e),document.body.appendChild(t);const o=e.querySelector(".modal-close");o&&o.addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()});const c=e.querySelector("#profile-form-modal"),a=e.querySelector("#profile-alert-modal");c.addEventListener("submit",i=>{i.preventDefault(),a.textContent="";const r=new FormData(c),s=String(r.get("name")||"").trim(),n=String(r.get("email")||"").trim();if(!s||!n){a.textContent="Заполните все поля профиля.";return}l.currentUser={...l.currentUser,name:s,email:n},l.saveSession(),a.textContent="Профиль обновлён.",S("Профиль успешно сохранён","success"),setTimeout(()=>t.remove(),1500)})}function et(t){const e=l.currentUser?`<button id="profile-btn" class="user-badge" type="button">${l.currentUser.name}</button>`:"",o=l.currentUser?'<button id="logout-btn" class="nav-button">Выйти</button>':'<a href="#auth" class="nav-link">Войти</a>';t.innerHTML=`
    <div class="navbar-inner">
      <div class="logo-block">
        <a href="#home" class="brand">LapTech</a>
        <span class="tag">Каталог ноутбуков</span>
      </div>
      <nav class="nav-links">
        <a href="#catalog" class="nav-link">Каталог</a>
        <a href="#cart" class="nav-link">Корзина</a>
        <a href="#compare" class="nav-link">Сравнить</a>
        ${l.currentUser?.role==="admin"?'<a href="#admin" class="nav-link">Админ</a>':""}
      </nav>
      <div class="nav-controls">
        <form id="search-form" class="search-form">
          <input type="search" name="q" placeholder="Поиск ноутбука" autocomplete="off" />
          <button type="submit">Найти</button>
        </form>
        ${e}
        ${o}
      </div>
    </div>
  `;const c=t.querySelector("#profile-btn");c&&c.addEventListener("click",tt);const a=t.querySelector("#logout-btn");a&&a.addEventListener("click",()=>{l.logout(),w("#home")});const i=t.querySelector("#search-form");i&&i.addEventListener("submit",r=>{r.preventDefault();const s=r.currentTarget,n=new FormData(s),d=String(n.get("q")||"").trim();w(d?`#catalog?q=${encodeURIComponent(d)}`:"#catalog")})}function at(t){t.classList.remove("fade-in"),t.offsetWidth,t.classList.add("fade-in")}const T=document.querySelector("#app"),E=document.createElement("header"),q=document.createElement("main"),C=document.createElement("footer");function rt(t){const e=t.replace(/^#/,"")||"home",[o,c=""]=e.split("?");return{path:o,query:new URLSearchParams(c)}}async function D(){const{path:t,query:e}=rt(window.location.hash),c=await(k[t]??k.home).render({query:e});T.innerHTML="",E.className="page-header",q.className="page-main",C.className="page-footer",et(E),q.replaceChildren(c),C.innerHTML='LapTech — премиум-каталог ноутбуков, профили, оплата и поддержка. <a href="mailto:support@laptech.kz">support@laptech.kz</a>',T.append(E,q,C),at(q)}async function nt(){await _(),l.loadSession(),window.addEventListener("hashchange",D),await D()}function w(t){window.location.hash=t}nt();
