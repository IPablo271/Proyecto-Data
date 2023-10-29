import React, { useState } from 'react';
import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

type InputWithButtonProps = TextInputProps & {
    onSearch: (value: string) => void;
};

const myColor: MantineColorsTuple = [
    '#e5feee',
    '#d2f9e0',
    '#a8f1c0',
    '#7aea9f',
    '#53e383',
    '#3bdf70',
    '#2bdd66',
    '#1ac455',
    '#0caf49',
    '#00963c'
];

const themegreen = createTheme({
    colors: {
        myColor,
    }
});

export function InputWithButton({ onSearch, ...props }: InputWithButtonProps) {
    const theme = themegreen;
    const [inputValue, setInputValue] = useState('');

    const handleSearchClick = () => {
        onSearch(inputValue);
    };

    return (
        <TextInput
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            radius="xl"
            size="md"
            placeholder="Buscar artista"
            rightSectionWidth={42}
            leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
            rightSection={
                <ActionIcon
                    size={32}
                    radius="xl"
                    color="green"
                    variant="filled"
                    onClick={handleSearchClick}
                >
                    <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
            }
            {...props}
        />
    );
}
