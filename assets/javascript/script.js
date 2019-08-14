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

    const _buildCards = function(gifs, isFavorite) {
        const gifsContainer = document.getElementById("gifsContainer");
        for (let i = 0; i < gifs.length; i++) {
            const card = _cardTemplate.cloneNode(true);
            card.addEventListener("click", _clickCard);
            card.getElementsByClassName("card-header-icon")[0].addEventListener("click", _clickFavorite);
            if (isFavorite) {
                card.getElementsByClassName("icon")[0].classList.add("has-text-danger");
            }
            _fillCard(card, gifs[i]);
            gifsContainer.append(card);
        }
    }

    const _buildObject = function(container) {
        const favorite = {
            date: container.getElementsByClassName("subtitle")[0].textContent,
            id: container.getAttribute("data-id"),
            image_alt_url: container.getElementsByTagName("img")[0].getAttribute("data-alt-url"),
            image_url: container.getElementsByTagName("img")[0].src,
            rating: container.getElementsByClassName("rating")[0].textContent,
            source: container.getElementsByClassName("link")[0].href,
            title: container.getElementsByClassName("card-header-title")[0].textContent
        }
        return favorite;
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

    const _clickFavorite = function(event) {
        const container = event.target.closest(".gif-container");
        const favorite = _buildObject(container);
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (container.getElementsByClassName("icon")[0].classList.contains("has-text-danger")) {
            container.getElementsByClassName("icon")[0].classList.remove("has-text-danger");
            for (let i = 0; i < favorites.length; i++) {
                if (favorites[i].id === favorite.id) {
                    favorites.splice(i, 1);
                }
            }
        } else {
            container.getElementsByClassName("icon")[0].classList.add("has-text-danger");
            favorites.push(favorite);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    const _fillCard = function(card, obj) {
        card.getElementsByTagName("img")[0].src = obj.image_url || obj.images.fixed_height_small.url;
        card.getElementsByTagName("img")[0].setAttribute("data-alt-url", obj.image_alt_url || obj.images.fixed_height_small_still.url);
        card.getElementsByClassName("card-header-title")[0].textContent = obj.title || obj.title !== "" ? obj.title : "(no title)";
        card.getElementsByClassName("rating")[0].textContent = obj.rating.toUpperCase();
        const date = new Date(obj.date || obj.import_datetime);
        card.getElementsByClassName("subtitle")[0].textContent = (date.getMonth() + 1) + "/" + (date.getDate() + 1) + "/" + date.getFullYear();
        card.getElementsByClassName("link")[0].href = obj.source;
        card.setAttribute("data-id", obj.id);
    }

    const _getGifs = function(searchTerm) {
        let queryUrl = "https://api.giphy.com/v1/gifs/search?q=" + searchTerm;
        queryUrl += "&api_key=IGV5h9TIf7TmAyAz8T95NyoY3tHyeTqJ&limit=10&rating=pg-13";
        fetch(queryUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            _buildCards(favorites, true);
            let gifs = [];
            for (let i = 0; i < data.data.length; i++) {
                const card = _cardTemplate.cloneNode(true);
                _fillCard(card, data.data[i]);
                const gif = _buildObject(card);
                let exists = false;
                for (let j = 0; j < favorites.length; j++) {
                    if (favorites[j].id === gif.id) {
                        exists = true;
                    }
                }
                if (!exists) {
                    gifs.push(gif);
                }
            }
            _buildCards(gifs);
        });
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
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        _buildCards(favorites, true);
    }

	document.addEventListener("DOMContentLoaded", function() {
		_init();
	});
}();