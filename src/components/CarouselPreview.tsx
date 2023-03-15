import {
  Fragment,
  useState,
  forwardRef,
  useImperativeHandle,
  Ref,
} from 'react';
import Image from 'next/image';
import { X, CaretLeft, CaretRight } from 'phosphor-react';
import { useSwipeable } from 'react-swipeable';
import { Dialog, Transition } from '@headlessui/react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

import { ipfsEndpoint } from '@configs/globalsConfig';
import { ImageSkeleton } from '@components/skeletons/ImageSkeleton';

interface CarouselPreviewProps {
  images: {
    ipfs: string;
    type: string;
  }[];
  currentImage: {
    ipfs: string;
    type: string;
  };
  index: number;
  handleSelectedImage: (index) => void;
}

function CarouselPreviewComponent(
  { index, images, handleSelectedImage, currentImage }: CarouselPreviewProps,
  ref: Ref<HTMLInputElement | any>
) {
  let [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal,
    };
  });

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        handleSelectedImage(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        handleSelectedImage(index - 1);
      }
    },
    trackMouse: true,
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute top-0 bottom-0 left-0 right-0 inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 bg-neutral-900/70 backdrop-blur-2xl">
          <div className="flex flex-col h-screen">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex justify-center w-full h-screen overflow-hidden">
                <button
                  type="button"
                  className="btn btn-ghost btn-square hover:bg-black/75 absolute top-0 right-0 z-50"
                  onClick={closeModal}
                >
                  <X size={24} />
                </button>
                <MotionConfig
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  <div className="max-w-7xl max-h-screen w-full mx-auto">
                    <div
                      className="relative aspect-square w-full h-full"
                      {...handlers}
                    >
                      {currentImage ? (
                        <>
                          {currentImage?.type === 'image' ? (
                            <Image
                              src={`${ipfsEndpoint}/${currentImage?.ipfs}`}
                              fill
                              className="object-contain"
                              priority
                              alt="Template image"
                              sizes="max-w-2xl"
                            />
                          ) : (
                            <video
                              muted
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-contain"
                            >
                              <source
                                src={`${ipfsEndpoint}/${currentImage?.ipfs}`}
                                type="video/mp4"
                              />
                            </video>
                          )}
                        </>
                      ) : (
                        <ImageSkeleton />
                      )}
                    </div>

                    <div className="initial max-h-full w-full z-50">
                      {index >= 1 && (
                        <button
                          className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                          style={{ transform: 'translate3d(0, 0, 0)' }}
                          onClick={() => handleSelectedImage(index - 1)}
                        >
                          <CaretLeft size={32} />
                        </button>
                      )}
                      {index + 1 < images.length && (
                        <button
                          className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                          style={{ transform: 'translate3d(0, 0, 0)' }}
                          onClick={() => handleSelectedImage(index + 1)}
                        >
                          <CaretRight size={32} />
                        </button>
                      )}
                    </div>

                    <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
                      <motion.div
                        initial={false}
                        className="mx-auto mt-6 flex aspect-square h-14"
                      >
                        <AnimatePresence initial={false}>
                          <div className="flex flex-row aspect-square w-full h-14">
                            {images.map((item, key) => (
                              <motion.button
                                initial={{
                                  width: '0%',
                                  x: `${Math.max(
                                    (index - 1) * -100,
                                    15 * -100
                                  )}%`,
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
                          </div>
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>
                </MotionConfig>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
export const CarouselPreview = forwardRef(CarouselPreviewComponent);
