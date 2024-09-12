import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"

export interface SessionPriceSelectorProp {
  sessionPrice: number
  setSessionPrice: (priceAction: React.SetStateAction<number>) => void
}

export function SessionPriceSelector(prop: SessionPriceSelectorProp) {
  let { sessionPrice, setSessionPrice } = prop
  let changeSessionPrice = (delta: number) => () => {
    setSessionPrice((price) => price + delta)
  }
  return (
    <Section className="flow my-2 py-0 text-center">
      <div>Session price</div>
      <Button onClick={changeSessionPrice(-10)} className="mr-1 text-sm">
        -10
      </Button>
      <Button onClick={changeSessionPrice(-1)} className="mr-1 text-sm">
        -1
      </Button>
      <span>{sessionPrice}g</span>
      <Button onClick={changeSessionPrice(+1)} className="mx-1 text-sm">
        +1
      </Button>
      <Button onClick={changeSessionPrice(+10)} className="text-sm">
        +10
      </Button>
    </Section>
  )
}
