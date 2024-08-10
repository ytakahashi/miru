import { ApplicationSetting } from '@/application/domain/model/application.js'

describe('ApplicationSetting', () => {
  it('equals', () => {
    const setting1 = new ApplicationSetting('abc')
    const setting2 = new ApplicationSetting('abc')
    expect(setting1.equals(setting2)).toBeTruthy()
  })

  it('not equals', () => {
    const setting1 = new ApplicationSetting('abc')
    const setting2 = new ApplicationSetting('xyz')
    expect(setting1.equals(setting2)).toBeFalsy()
  })
})
