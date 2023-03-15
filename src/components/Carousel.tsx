import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ImageSquare } from 'phosphor-react';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { CarouselPreview } from './CarouselPreview';
import { ImageSkeleton } from '@components/skeletons/ImageSkeleton';

interface CarouselProps {
  unique?: boolean;
  images: {
    ipfs: string;
    type: string;
  }[];
}

export function Carousel({ images, unique }: CarouselProps) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [index, setIndex] = useState(0);
  const modalRef = useRef(null);

  useEffect(() => {
    if (images?.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  useEffect(() => {
    if (selectedImage && images.length > 0) {
      setIndex(images.findIndex((item) => item === selectedImage));
    }
  }, [selectedImage, images]);

  function handleSelectedImage(index) {
    setSelectedImage(images[index]);
  }

  return (
    <>
      <MotionConfig
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <div
          onClick={() => selectedImage?.ipfs && modalRef.current?.openModal()}
          className={`relative w-full md:max-w-[14rem] md:min-w-[14rem] lg:max-w-sm lg:min-w-sm mx-auto aspect-square ${
            selectedImage?.ipfs && 'cursor-zoom-in'
          }`}
        >
          {selectedImage ? (
            <>
              {selectedImage?.type === 'image' && selectedImage?.ipfs ? (
                <Image
                  src={`${ipfsEndpoint}/${selectedImage?.ipfs}`}
                  fill
                  className="object-contain"
                  priority
                  alt="Template image"
                  sizes="max-w-sm"
                />
              ) : selectedImage?.type === 'video' && selectedImage?.ipfs ? (
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source
                    src={`${ipfsEndpoint}/${selectedImage?.ipfs}`}
                    type="video/mp4"
                  />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-700 text-white rounded-xl">
                  <ImageSquare size={96} />
                </div>
              )}
            </>
          ) : (
            <ImageSkeleton />
          )}
        </div>
        {!unique && (
          <div className="overflow-hidden">
            <motion.div
              initial={false}
              className="mx-auto mt-6 mb-6 flex aspect-square h-14"
            >
              <AnimatePresence initial={false}>
                <div className="flex flex-row aspect-square w-full h-14">
                  {images?.length > 0 ? (
                    <>
                      {images.map((item, key) => (
                        <motion.button
                          initial={{
                            width: '0%',
                            x: `${Math.max((index - 1) * -100, 15 * -100)}%`,
                          }}
                          animate={{
                            width: '100%',
                            x: `${Math.max(index * -100, 15 * -100)}%`,
                          }}
                          exit={{ width: '0%' }}
                          key={key}
                          type="button"
                          onClick={() => handleSelectedImage(key)}
                          className={`relative rounded-md inline-block w-full shrink-0 h-full transform-gpu overflow-hidden ${
                            key === index && 'border border-white'
                          }`}
                        >
                          {item.type === 'image' ? (
                            <Image
                              fill
                              className="object-cover p-1 rounded-md"
                              src={`${ipfsEndpoint}/${item?.ipfs}`}
                              alt="small images on the bottom"
                              sizes="max-w-xs"
                            />
                          ) : (
                            <video
                              muted
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-cover rounded-md p-1"
                            >
                              <source
                                src={`${ipfsEndpoint}/${item?.ipfs}`}
                                type="video/mp4"
                              />
                            </video>
                          )}
                        </motion.button>
                      ))}
                    </>
                  ) : (
                    <ImageSkeleton />
                  )}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </MotionConfig>
      {images && images.length > 0 && (
        <CarouselPreview
          ref={modalRef}
          images={images}
          currentImage={selectedImage}
          index={index}
          handleSelectedImage={handleSelectedImage}
        />
      )}
    </>
  );
}
