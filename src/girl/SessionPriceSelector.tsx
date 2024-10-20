import { useT } from "src/i18n/useT"
import { Button } from "../ui/button/Button"
import { Section } from "../ui/section/Section"

export interface SessionPriceSelectorProp {
  sessionPrice: number
  updateSessionPrice: (param: { action: "delta"; delta: number }) => void
}

export function SessionPriceSelector(prop: SessionPriceSelectorProp) {
  let { sessionPrice, updateSessionPrice } = prop
  let { t } = useT()
  let changeSessionPrice = (delta: number) => () => {
    updateSessionPrice({ action: "delta", delta })
  }
  return (
    <Section className="flow my-2 py-0 text-center">
      <div>{t("Session price")}</div>
      <Button onClick={changeSessionPrice(-10)} className="mr-1 text-sm">
        -10
      </Button>
      <Button onClick={changeSessionPrice(-1)} className="mr-1 text-sm">
        -1
      </Button>
      <span>
        {sessionPrice}
        {t("g")}
      </span>
      <Button onClick={changeSessionPrice(+1)} className="mx-1 text-sm">
        +1
      </Button>
      <Button onClick={changeSessionPrice(+10)} className="text-sm">
        +10
      </Button>
    </Section>
  )
}
