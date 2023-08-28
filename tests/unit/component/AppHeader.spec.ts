import { shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'
import AppHeader from '@/components/AppHeader.vue'
import { routerKey, routeLocationKey } from 'vue-router'

const elem = document.createElement('div')
document.body.appendChild(elem)

const mockRoute = {
  path: '/',
}

describe('AppHeader.vue', () => {
  it('renders', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.findAll('router-link-stub')).toHaveLength(5)
  })

  it('pushes / on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: {
            path: '/issues',
          },
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.s')
    expect(mockRouter.push).toHaveBeenCalledWith('/')
  })

  it('does not push / on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.s')
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('pushes /commits on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.c')
    expect(mockRouter.push).toHaveBeenCalledWith('/commits')
  })

  it('pushes /issues on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.i')
    expect(mockRouter.push).toHaveBeenCalledWith('/issues')
  })

  it('pushes /pulls on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.p')
    expect(mockRouter.push).toHaveBeenCalledWith('/pulls')
  })

  it('pushes /releases on keydown', async () => {
    const mockRouter = {
      push: vi.fn(),
    }

    const wrapper = shallowMount(AppHeader, {
      attachTo: elem,
      global: {
        provide: {
          [routerKey as symbol]: mockRouter,
          [routeLocationKey as symbol]: mockRoute,
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await wrapper.trigger('keydown.ctrl.r')
    expect(mockRouter.push).toHaveBeenCalledWith('/releases')
  })
})
