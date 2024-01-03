export default async function getOcean(params) {

    const { lat, lng } = params

    try{
        fetch(`http://api.geonames.org/oceanJSON?lat=${lat}&lng=${lng}&username=dom_m17`)
        .then(response => response.json())
        .then(data => {
            return data
        })

    } catch (error) {
            console.log('Error making API call:', error);
        };
}