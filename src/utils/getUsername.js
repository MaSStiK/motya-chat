import { randomChoice } from "./random"

const tags = [
    "alpha", "bravo", "charlie", "delta", "echo", "foxtrot",
    "golf", "hotel", "india", "juliet", "kilo", "lima",
    "mike", "november", "oscar", "papa", "quebec", "romeo",
    "sierra", "tango", "uniform", "victor", "whiskey",
    "xray", "yankee", "zulu",

    "gamma", "epsilon", "iota", "kappa", "lambda",
    "sigma", "upsilon", "six", "seven",

    "pixel", "byte", "flux", "nexo", "volt",
    "quark", "spark", "turbo",

    "nova", "orbit", "astro", "luna",
    "zero", "hyper",

    "yolo", "bento", "mojo", "candy",
    "soda", "kiwi", "mango",

    "super", "titan",

    "vexo", "neo", "void", "robo",
    "ninja", "dash", "mint",

    "cosmo", "solar", "stellar", "comet",
    "meteor", "plasma", "neutron", "galaxy",
    "nebula", "eclipse", "saturn", "mars",
    "venus", "apollo", "rocket", "ion",
    "quantum",

    "rush", "boost", "flash", "blaze",
    "rapid", "nitro", "zoom", "drift",
    "surge", "core", "pulse", "ghost", "zen"
]

// Возвращает никнейм в формате tag-tag-tag
export default function getUsername() {
    return Array.from(
        { length: 3 },
        () => randomChoice(tags)
    ).join("-")
}