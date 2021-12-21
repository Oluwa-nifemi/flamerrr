import GSAP from "gsap";

class Color {
    change(
        {
            color,
            backgroundColor
        }
    ) {
        GSAP.to(
            document.documentElement,
            {
                backgroundColor,
                color,
                duration: 1.5
            }
        )
    }
}

export const ColorManager = new Color()