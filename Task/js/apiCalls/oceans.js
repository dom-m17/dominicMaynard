export default async function getOcean(params) {

    const { lat, lng } = params

    try{
        const response = await fetch(`http://api.geonames.org/oceanJSON?lat=${lat}&lng=${lng}&username=dom_m17`)
        const data = await response.json()
        return data

    } catch (error) {
            console.log('Error making API call:', error);
        };
}