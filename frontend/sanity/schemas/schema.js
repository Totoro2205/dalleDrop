// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'


import collection from './collection'
import creator from './creator'

export default createSchema({
  name: 'default',
 
  types: schemaTypes.concat([
    collection,
    creator,
  ]),
})
