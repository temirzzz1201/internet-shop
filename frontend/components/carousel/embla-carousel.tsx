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

  const onNavButtonClick = useCallback(() => {
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [autoplay])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  return (
    <Box className="embla">
      <Box className="embla__viewport" ref={emblaRef}>
        <Box className="embla__container">
          {slides.map((url) => (
            <Box className="embla__slide" key={url}>
                <Image
                  onClick={handleOpen}
                  h={imageClass ? imageClass : '160'} 
                  objectFit='fill' 
                  // w="100%" 
                  w="auto" 
                  src={url}
                  alt={url}
                  cursor='pointer'
                />
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="embla__controls">
        <Box className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </Box>
      </Box> 
    </Box>
  )
}

export default EmblaCarousel
