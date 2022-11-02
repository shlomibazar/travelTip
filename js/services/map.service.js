import { locService } from "./loc.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo,
    addListener,
    
}
window.addListener = addListener

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            gMap.addListener('click', ev =>{
                const name = prompt('place Name ?')
                const lat = ev.latLng.lat()
                const lng = ev.latLng.lng()
                console.log('lat',lat)
                console.log('lng',lng)
                console.log('name',name)
                var newLoc = addLocation(name,lat,lng)
                console.log('newLoc',newLoc)
                locService.setLocs(newLoc)
            })
        })
        
}

function addLocation(name,lat,lng){
    return{
        name,
        lat,
        lng,
    }
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}




function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyA7YRB2I0n5wQtwdcEfCSyFA3YrqJvZDgY'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function addListener(map){
    console.log('i in listner')
    
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
    });

    infoWindow.open(map);

    
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );
        var lat = mapsMouseEvent.latLng.toJSON().lat
        var lng = mapsMouseEvent.latLng.toJSON().lng
        console.log('lat', lat)
        console.log('lng', lng)
        _saveLocations(lat, lng)
        infoWindow.open(map);
    });
}