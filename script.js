async function getCountries() {
    let res = await fetch('data.json');
    return await res.json();
}

let regions = document.getElementById('region-names');
let regionName = 'All';
let input = document.querySelector('.filter');

async function displayCountries() {
    let data = await getCountries();
    let html = '';
    data.forEach((country) => {
        if((country.region === regionName|| regionName === 'All') && (input.value === '')){
            let pop = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(country.population);
            html += `
                <div class="country">
                    <img src="${country.flags.png}" alt="${country.alpha3Code}" class = "flagImages">
                    <div class = details>
                        <h3>${country.name}</h3>
                        <div><span class="property">Population: </span> <span class="value">${pop}</span></div>
                        <div><span class="property">Region: </span> <span class="value">${country.region}</span></div>
                        <div><span class="property">Capital: </span> <span class="value">${country.capital}</span></div>
                    </div>
                </div>
            `;
        }
        else if(!(input === '')) {
            searchFilter();
        }
    });
    document.querySelector('.countries').innerHTML = html;
    openFlag();

}

async function searchFilter(event){
    let data = await getCountries();
    let keyword = input.value.toLowerCase();
    let filtered = data.filter((country) => {
        let name = country.name.toLowerCase();
        let region = country.region.toLowerCase();
        return ((name.indexOf(keyword) > -1) || (region.indexOf(keyword) > -1)) && (regionName === country.region || regionName === 'All');
    });
    let html = '';
    filtered.forEach((country) => {
        let pop = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(country.population);
            html += `
                <div class="country">
                    <img src="${country.flags.png}" alt="${country.alpha3Code}" class = "flagImages">
                    <div class = details>
                        <h3>${country.name}</h3>
                        <div><span class="property">Population: </span> <span class="value">${pop}</span></div>
                        <div><span class="property">Region: </span> <span class="value">${country.region}</span></div>
                        <div><span class="property">Capital: </span> <span class="value">${country.capital}</span></div>
                    </div>
                </div>
            `;
    });
    document.querySelector('.countries').innerHTML = html;
    openFlag();
}

regions.addEventListener('change', () => {
    regionName = regions.value;
    displayCountries();
});


displayCountries('All');
input.addEventListener('keyup', searchFilter);
input.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
        event.preventDefault();
    }
});


async function displayFlag(code){
    let data = await getCountries();
    let html = '';
    let country;
    for(let val in data) {
        if(data[val].alpha3Code === code){
            country = data[val];
        }
    }
    let pop = new Intl.NumberFormat('en-US', { style: 'decimal' }).format(country.population);
    let languages = `${country.languages[0].name}`;
    for (let lan of country.languages) {
        if(lan === 0){
            continue;
        }
        languages += `, ${lan.name}`;
    }
    let count = 0;
    let borderHTML = '';
    if(country.hasOwnProperty('borders')){
        borderHTML += `<div class = "borderCountries"><span class="property">Border Countries: </span>`;
        for (let lan of country.borders) {
            if(count === 3){
                break;
            }
            let countryName;
            for(let val in data) {
                if(data[val].alpha3Code === lan){
                    countryName = data[val].name;
                    break;
                }
            }
            borderHTML += `<button class = "button" data-code = "${lan}">${countryName}</button>`;
            count++;
        }
        borderHTML += `</div>`;
    }
    html += `<div class = "back">
            <button class = "backButton"><i class="fa-solid fa-arrow-left fa-lg" style="color: hsl(0, 0%, 100%);"></i>Back</button>
        </div>
        <div class = "info">
            <div class="flag">
                <img src="${country.flags.png}" alt="${country.alpha3Code}">
            </div>
            <div class="countryDeets">
                <h2 class="countryName">${country.name}</h2>
                <div class="information">
                    <div><span class="property">Native Name: </span> <span class="value">${country.nativeName}</span></div>
                    <div><span class="property">Population: </span> <span class="value">${pop}</span></div>
                    <div><span class="property">Region: </span> <span class="value">${country.region}</span></div>
                    <div><span class="property">Sub Region: </span> <span class="value">${country.subregion}</span></div>
                    <div><span class="property">Capital: </span> <span class="value">${country.capital}</span></div>
                    <div><span class="property">Top Level Domain: </span> <span class="value">${country.topLevelDomain[0]}</span></div>
                    <div><span class="property">Currencies: </span> <span class="value">${country.currencies[0].code}</span></div>
                    <div><span class="property">Languages: </span> <span class="value">${languages}Dutch, French, German</span></div>
                </div>
                ${borderHTML}
            </div>
        </div>`;
    document.querySelector('.flagInfo').innerHTML = html;
    closeFlag();
    borderCountryDis();
    if(document.querySelector('link').getAttribute('href') === 'style-light.css'){
        document.querySelector('i').setAttribute('style', 'hsl(0, 0%, 0%);');
    }
}

function openFlag() {
    document.querySelectorAll(".flagImages").forEach((flag) => {
        flag.addEventListener('click', () => {
            document.querySelector('.flagInfo').removeAttribute('style');
            document.querySelector('.main').setAttribute('style', 'display: none');
            let code = flag.getAttribute('alt');
            displayFlag(code);
        });
    });
}

function closeFlag(){
    document.querySelector('.back').addEventListener('click', () => {
        document.querySelector('.main').removeAttribute('style');
        document.querySelector('.flagInfo').setAttribute('style', 'display: none');                
    });
}

function borderCountryDis(){
    document.querySelectorAll(".button").forEach((flag) => {
        flag.addEventListener('click', () => {
            let code = flag.dataset.code;
            displayFlag(code);
        });
    });
}

document.querySelector('.dark').addEventListener('click', () => {
    let [style, file] = document.querySelector('link').getAttribute('href').split('-');
    if(file === 'dark.css'){
        let newCSS = [style, 'light.css'].join('-');
        document.querySelector('link').setAttribute('href', newCSS);
        document.querySelector('.dark').firstChild.setAttribute('src', 'icons/moon-outline.svg');
        document.querySelector('i').setAttribute('style', 'hsl(0, 0%, 0%);');
    }
    else {
        let newCSS = [style, 'dark.css'].join('-');
        document.querySelector('link').setAttribute('href', newCSS);
        document.querySelector('.dark').firstChild.setAttribute('src', 'icons/moon.svg');
        document.querySelector('i').setAttribute('style', 'hsl(0, 0%, 100%);');
    }
    
});