const Colors = Object.freeze({
    reset: '\x1b[0m',
    fg: {
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        white: '\x1b[37m',
    },
});

export const logger = {
    warn: (...args: any[]) => console.log(`${Colors.fg.yellow}%s${Colors.reset}`, args.join(' ')),
    log: (...args: any[]) => console.log(`${Colors.fg.green}%s${Colors.reset}`, args.join(' ')),
};
