function loadAllGame(cat){
    var tmp_cat = capitalizeFirstLetter(cat);
    fetch("game/all.json",{
        headers: {
            'Content-Type': 'application/json',
            },
        }).then(response => response.json())
    .then(data => {
        listGame = data;
        for (var j=0; j<listGame.length; j++) {
            if (listGame[j].cat.indexOf(tmp_cat) >= 0) {
                var item = listGame[j];
                var img = item.slug;
                if(item.img){
                    img = item.img;
                }
                const htmlItem = `
                <div
                class="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 block rounded-[1.25rem] border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg"
                >
                <figure class="relative">
                    <a title="${item.title}" href="/play.html?class=${item.slug}" style="cursor:pointer">
                    <img
                        src="/images/logo/${img}.png"
                        alt="${item.title}"
                        class="w-full rounded-[0.625rem]"
                        loading="lazy" style="height:170px"
                    />
                    </a>
                    
                </figure>
                <div class="mt-7 flex items-center justify-between">
                    <a title="${item.title}" href="/play.html?class=${item.slug}" style="cursor:pointer">
                    <span class="font-display text-jacarta-700 hover:text-accent text-base dark:text-white"
                        >${item.title}</span
                    >
                    </a>
                </div>
            
                </div>
            `;
                const e = document.createElement('article');
                e.innerHTML = htmlItem;  
                document.getElementById('listgame').appendChild(e);
            }
        }
    });
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
window.addEventListener('load', function() {
    
    // loadSimilar();
    // loadHot();
    loadAllGame(document.getElementById("cat").value);
});
