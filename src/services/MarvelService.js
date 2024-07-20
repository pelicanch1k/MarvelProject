import useHttp from '../hooks/http.hook';

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/"
    const _apiKey = "apikey=270f82bfdb95ec7c4d5ecb38e9ea14b5"


    const getAllCharacters = async(baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${baseOffset}&${_apiKey}`);

        return res.data.results.map(TransformData.transformCharacter)
    }

    const getAllComics = async(baseOffset) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${baseOffset}&${_apiKey}`);

        return res.data.results.map(TransformData.transformComics)
    }

    const getCharacter = async(id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);

        return TransformData.transformCharacter(res.data.results[0])
    }

    const getComics = async(id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);

		return TransformData.transformCharacter(res.data.results[0]);
	};

    return {loading, error,
         
        getAllCharacters, getCharacter,
        getAllComics, getComics,

        clearError,
    }
}

class TransformData{
    static transformCharacter = (char) => {
        const description = TransformData._checkDescription(char.description) 

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

    static transformComics = (comics) => {
        return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			src: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			// optional chaining operator
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
    }

    static _checkDescription = (desc) => {
        if (!desc.length) {
            return "Lorem ipsum dolor sit amet, consectetur adipisicing." 
        } else if (desc.length >= 100) {
            return desc.slice(0, 99) + "..."
        } else {
            return desc
        }
    }



}

export default useMarvelService;