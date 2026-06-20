import { randomChoice } from "./random"

const tags = [
    "alpha", "bravo", "charlie", "delta", "echo", "foxtrot",
    "golf", "hotel", "india", "juliet", "kilo", "lima",
    "mike", "november", "oscar", "papa", "quebec", "romeo",
    "sierra", "tango", "uniform", "victor", "whiskey",
    "xray", "yankee", "zulu",

    "gamma", "epsilon", "iota", "kappa", "lambda",
    "sigma", "upsilon",
    "zero", "six", "seven",

    "pixel", "byte", "flux", "volt",
    "quark", "spark", 

    "apple", "banana", "peach", "cherry", "mango", "kiwi",
    "soda", "candy",

    "turbo", "hyper", "super", "ultra", "mega", "omega", "extra",
    "fast", "nitro", "drift", "rush", "boost", "flash",
    "shock", "charge", "vector", "jet",
    
    "nova", "orbit", "astro", "luna", "neo", "void",
    "cosmo", "solar","comet", "meteor"
]

// Возвращает никнейм в формате tag-tag-tag
export default function getUsername() {
    return Array.from(
        { length: 3 },
        () => randomChoice(tags)
    ).join("-")
}