/* eslint-env mocha */
import Model from '../src/Model'
import assert from 'assert'

describe('Model', () => {
  it('should instantiate with initial state', () => {
    const model = new Model({
      foo: 'bar'
    })
    assert.equal(model.get(['foo']), 'bar')
  })
  it('should instantiate with initial state', () => {
    const model = new Model({
      foo: 'bar'
    })
    assert.equal(model.get(['foo']), 'bar')
  })
  it('should grab nested state', () => {
    const model = new Model({
      foo: {
        bar: 'value'
      }
    })
    assert.equal(model.get(['foo', 'bar']), 'value')
  })
  it('should be able to flush changed paths', () => {
    const model = new Model({
      foo: {
        bar: 'value'
      }
    })
    model.set(['foo', 'bar'], 'value2')
    assert.deepEqual(model.flush(), {foo: {bar: true}})
  })

  describe('SET', () => {
    it('should be able to set state', () => {
      const model = new Model({})
      model.set(['foo'], 'bar')
      assert.deepEqual(model.get(), {foo: 'bar'})
    })
  })
  describe('PUSH', () => {
    it('should be able to push to array', () => {
      const model = new Model({
        list: []
      })
      model.push(['list'], 'bar')
      assert.deepEqual(model.get(), {list: ['bar']})
    })
  })
  describe('MERGE', () => {
    it('should be able to merge objects', () => {
      const model = new Model({
        foo: {
          valA: 'foo'
        }
      })
      model.merge(['foo'], {valB: 'bar'})
      assert.deepEqual(model.get(), {foo: {valA: 'foo', valB: 'bar'}})
    })
    it('should flush changes to merged keys as well', () => {
      const model = new Model({
        foo: {
          valA: 'foo'
        }
      })
      model.merge(['foo'], {valB: 'bar'})
      assert.deepEqual(model.flush(), {foo: {valB: true}})
    })
  })
  describe('POP', () => {
    it('should be able to pop arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.pop(['list'])
      assert.deepEqual(model.get(), {list: ['foo']})
    })
  })
  describe('SHIFT', () => {
    it('should be able to shift arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.shift(['list'])
      assert.deepEqual(model.get(), {list: ['bar']})
    })
  })
  describe('UNSHIFT', () => {
    it('should be able to unshift arrays', () => {
      const model = new Model({
        list: ['foo']
      })
      model.unshift(['list'], 'bar')
      assert.deepEqual(model.get(), {list: ['bar', 'foo']})
    })
  })
  describe('SPLICE', () => {
    it('should be able to splice arrays', () => {
      const model = new Model({
        list: ['foo', 'bar']
      })
      model.splice(['list'], 1, 1, 'bar2')
      assert.deepEqual(model.get(), {list: ['foo', 'bar2']})
    })
  })
  describe('UNSET', () => {
    it('should be able to unset keys', () => {
      const model = new Model({
        foo: 'bar'
      })
      model.unset(['foo'])
      assert.deepEqual(model.get(), {})
    })
  })
  describe('CONCAT', () => {
    it('should be able to concat array', () => {
      const model = new Model({
        foo: ['foo']
      })
      model.concat(['foo'], ['bar'])
      assert.deepEqual(model.get(), {foo: ['foo', 'bar']})
    })
  })
  describe('Prevent mutations', () => {
    it('should freeze initial state if passed freeze option', () => {
      const model = new Model({
        foo: 'bar',
        list: {
          items: []
        }
      }, {preventExternalMutations: true})
      assert.throws(() => {
        model.state.foo = 'bar2'
      })
      assert.throws(() => {
        model.state.list = 'bar2'
      })
      assert.throws(() => {
        model.state.list.items[0] = 'bar2'
      })
    })
    it('should update non object values', () => {
      const model = new Model({
        foo: 'bar'
      }, {preventExternalMutations: true})
      model.set(['foo'], 'bar2')
      assert.equal(model.state.foo, 'bar2')
      assert.throws(() => {
        model.state.foo = 'bar3'
      })
    })
    it('should update object values', () => {
      const model = new Model({
        foo: {}
      }, {preventExternalMutations: true})
      assert.throws(() => {
        model.state.foo.bar = 'bar3'
      })
      model.merge(['foo'], {key1: 'value1'})
      assert.deepEqual(model.state.foo, {key1: 'value1'})
      assert.throws(() => {
        model.state.foo.key2 = 'bar3'
      })
    })
    it('should update array values', () => {
      const model = new Model({
        foo: []
      }, {preventExternalMutations: true})
      assert.throws(() => {
        model.state.foo[0] = 'bar3'
      })
      model.push(['foo'], 'bar')
      assert.deepEqual(model.state.foo, ['bar'])
      assert.throws(() => {
        model.state.foo[1] = 'bar3'
      })
    })
    it('should update nested values', () => {
      const model = new Model({
        foo: {
          bar: 'baz'
        }
      }, {preventExternalMutations: true})
      model.set(['foo', 'bar'], 'baz2')
      assert.equal(model.state.foo.bar, 'baz2')
      assert.throws(() => {
        model.state.foo.bar = 'baz3'
      })
    })
    it('should throw when updating invalid path', () => {
      const model = new Model({
        foo: 'bar'
      }, {preventExternalMutations: true})
      assert.throws(() => {
        model.set(['foo', 'bar'], 'baz2')
      })
    })
  })
  describe('Enforce serializable', () => {
    it('should throw error if value inserted is not serializable', () => {
      const model = new Model({
        foo: 'bar'
      }, {enforceSerializable: true})
      assert.throws(() => {
        model.set(['foo'], new Date())
      })
    })
    it('should throw error if value inserted is not serializable', () => {
      const model = new Model({
        foo: 'bar'
      }, {enforceSerializable: true})
      assert.doesNotThrow(() => {
        model.set(['foo'], [])
      })
    })
  })
})