const products = {
  hoodie:{id:"hoodie",name:"ZAKER Oversized Hoodie",price:28000,category:"tops",image:"assets/hoodie.jpg"},
  tee:{id:"tee",name:"ZAKER Logo T-Shirt",price:15000,category:"tops",image:"assets/tshirt.jpg"},
  pants:{id:"pants",name:"ZAKER Cargo Pants",price:25000,category:"bottoms",image:"assets/cargo-pants.jpg"},
  cap:{id:"cap",name:"ZAKER Studio Cap",price:12000,category:"accessories",image:"assets/cap.jpg"},
  sneakers:{id:"sneakers",name:"ZAKER Everyday Sneakers",price:32000,category:"accessories",image:"assets/sneakers.jpg"}
};
const cart = {};
const money = amount => "₦" + amount.toLocaleString("en-NG");
const $ = id => document.getElementById(id);
const toast = message => {
  $("toast").textContent=message; $("toast").classList.add("show");
  clearTimeout(toast.timer); toast.timer=setTimeout(()=>$("toast").classList.remove("show"),2600);
};
function renderCart(){
  const entries=Object.values(cart), count=entries.reduce((sum,item)=>sum+item.qty,0);
  const subtotal=entries.reduce((sum,item)=>sum+item.qty*item.price,0);
  $("cartCount").textContent=count; $("drawerCount").textContent=`(${count})`; $("cartSubtotal").textContent=money(subtotal);
  if(!entries.length){$("cartItems").innerHTML='<p class="empty-cart">Your bag is empty.<br>Add something you love.</p>';return;}
  $("cartItems").innerHTML=entries.map(item=>`<div class="cart-row"><div class="cart-thumb"><img src="${item.image}" alt=""></div><div><h3>${item.name}</h3><p>${money(item.price)} · Qty ${item.qty}</p><button class="remove-item" data-remove="${item.id}">Remove</button></div><strong>${money(item.price*item.qty)}</strong></div>`).join("");
  document.querySelectorAll("[data-remove]").forEach(button=>button.addEventListener("click",()=>{delete cart[button.dataset.remove];renderCart();}));
}
document.querySelectorAll(".quick-add").forEach(button=>button.addEventListener("click",()=>{
  const item=products[button.dataset.id]; if(cart[item.id])cart[item.id].qty++;else cart[item.id]={...item,qty:1};
  renderCart();toast(`${item.name} added to your bag`);
}));
function setCartOpen(open){$("cartDrawer").classList.toggle("open",open);$("overlay").classList.toggle("visible",open);$("cartDrawer").setAttribute("aria-hidden",String(!open));}
$("cartOpen").addEventListener("click",()=>setCartOpen(true));
$("cartClose").addEventListener("click",()=>setCartOpen(false));
$("overlay").addEventListener("click",()=>setCartOpen(false));
function buildOrderMessage(){
  const entries=Object.values(cart);
  if(!entries.length)return "Hello ZAKER! I'd like to ask about your clothing collection.";
  const lines=entries.map(item=>`• ${item.name} x${item.qty} — ${money(item.price*item.qty)}`);
  const subtotal=entries.reduce((sum,item)=>sum+item.qty*item.price,0);
  return `Hello ZAKER! I'd like to place an order:\n\n${lines.join("\n")}\n\nEstimated subtotal: ${money(subtotal)}\n\nPlease confirm availability, sizes, delivery fee and payment options.`;
}
function openWhatsApp(message){
  const url="https://wa.me/?text="+encodeURIComponent(message);
  window.open(url,"_blank","noopener,noreferrer");
}
$("whatsappOrder").addEventListener("click",()=>openWhatsApp(buildOrderMessage()));
$("checkoutButton").addEventListener("click",()=>{
  if(!Object.keys(cart).length){toast("Your bag is empty — explore the collection first.");return;}
  openWhatsApp(buildOrderMessage());
});
document.querySelectorAll("[data-jump-filter]").forEach(link=>link.addEventListener("click",()=>{
  const filter=link.dataset.jumpFilter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
  document.querySelectorAll(".product-card").forEach(card=>card.hidden=filter!=="all"&&card.dataset.category!==filter);
}));
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  document.querySelectorAll(".product-card").forEach(card=>card.hidden=button.dataset.filter!=="all"&&card.dataset.category!==button.dataset.filter);
}));
$("menuToggle").addEventListener("click",()=>{const opened=$("nav").classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",String(opened));});
document.querySelectorAll(".nav a").forEach(link=>link.addEventListener("click",()=>$("nav").classList.remove("open")));
$("searchInput").addEventListener("input",event=>{
  const query=event.target.value.trim().toLowerCase();
  document.querySelectorAll(".product-card").forEach(card=>card.hidden=!card.dataset.name.toLowerCase().includes(query));
  if(query)$("shop").scrollIntoView({behavior:"smooth",block:"start"});
});
$("newsletterForm").addEventListener("submit",event=>{
  event.preventDefault();$("newsletterMessage").textContent="Thanks for your interest! This demo does not save email addresses yet.";$("emailInput").value="";
});
document.addEventListener("keydown",event=>{if(event.key==="Escape")setCartOpen(false);});
