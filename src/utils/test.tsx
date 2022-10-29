import { render, RenderOptions } from "@testing-library/react"
import { ReactElement, ReactNode } from "react"
import { configureAxe } from "vitest-axe"
import { QueryClientProvider } from "@tanstack/react-query"
import { generateQueryClient } from "utils/query"
import { MakeGenerics, Router, ReactLocation } from "@tanstack/react-location"
import * as matchers from "vitest-axe/matchers"
import userEvent from "@testing-library/user-event"

type LocationGenerics = MakeGenerics<{
  Params: never
}>

const location = new ReactLocation<LocationGenerics>()
const routes = [
  {
    path: "/",
    element: <></>
  }
]

interface RenderProps {
  children?: ReactNode
}

const AllTheProviders = ({ children }: RenderProps) => {
  const queryClient = generateQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <Router location={location} routes={routes}>
        {children}
      </Router>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, {
    wrapper: args => AllTheProviders({ ...args }),
    ...options
  })

const extendExpectForAxe = () => {
  expect.extend(matchers)
}

const configureAxeForReactComponents = () => {
  const axe = configureAxe({
    rules: {
      region: { enabled: false }
    }
  })
  return axe
}

export * from "@testing-library/react"
export { customRender as render, userEvent, configureAxeForReactComponents, extendExpectForAxe }
