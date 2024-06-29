

class MarvelService {
    _apiBase = "https://gateway.marvel.com:443/v1/public/"
    _apiKey = "apikey=270f82bfdb95ec7c4d5ecb38e9ea14b5"
    _baseOffset = 210;

    getResourse = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error on ${url}`)
        }

        return await res.json();
    }

    getAllCharacters = async(baseOffset = this._baseOffset) => {
        const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${baseOffset}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    }

    getCharacter = async(id) => {
        const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }

    _transformCharacter = (char) => {
        const description = this._checkDescription(char.description) 

        return {
            id: char.id,
            name: char.name,
            description: description,
            src: char.thumbnail.path + "." + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    _checkDescription = (desc) => {
        if (!desc.length) {
            return "Lorem ipsum dolor sit amet, consectetur adipisicing." 
        } else if (desc.length >= 100) {
            return desc.slice(0, 99) + "..."
        } else {
            return desc
        }
    }
}

export default MarvelService;