
import { storageService } from "./storageService.js"



export const locService = {
    getLocs,
    setLocs,
}


const STORAGE_KEY = 'locDB'


const locs = storageService.loadFromStorage(STORAGE_KEY) || []

// [
    
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 0)
    })
}


function setLocs(newLoc){
    locs.push(newLoc)
    storageService.saveToStorage(STORAGE_KEY, locs)
    console.log('locs',locs);
}