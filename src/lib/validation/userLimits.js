const USER_LIMITS = {
    name: {
        min: 2,
        max: 32,
    },
    email: {
        max: 128,
    },
    password: {
        min: 8,
        max: 256,
    },
    avatar: {
        max: 1024,
    }
};

export default USER_LIMITS;