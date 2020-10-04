import {
  FenPositionResponse,
  Worker
} from './is-valid-fen-position-head'

import IsValid from './is-valid'

function isValidFenPosition(
  worker: Worker
): FenPositionResponse {

  return new IsValid( worker ).result

}

export = isValidFenPosition
