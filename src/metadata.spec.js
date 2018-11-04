import Substore from './'

describe('Substore action metadata', () => {
  it('sets requestAction metadata', () => {
    const substore = new Substore({
      prefix: 'prefix/',
      actionMeta: { requestAction: { a: 1 } },
    })

    expect(substore.requestAction()).toHaveProperty('meta', { a: 1 })
  })
  it('does not set requestAction metadata when not provided', () => {
    const substore = new Substore({
      prefix: 'prefix/',
    })

    expect(substore.requestAction()).toHaveProperty('meta', undefined)
  })

  it('sets failureAction metadata', () => {
    const substore = new Substore({
      prefix: 'prefix/',
      actionMeta: { failureAction: { a: 1 } },
    })

    expect(substore.failureAction()).toHaveProperty('meta', { a: 1 })
  })
  it('does not set failureAction metadata when not provided', () => {
    const substore = new Substore({
      prefix: 'prefix/',
    })

    expect(substore.failureAction()).toHaveProperty('meta', undefined)
  })

  it('sets successAction metadata', () => {
    const substore = new Substore({
      prefix: 'prefix/',
      actionMeta: { successAction: { a: 1 } },
    })

    expect(substore.successAction()).toHaveProperty('meta', { a: 1 })
  })
  it('does not set successAction metadata when not provided', () => {
    const substore = new Substore({
      prefix: 'prefix/',
    })

    expect(substore.successAction()).toHaveProperty('meta', undefined)
  })

  it('sets clearAction metadata', () => {
    const substore = new Substore({
      prefix: 'prefix/',
      actionMeta: { clearAction: { a: 1 } },
    })

    expect(substore.clearAction()).toHaveProperty('meta', { a: 1 })
  })
  it('does not set clearAction metadata when not provided', () => {
    const substore = new Substore({
      prefix: 'prefix/',
    })

    expect(substore.clearAction()).toHaveProperty('meta', undefined)
  })
})
