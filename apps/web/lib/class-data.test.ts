import { describe, it, expect } from 'vitest'
import {
  HERO_CLASSES,
  getClassById,
  calcMaxHp,
  calcTickInterval,
  calcCritChance,
  STAT_KEYS,
} from './class-data'

describe('class data integrity', () => {
  it('has exactly 6 classes', () => {
    expect(HERO_CLASSES).toHaveLength(6)
  })

  it('all classes have 25 total base stats', () => {
    for (const cls of HERO_CLASSES) {
      const total = STAT_KEYS.reduce((sum, key) => sum + cls.baseStats[key], 0)
      expect(total).toBe(25)
    }
  })

  it('all classes have growth weights summing to 100', () => {
    for (const cls of HERO_CLASSES) {
      const total = STAT_KEYS.reduce((sum, key) => sum + cls.growthWeights[key], 0)
      expect(total).toBe(100)
    }
  })

  it('all starter weapons have weaponPower 5', () => {
    for (const cls of HERO_CLASSES) {
      expect(cls.starterWeapon.weaponPower).toBe(5)
    }
  })

  it('Epoch Mage has magical weapon type', () => {
    const mage = getClassById('epoch_mage')
    expect(mage.starterWeapon.weaponType).toBe('magical')
  })

  it('non-mage classes have physical weapons', () => {
    const nonMages = HERO_CLASSES.filter((c) => c.id !== 'epoch_mage')
    for (const cls of nonMages) {
      expect(cls.starterWeapon.weaponType).toBe('physical')
    }
  })
})

describe('derived stat formulas', () => {
  it('Chronoknight HP at Lv1 = 105', () => {
    const ck = getClassById('chronoknight')
    expect(calcMaxHp(ck.baseStats.vit)).toBe(105)
  })

  it('Timestomper HP at Lv1 = 60', () => {
    const ts = getClassById('timestomper')
    expect(calcMaxHp(ts.baseStats.vit)).toBe(60)
  })

  it('Unflappable HP at Lv1 = 135', () => {
    const uf = getClassById('unflappable')
    expect(calcMaxHp(uf.baseStats.vit)).toBe(135)
  })

  it('Loot Gremlin crit at Lv1 = 4.5%', () => {
    const lg = getClassById('loot_gremlin')
    expect(calcCritChance(lg.baseStats.lck)).toBeCloseTo(0.045)
  })

  it('Chronoknight tick interval at Lv1', () => {
    const ck = getClassById('chronoknight')
    const tick = calcTickInterval(ck.baseStats.spd)
    expect(tick).toBeCloseTo(2.885, 2)
  })
})

describe('getClassById', () => {
  it('finds each class by id', () => {
    expect(getClassById('chronoknight').name).toBe('Chronoknight')
    expect(getClassById('loot_gremlin').name).toBe('Loot Gremlin')
  })

  it('throws for unknown class', () => {
    expect(() => getClassById('wizard' as never)).toThrow('Unknown class: wizard')
  })
})
