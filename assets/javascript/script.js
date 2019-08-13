const script = function() {
    const _animals = ["Cat", "Dog", "Parrot", "Donkey", "Bat"];
    let _buttonTemplate = null;
    let _cardTemplate = null;

    const _addButtons = function() {
        const buttonHeader = document.getElementById("buttonHeader");
        buttonHeader.innerHTML = "";
        for (let i = 0; i < _animals.length; i++) {
            const button = _buttonTemplate.cloneNode(true);
            button.value = _animals[i];
            button.addEventListener("click", _clickButton);
            buttonHeader.append(button);
        }
    }

    const _buildCards = function(data) {
        const gifs = data.data;
        const gifsContainer = document.getElementById("gifsContainer");
        for (let i = 0; i < gifs.length; i++) {
            const card = _cardTemplate.cloneNode(true);
            card.getElementsByTagName("img")[0].src = gifs[i].images.fixed_height_small.url;
            card.getElementsByTagName("img")[0].setAttribute("data-alt-url", gifs[i].images.fixed_height_small_still.url);
            card.getElementsByClassName("card-header-title")[0].textContent = gifs[i].title;
            card.getElementsByClassName("title")[0].textContent = "Rating: " + gifs[i].rating;
            const date = new Date(gifs[i].import_datetime);
            card.getElementsByClassName("subtitle")[0].textContent = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();;
            card.getElementsByClassName("link")[0].href = gifs[i].source;
            card.addEventListener("click", _clickCard);
            card.getElementsByClassName("card-header-icon")[0].addEventListener("click", _clickFavorite);
            gifsContainer.append(card);
        }
    }

    const _clickButton = function() {
        const gifsContainer = document.getElementById("gifsContainer");
        gifsContainer.innerHTML = "";
        _getGifs(this.value);
    }

    const _clickCard = function() {
        const img = this.getElementsByTagName("img")[0];
        const oldUrl = img.src;
        img.src = img.getAttribute("data-alt-url");
        img.setAttribute("data-alt-url", oldUrl);
    }

    const _clickFavorite = function() {
        alert("fav");
    }

    const _getGifs = function(searchTerm) {
        let queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm;
        queryUrl += "&api_key=IGV5h9TIf7TmAyAz8T95NyoY3tHyeTqJ&limit=10&rating=pg-13";
        fetch(queryUrl).then(function(response) {
            return response.json();
        }).then(_buildCards);
    }

    const _search = function() {
        event.preventDefault();
        const term = document.getElementById("addAnimalInput").value.toLowerCase();
        let exists = false;
        for (let i = 0; i < _animals.length; i++) {
            if (_animals[i].toLowerCase() === term) {
                exists = true;
            }
        }
        if (!exists) {
            _animals.push(term);
            _addButtons();
        }
    }

    const _init = function() {
        _buttonTemplate = document.getElementById("buttonTemplate").children[0].cloneNode(true);
        _cardTemplate = document.getElementById("cardTemplate").children[0].cloneNode(true);
        _addButtons();
        document.getElementById("form").addEventListener("submit", _search);
    }

	document.addEventListener("DOMContentLoaded", function() {
		_init();
	});
}();