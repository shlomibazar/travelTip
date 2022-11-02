
import { storageService } from "./storageService.js"



export const locService = {
    getLocs,
    setLocs,
    deleteloc,

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


function deleteloc(locs,id){
    const lockIdx = locs.findIndex(loc => id === loc.id)
    locs.splice(lockIdx, 1)
    storageService.saveToStorage(STORAGE_KEY, locs)
}