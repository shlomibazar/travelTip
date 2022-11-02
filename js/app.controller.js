import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'




window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onSearch = onSearch
window.onCopyLink = onCopyLink
// window.addListener = addListener

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function renderMarkers(){
    locService.getLocs()
        .then(locs => {
         locs.forEach(loc => onAddMarker(loc))
        
        })
}

function onAddMarker({lat,lng}) {
    console.log('Adding a marker')
    mapService.addMarker({ lat, lng })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            renderLocs(locs)
            renderMarkers()
        }
            
        )
}

function onDeleteLoc(id) {
    locService.getLocs()
        .then(locs => {
            locService.deleteloc(locs, id)
            renderLocs(locs)
        })

}

function onSearch() {
    var userInput = document.querySelector('.search-bar').value
    console.log('userInput', userInput)
    const API_KEY = '807633838475146651756x80'
    const API = `https://geocode.xyz/${userInput}?json=1&auth=${API_KEY}`
    fetch(API)
        .then(res => res.json())
        .then(data => {
            onPanTo(data.latt, data.longt)
            var newLoc = mapService.addLocation(userInput, data.latt, data.longt)
            locService.setLocs(newLoc)
        })
}
// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

function onCopyLink() {
    
    locService.getLocs()
        .then(locs => getLastLoc(locs))
  

}
function getLastLoc(locs) {
    var length = locs.length - 1
    // locs[length]
    const queryStringParams = `?lat=${locs[length].lat}&lng=${locs[length].lng}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
    console.log(newUrl);

}



function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`

        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}





function renderLocs(locs) {

    const elUserTable = document.querySelector('.usersTable')
    elUserTable.innerHTML = `
    <tr>
        <th>id</th>
        <th>name</th>
        <th>lat</th>
        <th>lang</th>
        <th>createdAt</th>
        
    </tr>`
    // var strHtmls = locService.getLocs()
    var strHtmls = locs.map(loc => `
        <tr>
        <td> ${loc.id} </td>
        <td> ${loc.name} </td>
        <td> ${loc.lat} </td>
        <td> ${loc.lng} </td>
        <td> ${loc.createdAt} </td>
        <td> <button onclick="onPanTo(${loc.lat},${loc.lng})">Go</button></td>
        <td> <button class="btn-remove" onclick="onDeleteLoc('${loc.id}')">Delete</button></td>
        </tr>
        `
    )

    // console.log('strHtmls',strHtmls)
    elUserTable.innerHTML += strHtmls.join('')

}