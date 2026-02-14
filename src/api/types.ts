export type GetCharactersResponse = {
    entities: {
        character: CharacterData[]
    }
}

export type CharacterData = {
    id: number,
    name: string,
    images: CharacterImage[]
};

type CharacterImage = {
    id: number,
    type: "icon" | "stockIcon",
    url: string
}

export type Tournament = {
    id: number,
    name: string,
    addrState: string,
    venueAddress: string,
    numAttendees: string,
    startAt: number,
    slug: string,
    images: TournamentImage[]
}

export type TournamentImage = {
    id: number,
    url: string,
    height: string,
    width: string,
    type: string
}