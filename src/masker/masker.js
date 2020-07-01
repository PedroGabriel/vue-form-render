import maskit from './maskit'
import dynamicMask from './dynamic-mask'
import defaultTokens from './tokens'

// Facade to maskit/dynamicMask when mask is String or Array
export default function(value, mask, masked = true, tokens = defaultTokens) {
  // disable on empty mask
  if (!Array.isArray(mask) && !mask) {
    return value
  }

  return Array.isArray(mask)
    ? dynamicMask(maskit, mask, tokens)(value, mask, masked, tokens)
    : maskit(value, mask, masked, tokens)
}
