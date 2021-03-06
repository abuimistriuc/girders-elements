'use strict'

import R from 'ramda'
import invariant from 'invariant'

// required subsystems
import * as SubSystem from '../subsystem'
import '../update'
import '../effect'
import '../enrich'
import '../transform'

import { PatternRegistry, chainRegistries } from '../registry'

import * as impl from './impl'
import * as http from './http'
import * as readActions from './actions'

const registryAttribute = '@@girders-elements/_readRegistry'
const fallback = impl.fallback

/**
 * Extension point for defining reads
 */
SubSystem.extend(() => {
  const readRegistry = new PatternRegistry()

  return {
    read: {
      [registryAttribute]: readRegistry,

      /**
       * registers a new read in the subystem.
       */
      register: readRegistry.register.bind(readRegistry),

      reset: readRegistry.reset.bind(readRegistry),

      /**
       * symbol identifying the fallback read. Use it to register a fallback read
       *
       *     read.register(read.fallback, read.httpRead);
       *
       */
      default: fallback,
      fallback,

      /**
       * HTTP methods
       */
      http,
    },
  }
})

const read = SubSystem.create((system, instantiatedSubsystems) => {
  invariant(
    instantiatedSubsystems.transform != null,
    'The read subsystem depends on the transform subsystem.' +
      'You must place it in the subsystem list **before** the read.'
  )

  const registry = getCombinedRegistry(system.subsystemSequence)
  const enrichment = instantiatedSubsystems.enrich.buildEnricher()
  const transformation = instantiatedSubsystems.transform.buildTransformer()

  const config = { registry, enrichment, transformation, kernel: system }

  return {
    name: 'read',
    context: config,
  }
})

read.effect.forKind([], effects => {
  effects.register(readActions.types.read, impl.read)
  effects.register(readActions.types.readRefresh, impl.readRefresh)
})

read.update.forKind([], updates => {
  updates.register(readActions.types.setLoading, impl.setLoading)
  updates.register(readActions.types.setRefreshing, impl.setRefreshing)
  updates.register(
    readActions.types.setRefreshMetadata,
    impl.setRefreshMetadata
  )
  updates.register(readActions.types.apply, impl.applyRead)
  updates.register(readActions.types.fail, impl.fail)
})

export default read

const getRegistry = R.path(['read', registryAttribute])

const getCombinedRegistry = R.pipe(
  R.map(getRegistry),
  R.reject(R.isNil),
  chainRegistries
)
