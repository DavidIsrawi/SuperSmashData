import { CharacterData } from "./types";

export async function getAllCharacters(): Promise<CharacterData[]> {
    return (await import(/* webpackChunkName: "staticFluentEmojis" */ `./jsons/smashCharacters.json`)).default.entities.character as CharacterData[];
}