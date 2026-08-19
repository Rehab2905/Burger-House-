const API_URL="https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef";
const fallback=[
{idMeal:"1",strMeal:"The Classic",strMealThumb:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",category:"Burgers",price:9.99},
{idMeal:"2",strMeal:"Smoky BBQ",strMealThumb:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",category:"Burgers",price:11.99},
{idMeal:"3",strMeal:"Double Cheese",strMealThumb:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=85",category:"Burgers",price:12.99},
{idMeal:"4",strMeal:"Loaded Fries",strMealThumb:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",category:"Sides",price:6.99},
{idMeal:"5",strMeal:"Crispy Chicken",strMealThumb:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=85",category:"Chicken",price:10.99},
{idMeal:"6",strMeal:"Chocolate Shake",strMealThumb:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=900&q=85",category:"Drinks",price:5.49}
];
let items=[],active="All",limit=6;
const grid=document.getElementById("menuGrid"),popular=document.getElementById("popularGrid"),filters=document.getElementById("filters"),search=document.getElementById("search"),status=document.getElementById("status"),load=document.getElementById("loadMore");

function normalize(data){return (data||[]).map((m,i)=>({...m,category:"Burgers",price:(9.99+(i%6)*1.5).toFixed(2),description:"A fresh-to-order favorite with our signature sauce, crisp toppings and a toasted bun."}))}
async function init(){
 status.textContent="Loading menu...";
 try{let r=await fetch(API_URL);if(!r.ok)throw 0;let d=await r.json();items=normalize(d.meals);if(!items.length)throw 0;status.textContent=items.length+" items · Live API data"}catch(e){items=fallback.map(x=>({...x,description:"Fresh ingredients, bold flavor and our signature sauce on a toasted bun."}));status.textContent="Featured menu · API fallback enabled"}
 buildFilters();render();renderPopular();fillOrder();
}
function buildFilters(){
 let cats=["All",...new Set(items.map(x=>x.category))];
 filters.innerHTML=cats.map(c=>`<button class="filter ${c===active?"active":""}" data-c="${c}">${c}</button>`).join("");
 filters.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{active=b.dataset.c;limit=6;buildFilters();render()});
}
function card(m){
 return `<div class="col-md-6 col-lg-4"><article class="burger-card reveal visible" onclick='openItem(${JSON.stringify(m).replace(/'/g,"&#39;")})'><img src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy"><div class="burger-body"><span class="tag">${m.category}</span><div class="d-flex justify-content-between gap-2"><h3>${m.strMeal}</h3><span class="price">$${m.price}</span></div><p>${m.description}</p></div></article></div>`;
}
function render(){
 let q=search.value.toLowerCase().trim(),filtered=items.filter(x=>(active==="All"||x.category===active)&&x.strMeal.toLowerCase().includes(q));
 grid.innerHTML=filtered.slice(0,limit).map(card).join("")||`<div class="col-12 text-center py-5"><p>No items found. Try another search.</p></div>`;
 load.classList.toggle("d-none",limit>=filtered.length);
}
function renderPopular(){popular.innerHTML=items.slice(0,3).map(card).join("")}
function fillOrder(){document.getElementById("item").innerHTML='<option value="">Select a favorite</option>'+items.slice(0,12).map(x=>`<option>${x.strMeal}</option>`).join("")}
search.addEventListener("input",()=>{limit=6;render()});load.onclick=()=>{limit+=6;render()};

function openItem(m){
 document.getElementById("modalImg").src=m.strMealThumb;document.getElementById("modalImg").alt=m.strMeal;
 document.getElementById("modalTitle").textContent=m.strMeal;document.getElementById("modalCat").textContent=m.category;
 document.getElementById("modalDesc").textContent=m.description;document.getElementById("modalPrice").textContent="$"+m.price;
 new bootstrap.Modal("#itemModal").show();
}
const form=document.getElementById("orderForm");
form.addEventListener("submit",e=>{
 e.preventDefault();let ok=true;
 [["orderName","Name is required."],["phone","Phone is required."],["item","Choose an item."],["qty","Choose a valid quantity."]].forEach(([id,msg])=>{
  const el=document.getElementById(id),small=el.parentElement.querySelector("small"),valid=el.value.trim()&&!(id==="qty"&&(el.value<1||el.value>20));
  small.textContent=valid?"":msg;if(!valid)ok=false;
 });
 if(ok){toast(`Thanks ${document.getElementById("orderName").value}! Your order request has been received.`);form.reset();document.getElementById("qty").value=1}
});
function toast(t){let x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),4500)}
document.querySelectorAll(".form-control").forEach(x=>x.addEventListener("input",()=>x.parentElement.querySelector("small")&&(x.parentElement.querySelector("small").textContent="")));
const nav=document.getElementById("navbar");window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30));
const observer=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.12});document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));
init();
