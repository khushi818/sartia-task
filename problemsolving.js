// palindrome function 

function checkPalindrome(value) {
    let stringValue = ''

    for( let a = value.length - 1 ; a >= 0 ;  a--){
         stringValue += value[a]
    }

    return stringValue === value
}

console.log(checkPalindrome('abba'))

//unique value from an array 

function uniqueValue(array, k){
    const map = new Map()

    for(let i = 0 ; i < array.length ; i++)
    {
       if(map.has(array[i])){
          map.set(array[i], map.get(array[i]) + 1)
       }
       else {
          map.set(array[i], 1)
       }
    }

    for(let [key, value] of map){
        if(value === 1){
            return key
        }
    }
}

const value = uniqueValue([1,1,2,2,3,4,4,5,5])

console.log(value)

// count duplicate value 

function countDuplicateValue(array){
    let count = 0
    const map = new Map()

    for(let i = 0 ; i < array.length ; i++)
    {
       if(map.has(array[i])){
          map.set(array[i], map.get(array[i]) + 1)
       }
       else {
          map.set(array[i], 1)
       }
    }

    for(let [key, value] of map){
        if(value !== 1){
            count++
        }
    }

     return count
}

const count = countDuplicateValue([1,1,2,2,3,4,4,5,5])

console.log(count)