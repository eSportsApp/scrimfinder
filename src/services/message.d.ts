interface Message {
    type: string;
    game: string;
    guildId: string;
    platform: string;
    region: string;
    user: {
        id: string;
        displayName: string;
        avatar: string;
    }
    best_of: number;
    date: string;
    time: string;
    class: string;
    extrainfo?: string;
    openSearch?: boolean;
}