export const IdGenerator = {
    genererIdSignalement(): string {
        const min = 1000;
        const max = 9999;
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        return `ORN-${rand}`;
    },

    genererIdHistorique(): string {
        return Math.random().toString(36).substring(2, 10);
    }
};
