

mapboxgl.accessToken =mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
     center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9, // starting zoom
      
});
//console.log(coordinates);

const marker= new mapboxgl.Marker({ color: 'red' })
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(
    ` <h4>${listing.location}</h4><p>Exact location wil be  provided after booking!</p>`

)
.setMaxWidth("300px"))
.addTo(map);