import { useEffect, useState } from "react";
import { getAllCharacters } from "../api/metadata";
import { CharacterData } from "../api/types";

export const useAllCharacters = () => {
    const [characters, setCharacters] = useState<CharacterData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        getAllCharacters().then((characters) => {
            setLoading(false);
            setCharacters(characters);
        })
    }, []);
    return {characters, loading};
}