import { useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
    IconChartDots,
    IconChartDots2,
    IconChartPieFilled,
    IconMusicBolt,
} from '@tabler/icons-react';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
    icon: typeof IconChartDots;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const mockdata = [
    { icon: IconChartDots, label: 'Modelo 1' },
    { icon: IconChartDots2, label: 'Modelo 2' },
    { icon: IconChartPieFilled, label: 'Graficas' },
];
interface NavbarMinimalProps {
    onModelClick: (label: string) => void;
}

export function NavbarMinimal({ onModelClick }: NavbarMinimalProps) {
    const [active, setActive] = useState(2);

    const links = mockdata.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => {
                setActive(index);
                onModelClick(link.label);
            }}
        />
    ));

    return (
        <nav className={classes.navbar}>
            <Center>
                <IconMusicBolt type="mark" size={30} />
            </Center>

            <div className={classes.navbarMain}>
                <Stack justify="center" gap={0}>
                    {links}
                </Stack>
            </div>
        </nav>
    );
}