export default async function getWikiSearch(params) {

    const { q } = params

    try{
        const response = await fetch(`http://api.geonames.org/wikipediaSearchJSON?q=${q}&maxRows=1&username=dom_m17`)
        const data = await response.json()
        console.log(data)
        return data

    } catch (error) {
            console.log('Error making API call:', error);
        };
}