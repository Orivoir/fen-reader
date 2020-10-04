import json2array from './../json2array/json2array'
import array2fen from './../array2fen/array2fen'

function json2fen(jsonFen: {
  [keyname:string]: string
}): string {

  return array2fen( json2array( jsonFen ) )
}

export = json2fen