import { Carousel } from '@mantine/carousel';
import { Image } from '@mantine/core';

import Modelo1accuracy from '../../images/Modelo1accuracy.png';
import Modelo1 from '../../images/Modelo1.png';

import Modelo2accuracy from '../../images/Modelo2accuracy.png';
import Modelo2 from '../../images/Modelo2.png';




export function CardsCarousel() {
    return (
        <Carousel slideSize="20%" height={200} slideGap="md" loop>
            <Carousel.Slide>
                <h1>Modelo 1</h1>
                <Image style={{ width: '50%' }}
                    radius="md"
                    src={Modelo1accuracy}
                />
            </Carousel.Slide>
            <Carousel.Slide>
                <h1>Modelo 1</h1>
                <Image style={{ width: '50%' }}
                    radius="md"
                    src={Modelo1}
                />
            </Carousel.Slide>
            <Carousel.Slide>
                <h1>Modelo 2</h1>
                <Image style={{ width: '50%' }}
                    radius="md"
                    src={Modelo2accuracy}
                />
            </Carousel.Slide>
            <Carousel.Slide>
                <h1>Modelo 2</h1>
                <Image style={{ width: '50%' }}
                    radius="md"
                    src={Modelo2}
                />
            </Carousel.Slide>

        </Carousel>
    );
}