import { expect } from 'chai'
import { ApplicationSetting } from '@/domain/model/application'

describe('ApplicationSetting', () => {
  it('equals', () => {
    const setting1 = new ApplicationSetting('abc')
    const setting2 = new ApplicationSetting('abc')
    expect(setting1.equals(setting2)).to.eq(true)
  })

  it('not equals', () => {
    const setting1 = new ApplicationSetting('abc')
    const setting2 = new ApplicationSetting('xyz')
    expect(setting1.equals(setting2)).to.eq(false)
  })
})
