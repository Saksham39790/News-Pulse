let currentArticles = [];
const container = document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const stats = document.getElementById("stats");

let currentPage = 1;
let currentQuery = "india";

async function fetchNews(query="india") {

    currentQuery = query;

    loader.innerHTML = "Loading...";
    container.innerHTML = "";

    const response =
    await fetch(`/news?search=${query}&page=${currentPage}`);

    const data =
    await response.json();

    loader.innerHTML = "";

    stats.innerHTML =
    `Showing ${data.articles.length} articles`;

    if (!data.articles || data.articles.length === 0) {

        container.innerHTML = `
            <div style="text-align:center;padding:40px;">
                <h2>No articles found 😕</h2>
                <p>Try another search term.</p>
            </div>
        `;

        return;
    }

    displayNews(data.articles);

}

function displayNews(articles){

currentArticles = articles;

container.innerHTML="";

document.getElementById("stats").innerHTML =
`📰 Showing ${articles.length} articles`;

articles.forEach((article, index) => {

const card=document.createElement("div");

card.className="card";

card.innerHTML=`

<img src="${
article.urlToImage ||
'https://picsum.photos/400/220'
}">

<div class="card-content">

<h3>${article.title}</h3>

<div class="meta">
${article.source.name}
<br>
🕒 ${
  article.publishedAt &&
  !isNaN(new Date(article.publishedAt))
    ? new Date(article.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
    : "Date unavailable"
}
</div>

<p>
${article.description || ""}
</p>

<a href="${article.url}" target="_blank">
<button>Read More</button>
</a>

<button onclick="saveArticle(${index})">
🔖 Save
</button>

</div>
`;

container.appendChild(card);

});

}

document
.getElementById("searchBtn")
.addEventListener("click",()=>{

const query=
document
.getElementById("searchInput")
.value
.trim();

if(query){

currentPage=1;
fetchNews(query);

}

});

document
.getElementById("searchInput")
.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

const query=e.target.value.trim();

if(query){

currentPage=1;
fetchNews(query);

}

}

});

async function loadCategory(category, event){

document
.querySelectorAll(".category-btn")
.forEach(btn => {
btn.classList.remove("active-category");
});

event.target.classList.add("active-category");

loader.innerHTML = "Loading...";

const response = await fetch(
`/news?search=${category}&page=1`
);

const data = await response.json();

loader.innerHTML = "";

displayNews(data.articles);

}

document
.getElementById("themeBtn")
.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(
"theme",
document.body.classList.contains("dark")
? "dark"
: "light"
);

});

if(localStorage.getItem("theme")==="dark"){
document.body.classList.add("dark");
}

document
.getElementById("nextBtn")
.addEventListener("click",()=>{

currentPage++;
fetchNews(currentQuery);

});

document
.getElementById("prevBtn")
.addEventListener("click",()=>{

if(currentPage>1){

currentPage--;
fetchNews(currentQuery);

}

});

fetchNews();

document
.getElementById("searchInput")
.addEventListener("keypress", (e) => {

if(e.key === "Enter"){
searchNews();
}

});

function saveArticle(index){

const article = currentArticles[index];

let saved =
JSON.parse(localStorage.getItem("savedNews"))
|| [];

saved.push(article);

localStorage.setItem(
"savedNews",
JSON.stringify(saved)
);

alert("Article Saved!");
}

function viewSavedNews(){

const saved =
JSON.parse(
localStorage.getItem("savedNews")
) || [];

if(saved.length === 0){

alert("No saved articles yet!");

return;

}

displayNews(saved);

}

function clearSavedNews(){

localStorage.removeItem("savedNews");

alert("Saved articles cleared!");

}