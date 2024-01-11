import{a as f,S as g,i as y}from"./assets/vendor-89feecc5.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const r of t.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=s(e);fetch(e.href,t)}})();const l=document.querySelector("form"),h=document.getElementById("searchInput"),v=document.getElementById("gallery"),d=document.getElementById("loader");l.addEventListener("submit",async function(i){i.preventDefault(),d.classList.add("visible");const o="41459044-8203682bce4ef2c3a7a872845",s=h.value.trim();if(s!==""){const r=`https://pixabay.com/api/?key=${o}&q=${s}&image_type=photo&orientation=horizontal&safesearch=${!0}`;try{const u=(await f.get(r)).data.hits,p=$(u);v.innerHTML=p;const b=new g(".image-card a"),c=document.getElementById("loadMore");c.style.display="block",c.addEventListener("click",async function(m){m.preventDefault()})}catch(a){console.error("Ошибка при выполнении запроса:",a)}finally{d.classList.remove("visible"),l.reset()}}else y.error({title:"Error",message:"Please enter a search query.",position:"topRight"})});function $(i){return i.map(({webformatURL:o,tags:s,likes:n,views:e,comments:t,downloads:r})=>`
<div class="image-card">
<a href="${o}" class="lightbox-trigger">
    <img src="${o}" alt="${s}">
</a>
    <div class="image-details">
    <p><strong>Likes:</strong> ${n}</p>
    <p><strong>Views:</strong> ${e}</p>
    <p><strong>Comments:</strong> ${t}</p>
    <p><strong>Downloads:</strong> ${r}</p>
</div>
    </div>
    `).join("")}
//# sourceMappingURL=commonHelpers.js.map
