import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/"
    const _apiKey = "apikey=270f82bfdb95ec7c4d5ecb38e9ea14b5"


    const getAllCharacters = async(baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${baseOffset}&${_apiKey}`);

        return res.data.results.map(_transformCharacter)
    }

    const getCharacter = async(id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0])
    }

    const _transformCharacter = (char) => {
        const description = _checkDescription(char.description) 

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

    const _checkDescription = (desc) => {
        if (!desc.length) {
            return "Lorem ipsum dolor sit amet, consectetur adipisicing." 
        } else if (desc.length >= 100) {
            return desc.slice(0, 99) + "..."
        } else {
            return desc
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;