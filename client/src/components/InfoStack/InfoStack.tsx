import { useState, useEffect } from 'react';
import { Avatar, Table, Text, ScrollArea } from '@mantine/core';
import axios from 'axios';

interface ArtistaProps {
    nombre: string;
    cancion: string;
}

interface InfoStackProps {
    artistas: ArtistaProps[];
}

export function InfoStack({ artistas }: InfoStackProps) {
    const [artistImages, setArtistImages] = useState<{ [key: string]: string }>({});
    const defaultAvatar = 'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80';

    const CLIENT_ID = '2ea7924f1ffb4e75865343facc89e0cb';
    const CLIENT_SECRET = 'b57b0ade186f4471b961cdffcbc9d2e8';

    useEffect(() => {
        const getAccessToken = async () => {
            const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
            const encoded_credentials = btoa(credentials);

            try {
                const response = await axios.post("https://accounts.spotify.com/api/token",
                    "grant_type=client_credentials",
                    {
                        headers: {
                            "Authorization": `Basic ${encoded_credentials}`,
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }
                );

                return response.data.access_token;
            } catch (error) {
                console.error('Error getting access token', error);
            }
        };

        const fetchArtistImage = async (artistName: string, accessToken: string) => {
            try {
                const response = await axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    }
                );

                if (response.data.artists.items.length > 0) {
                    const imageUrl = response.data.artists.items[0].images[0]?.url || defaultAvatar;
                    setArtistImages(prevState => ({ ...prevState, [artistName]: imageUrl }));
                }
            } catch (error) {
                console.error(`Error fetching data for artist: ${artistName}`, error);
            }
        };

        (async () => {
            const accessToken = await getAccessToken();
            if (accessToken) {
                for (let artista of artistas) {
                    fetchArtistImage(artista.nombre, accessToken);
                }
            }
        })();
    }, [artistas]);

    const rows = artistas.map((artista) => (
        <Table.Tr key={`${artista.nombre}-${artista.cancion}`}>
            <Table.Td>
                <Avatar size={40} src={artistImages[artista.nombre] || defaultAvatar} radius={40} />
                <Text fz="sm" fw={500}>
                    {artista.nombre}
                </Text>
                <Text c="dimmed" fz="xs">
                    {artista.cancion}
                </Text>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <ScrollArea h={800} offsetScrollbars scrollbarSize={2} scrollHideDelay={0}>
            <Table.ScrollContainer minWidth={800}>
                <Table verticalSpacing="md">
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </ScrollArea>
    );
}
