'use client'
import './embla-carousel.css'
import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './embla-carousel-btns'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { Image, Box } from '@chakra-ui/react'

type PropType = {
  slides: string[]
  options?: EmblaOptionsType
  handleOpen?: () => void
  autoPlayFlag?: boolean
  imageClass?: string
}

const EmblaCarousel: React.FC<PropType> = ({ slides, options, handleOpen, autoPlayFlag, imageClass}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])
  const autoplay = emblaApi?.plugins()?.autoplay

  if (!autoPlayFlag) autoplay?.stop()

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((url) => (
            <div className="embla__slide" key={url}>
                <Image
                onClick={handleOpen}
                  h={imageClass ? imageClass : '140'} 
                  objectFit='fill' 
                  w="100%" 
                  src={url}
                  alt={url}
                />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div> 
    </section>
  )
}

export default EmblaCarousel
