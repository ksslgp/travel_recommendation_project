const inputField = document.getElementById('destinationInput');
const searchBtn = document.getElementById('btnSearch');
const resetBtn = document.getElementById('resetbtn');
const result = document.getElementById('searchResult');


searchBtn.addEventListener('click', checkInput);

resetBtn.addEventListener('click', () => {
    inputField.value = '';
    clearResults();
});
 

function checkInput() {
    const input = inputField.value.trim().toLowerCase();
    if (!input) {
        alert('Please enter a destination or keyword.');
        return;
    } else {
        getRecommendations(input);
    }
}


function getRecommendations(input) {
    const url = "travel_recommendation_api.json";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const travelInfo = data;
            let recommendations = [];

            //check if input matches any keyword categories in data
            //checkMatchedKey(input,travelInfo);
            const matchedKey = checkMatchedKey(input, travelInfo);
            if (matchedKey) {
                travelInfo[matchedKey].forEach(item => recommendations.push(item));
            } else {

                //if no keyword match, check for country name or city name matches
                for (let category in travelInfo) {
                    for (let item of travelInfo[category]) {
                        let matchedCity;
                        if (item.name.toLowerCase() === input) {
                            matchedCity = item.cities;
                        } else if (item.cities) {
                            matchedCity = item.cities.filter(city => city.name.toLowerCase().includes(input));
                        }
                        if (matchedCity) {
                            matchedCity.forEach(city => recommendations.push(city));
                        }
                    }
                }
            }
            return recommendations;
        })
        .then(recommendations => {
            if (recommendations.length > 0) {
                displayRecommendations(recommendations);
                return;
            } else { 
            result.innerHTML = `<p>Sorry, no information found for ${input}. Please try another destination or keyword.</p>`;
            result.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.5);');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            result.textContent = 'An error occurred while fetching data. Please try again later.';
            result.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.5);');
        })
}

function checkMatchedKey(inputTerm, data) {
    const matchedKey = Object.keys(data).find(key => key.toLowerCase().includes(inputTerm));
    return matchedKey;
}


function displayRecommendations(recommendations) {
    clearResults();
    if (recommendations) {
        recommendations.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('card');
            itemDiv.setAttribute('style', 'background-color: rgba(255, 255, 255, 0.7);')

            const itemImg = document.createElement('img');
            itemImg.setAttribute('src', item.imageUrl);
            itemImg.setAttribute('style', 'display: block; width: 100%;')

            const itemTextDiv = document.createElement('div');
            itemTextDiv.classList.add('card-text');

            const itemName = document.createElement('h4');
            itemName.textContent = item.name;
            const itemDesc = document.createElement('p');
            itemDesc.textContent = item.description;
            const visitLink = document.createElement('a');
            visitLink.setAttribute('href', '#');
            visitLink.textContent= 'Visit';

            itemTextDiv.appendChild(itemName);
            itemTextDiv.appendChild(itemDesc);
            itemTextDiv.appendChild(visitLink);

            itemDiv.appendChild(itemImg);
            itemDiv.appendChild(itemTextDiv);

            result.appendChild(itemDiv);
            result.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.3);');

        })
    } 
}

function clearResults() {
    
    result.innerHTML = '';
    result.removeAttribute('style', 'background-color: rgba(0, 0, 0, 0.5);');
}